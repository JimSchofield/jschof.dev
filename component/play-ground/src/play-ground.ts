import { LitElement, css, html } from "lit";
import * as prettier from "prettier/standalone";
import prettierPluginBabel from "prettier/plugins/babel";
import prettierPluginEstree from "prettier/plugins/estree";
import prettierPluginHtml from "prettier/plugins/html";
import { customElement, state } from "lit/decorators.js";
import { basicSetup } from "codemirror";
import { EditorView, keymap, gutters, lineNumbers } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { html as htmlLang } from "@codemirror/lang-html";
import { debounce } from "./util";

const plugins = [prettierPluginBabel, prettierPluginEstree, prettierPluginHtml];

@customElement("play-ground")
export class PlayGround extends LitElement {
  // editor view always exists, or the component throws an error
  editorView!: EditorView;

  @state()
  docContents = "";

  get template() {
    return document.querySelector("template");
  }

  async initEditorView() {
    const parent = this.shadowRoot?.querySelector("#editor");

    if (!parent) {
      throw new Error(
        "something went wrong mounting the editor! No editor element",
      );
    }

    const template = this.template?.innerHTML.trim();

    if (!template) {
      throw new Error("No template found!");
    }

    const doc = await prettier.format(template, { parser: "html", plugins });

    this.editorView = new EditorView({
      doc,
      extensions: [
        basicSetup,
        keymap.of(defaultKeymap),
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

  handleDocUpdate = (view: any) => {
    const newDoc = view.state.doc.toString().trim();

    this.docContents = newDoc;
  };

  debouncedHandleDocUpdate = debounce(this.handleDocUpdate, 200);

  render() {
    return html`<div class="query-container">
      <div class="editor-container">
        <div id="editor">
          <button class="format-button" type="button">Format</button>
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
      border: 1px solid black;
    }
    .query-container {
      container-type: inline-size;
    }
    .editor-container {
      position: relative;
      display: flex;
      margin: 1em;

      & > * {
        width: 50%;
      }
    }

    .format-button {
      position: absolute;
      top: 0;
      right: 0;
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
