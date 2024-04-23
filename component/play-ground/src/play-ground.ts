import { LitElement, css, html } from "lit";

import * as prettier from "prettier/standalone";
import prettierPluginBabel from "prettier/plugins/babel";
import prettierPluginCSS from "prettier/plugins/postcss";
import prettierPluginEstree from "prettier/plugins/estree";
import prettierPluginHtml from "prettier/plugins/html";

import { EditorView, keymap, gutters, lineNumbers } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { customElement, property, state } from "lit/decorators.js";
import { defaultKeymap } from "@codemirror/commands";
import { html as htmlLang } from "@codemirror/lang-html";
import { indentWithTab } from "@codemirror/commands";

import { foldCode } from "@codemirror/language";

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

  @property()
  html = "";

  @property()
  fold = "";

  get template() {
    return this.querySelector("template");
  }

  async initEditorView() {
    const parent = this.shadowRoot?.querySelector("#editor");

    if (!parent) {
      throw new Error(
        "something went wrong mounting the editor! No editor element",
      );
    }

    const doc = await this.getTemplate();

    this.editorView = new EditorView({
      doc,
      extensions: [
        basicSetup,
        keymap.of([...defaultKeymap, indentWithTab]),
        htmlLang(),
        lineNumbers(),
        gutters(),
        EditorView.updateListener.of(this.debouncedHandleDocUpdate),
      ],
      parent,
    });

    if (!!this.fold) {
      this.foldLines()
    }
  }

  private foldLines() {
    const folds = this.fold.split(",").map(n => Number.parseInt(n));

    folds.forEach((line) => {
      const fromLine = this.editorView.state.doc.line(line);

      this.editorView.dispatch({
        selection: {
          anchor: fromLine.to,
          head: fromLine.from,
        },
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
    this.initEditorView();
  }

  async format(template: string = "") {
    const doc = await prettier.format(template, { parser: "html", plugins });

    return doc;
  }

  async doFormat() {
    const formatted = await this.format(this.docContents);

    const { state } = this.editorView;
    const transaction = state.update({
      changes: { from: 0, to: state.doc.length, insert: formatted },
    });
    this.editorView.update([transaction]);
  }

  handleDocUpdate = (view: any) => {
    const newDoc = view.state.doc.toString().trim();

    // Allows us to stop eager parsing of declarative shadow dom
    // so we can use declarative shadow doms in our examples :)
    const res = newDoc.replace(
      `shadowrootmode="open."`,
      `shadowrootmode="open"`,
    );

    this.docContents = res;
  };

  debouncedHandleDocUpdate = debounce(this.handleDocUpdate, 200);

  render() {
    return html`<div part="container" class="query-container">
      <div class="editor-container">
        <div id="editor">
          <button
            part="editor-format-button"
            class="button format-button"
            type="button"
            @click=${this.doFormat}
          >
            Format
          </button>
        </div>
        <iframe
          sandbox="allow-scripts allow-forms"
          id="view"
          srcdoc=${this.docContents || "<!DOCTYPE html><p>Loading...</p>"}
        ></iframe>
      </div>
    </div>`;
  }

  static styles = css`
    #editor {
      font-size: 14px;
      border: 1px solid black;
      position: relative;
    }

    .query-container {
      container-type: inline-size;
    }

    .editor-container {
      position: relative;
      display: flex;

      & > * {
        width: 50%;
      }
    }

    .format-button {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 100;
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
