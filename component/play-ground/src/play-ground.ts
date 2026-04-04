import { LitElement, css, html } from "lit";

import * as prettier from "prettier/standalone";
import prettierPluginBabel from "prettier/plugins/babel";
import prettierPluginCSS from "prettier/plugins/postcss";
import prettierPluginEstree from "prettier/plugins/estree";
import prettierPluginHtml from "prettier/plugins/html";

import { EditorView, keymap, drawSelection, gutters, lineNumbers } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { customElement, property, state } from "lit/decorators.js";
import { defaultKeymap } from "@codemirror/commands";
import { html as htmlLang } from "@codemirror/lang-html";
import { indentWithTab } from "@codemirror/commands";
import { tokyoNight } from "./codemirror-tokyo-night";
import { vim } from "@replit/codemirror-vim";

import { foldCode } from "@codemirror/language";

import { ReplPlaygroundState } from "../../repl-playground/src/repl-playground-state.js";
import { debounce } from "./util";

const plugins = [
  prettierPluginBabel,
  prettierPluginEstree,
  prettierPluginHtml,
  prettierPluginCSS,
];

@customElement("play-ground")
export class PlayGround extends LitElement {
  // editor view always exists, or the component throws an error
  editorView!: EditorView;

  @state()
  docContents = "";

  @state()
  private vimMode = false;

  @property()
  html = "";

  @property()
  fold = "";

  private iframe?: HTMLIFrameElement;
  private stateChangeCallback?: (newState: { vimMode: "enabled" | "disabled" }) => void;
  private darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  private darkModeListener = () => this.buildEditor();
  private themeObserver?: MutationObserver;

  get template() {
    return this.querySelector("template");
  }

  private get isDark() {
    const theme = document.documentElement.getAttribute("data-theme");
    if (theme === "dark") return true;
    if (theme === "light") return false;
    return this.darkModeQuery.matches;
  }

  connectedCallback() {
    super.connectedCallback();

    ReplPlaygroundState.initializeStorageListener();
    this.vimMode = ReplPlaygroundState.getVimMode();

    this.stateChangeCallback = (newState) => {
      const newVimMode = newState.vimMode === "enabled";
      if (this.vimMode !== newVimMode) {
        this.vimMode = newVimMode;
        this.buildEditor();
      }
    };
    ReplPlaygroundState.subscribe(this.stateChangeCallback);

    this.darkModeQuery.addEventListener("change", this.darkModeListener);
    this.themeObserver = new MutationObserver(() => this.buildEditor());
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
  }

  async initEditorView() {
    const doc = await this.getTemplate();
    this.docContents = doc;
    this.buildEditor(doc);

    if (!!this.fold) {
      this.foldLines();
    }
  }

  private buildEditor(doc?: string) {
    const parent = this.shadowRoot?.querySelector("#editor");
    if (!parent) return;

    const extensions = [];

    if (this.vimMode) {
      extensions.push(vim());
    }

    extensions.push(drawSelection());

    if (this.isDark) {
      extensions.push(tokyoNight);
    }

    extensions.push(
      basicSetup,
      keymap.of([...defaultKeymap, indentWithTab]),
      htmlLang(),
      lineNumbers(),
      gutters(),
      EditorView.updateListener.of(this.onEditorUpdate),
    );

    const startState = EditorState.create({
      doc: doc ?? this.editorView?.state.doc.toString() ?? "",
      extensions,
    });

    if (this.editorView) {
      this.editorView.destroy();
    }

    this.editorView = new EditorView({
      state: startState,
      parent,
    });
  }

  private foldLines() {
    const folds = this.fold.split(",").map(n => Number.parseInt(n));

    folds.forEach((line) => {
      const fromLine = this.editorView.state.doc.line(line);

      this.editorView.dispatch({
        selection: { anchor: fromLine.from },
      });

      foldCode(this.editorView);
    });
  }

  private async getTemplate() {
    if (this.html) {
      return await this.format(this.html);
    }

    // Case where we check template
    const template = this.template?.innerHTML.trim();
    const doc = await this.format(template);

    return doc;
  }

  async firstUpdated() {
    await this.initEditorView();
    this.setupIframe();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.stateChangeCallback) {
      ReplPlaygroundState.unsubscribe(this.stateChangeCallback);
    }
    this.darkModeQuery.removeEventListener("change", this.darkModeListener);
    this.themeObserver?.disconnect();
    this.editorView?.destroy();
  }

  private iframeContainer?: HTMLElement;

  private setupIframe() {
    this.iframeContainer = this.shadowRoot?.querySelector('#view-container') as HTMLElement;
    if (this.iframeContainer) {
      this.updateIframeContent();
    }
  }

  private updateIframeContent() {
    if (!this.iframeContainer) return;

    const raw = (this.docContents || "<!DOCTYPE html><p>Loading...</p>")
      .replace(`shadowrootmode="open."`, `shadowrootmode="open"`);
    const content = raw.includes("<head>")
      ? raw.replace("<head>", `<head><style>html{background:#fff;color:#000;color-scheme:light}</style>`)
      : `<style>html{background:#fff;color:#000;color-scheme:light}</style>${raw}`;

    // Replace the iframe entirely to avoid history entries and get a fresh
    // CustomElementRegistry (prevents "name already used" errors on re-render)
    if (this.iframe) {
      this.iframe.remove();
    }
    this.iframe = document.createElement('iframe');
    this.iframe.sandbox.add('allow-scripts', 'allow-forms', 'allow-same-origin');
    this.iframe.srcdoc = content;
    this.iframeContainer.appendChild(this.iframe);
  }

  async format(template: string = "") {
    const doc = await prettier.format(template, { parser: "html", plugins });

    // Convert boolean attributes from attr="" back to just attr
    // Common boolean attributes in HTML and custom elements
    const booleanAttrs = [
      'open', 'disabled', 'checked', 'selected', 'readonly', 'required', 
      'autofocus', 'autoplay', 'controls', 'defer', 'hidden', 'loop', 
      'multiple', 'muted', 'reversed', 'scoped', 'async', 'default',
      // Custom element boolean attributes that might be used in examples
      'visible', 'active', 'expanded', 'loading', 'invalid', 'complete', 'bool-attr'
    ];
    
    let formatted = doc;
    booleanAttrs.forEach(attr => {
      // Replace attr="" with just attr
      const regex = new RegExp(`\\s${attr}=""`, 'g');
      formatted = formatted.replace(regex, ` ${attr}`);
    });

    return formatted;
  }

  private toggleVimMode() {
    ReplPlaygroundState.setVimMode(!this.vimMode);
  }

  async doFormat() {
    const formatted = await this.format(this.docContents);

    const { state } = this.editorView;
    const transaction = state.update({
      changes: { from: 0, to: state.doc.length, insert: formatted },
    });
    this.editorView.update([transaction]);
  }

  handleDocUpdate = () => {
    this.docContents = this.editorView.state.doc.toString().trim();
    this.updateIframeContent();
  };

  debouncedHandleDocUpdate = debounce(this.handleDocUpdate, 200);

  onEditorUpdate = (view: any) => {
    if (!view.docChanged) return;
    this.debouncedHandleDocUpdate();
  };

  render() {
    return html`<div part="container" class="query-container">
      <div class="editor-container">
        <div class="editor-wrapper">
          <div id="editor"></div>
          <div class="controls">
            <button
              part="editor-format-button"
              class="format-button"
              type="button"
              @click=${this.doFormat}
            >
              Format
            </button>
            <label class="vim-toggle">
              <input
                type="checkbox"
                class="sr-only"
                .checked=${this.vimMode}
                @change=${this.toggleVimMode}
              />
              <span class="toggle-track ${this.vimMode ? "active" : ""}">
                <span class="toggle-thumb"></span>
              </span>
              Vim mode
            </label>
          </div>
        </div>
        <div id="view-container"></div>
      </div>
    </div>`;
  }

  static styles = css`
    :host {
      display: block;
    }

    #editor {
      font-size: 14px;
    }

    .query-container {
      container-type: inline-size;
      border: 1px solid var(--border, #333);
      border-radius: 8px;
      overflow: hidden;
    }

    .editor-container {
      position: relative;
      display: flex;

      & > * {
        width: 50%;
      }
    }

    #view-container {
      display: flex;
      border-left: 1px solid var(--border, #333);
    }

    #view-container iframe {
      width: 100%;
      border: none;
      color-scheme: light;
    }

    .editor-wrapper {
      display: flex;
      flex-direction: column;
    }

    .controls {
      display: flex;
      gap: 8px;
      padding: 6px 8px;
      border-top: 1px solid var(--border, #333);
      background: var(--bg, #fafafa);
    }

    .controls button {
      padding: 0.25em 1em 0.2em;
      font-size: 0.833rem;
      cursor: pointer;
      border: none;
      border-radius: 8px;
      background: var(--button-bg, #1b2f36);
      color: var(--button-text, #fafafa);
      box-shadow: var(--shadow, 0 4px 8px rgba(0, 0, 0, 0.2));
      transition: color 0.2s;
    }

    .controls button:hover,
    .controls button:active {
      background: var(--gradient, var(--button-bg, #1b2f36));
      color: var(--button-text, #fafafa);
    }

    .controls button:focus-visible {
      outline: 2px solid var(--link, #906b56);
      outline-offset: 1px;
      background: var(--gradient, var(--button-bg, #1b2f36));
      color: var(--button-text, #fafafa);
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    .vim-toggle {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-left: auto;
      cursor: pointer;
      font-size: 0.833rem;
      color: var(--text, #1b2f36);
      user-select: none;
    }

    .sr-only:focus-visible + .toggle-track {
      outline: 2px solid var(--link, #906b56);
      outline-offset: 2px;
    }

    .toggle-track {
      display: inline-block;
      position: relative;
      width: 32px;
      height: 18px;
      border-radius: 9px;
      background: var(--border-subtle, #d5d5d5);
      border: 1.5px solid var(--border, #1b2f36);
      box-sizing: border-box;
      transition: background 0.2s;
    }

    .toggle-track.active {
      background: var(--accent-secondary, #1b2f36);
    }

    .toggle-thumb {
      position: absolute;
      top: 1.5px;
      left: 1.5px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--bg, #fafafa);
      transition: transform 0.2s;
    }

    .toggle-track.active .toggle-thumb {
      transform: translateX(14px);
    }

    @container (max-width: 900px) {
      .editor-container {
        flex-direction: column;

        & > * {
          width: initial;
        }
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "play-ground": PlayGround;
  }
}
