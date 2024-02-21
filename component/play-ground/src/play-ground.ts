import { LitElement, css, html } from "lit";
import * as prettier from "prettier/standalone";
import prettierPluginBabel from "prettier/plugins/babel";
import prettierPluginCSS from "prettier/plugins/postcss";
import prettierPluginEstree from "prettier/plugins/estree";
import prettierPluginHtml from "prettier/plugins/html";
import { EditorView, keymap, gutters, lineNumbers } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { customElement, state } from "lit/decorators.js";
import { debounce } from "./util";
import { defaultKeymap } from "@codemirror/commands";
import { html as htmlLang } from "@codemirror/lang-html";
import { indentWithTab } from "@codemirror/commands";

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

    const template = this.template?.innerHTML.trim();

    const doc = await this.format(template);

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

    this.docContents = newDoc;
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
          sandbox="allow-scripts"
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
