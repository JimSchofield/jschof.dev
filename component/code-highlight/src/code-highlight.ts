import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeCSS } from "lit";

import tokyoNight from "highlight.js/styles/tokyo-night-dark.css?inline";

import * as prettier from "prettier/standalone";
import prettierPluginBabel from "prettier/plugins/babel";
import prettierPluginTypescript from "prettier/plugins/typescript";
import prettierPluginCSS from "prettier/plugins/postcss";
import prettierPluginEstree from "prettier/plugins/estree";
import prettierPluginHtml from "prettier/plugins/html";

import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import cssHighlight from "highlight.js/lib/languages/css";

const plugins = [
  prettierPluginBabel,
  prettierPluginTypescript,
  prettierPluginEstree,
  prettierPluginHtml,
  prettierPluginCSS,
];

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("css", cssHighlight);

@customElement("code-highlight")
export class CodeHighlight extends LitElement {
  constructor() {
    super();
    if (!this.id) {
      // This is so live-reload diffing won't mix up instances
      // of this component
      this.id = `ch-${crypto.randomUUID().slice(0, 8)}`;
    }
  }

  connectedCallback() {
    super.connectedCallback();

    if (["javascript", "typescript", "tsx", "jsx"].includes(this.lang)) {
      this.handleScript();
    } else if ("css" === this.lang) {
      this.handleStyle();
    } else if (this.lang === "html") {
      this.handleTemplate();
    }
  }

  @property({ attribute: "dont-pretty", type: Boolean })
  dontPretty = false;

  private handleTemplate() {
    // We expect a single script tag in a template to hold content in DOM
    const fragment = this.querySelector("template")?.content;

    if (!fragment) {
      throw new Error("No document fragment for handling HTML formatting");
    }

    const content = Array.from(fragment.children)
      .map((child) => child.outerHTML)
      .join("");

    if (!content) {
      throw new Error(
        `Language is ${this.lang}, however there is no script tag that would contain the code to highlight`,
      );
    }

    this.prettifyAndSet(content);
  }

  private handleScript() {
    // We expect a single script tag in a template to hold content in DOM
    const content =
      this.querySelector("template")?.content.querySelector(
        "script",
      )?.innerHTML;

    if (!content) {
      throw new Error(
        `Language is ${this.lang}, however there is no script tag that would contain the code to highlight`,
      );
    }

    let parser: string;
    switch (this.lang) {
      case "javascript":
      case "jsx":
        parser = "babel";
        break;
      case "typescript":
      case "tsx":
        parser = "typescript";
        break;
      default:
        parser = "babel";
        break;
    }

    this.prettifyAndSet(content, parser);
  }

  private handleStyle() {
    // We expect a single style tag in a template tag to hold content in DOM
    const content =
      this.querySelector("template")?.content.querySelector("style")?.innerHTML;

    if (!content) {
      throw new Error(
        `Language is ${this.lang}, however there is no style tag that would contain the code to highlight`,
      );
    }

    this.prettifyAndSet(content);
  }

  prettifyAndSet(content: string, parser = this.lang) {
    this.content = content;

    if (!this.dontPretty) {
      prettier
        .format(content, { parser, plugins })
        .then((result) => (this.content = result))
        .catch(() => {
          // Keep raw content if prettier fails
        });
    }
  }

  @property()
  lang = "html";

  @state()
  content = "";

  get #rendered() {
    return hljs.highlight(this.content, { language: this.lang }).value;
  }

  updated() {
    const codeEl = this.shadowRoot?.querySelector("code");
    if (codeEl) {
      codeEl.innerHTML = this.#rendered.trim();
    }
  }

  render() {
    return html`<pre><code class="theme-tokyo-night-dark hljs"></code></pre>`;
  }

  static styles = [
    unsafeCSS(tokyoNight),
    css`
      :host {
        display: flex;
        max-width: 100%;
        overflow: auto;
      }

      pre {
        display: flex;
        margin: 0;
        width: 100%;
        border-radius: 8px;
        overflow: hidden;
      }

      code.hljs {
        width: 100%;
        font-size: 0.85em;
        font-family: "Fira Code", monospace;
        line-height: 1.4;
        padding: 0.5rem 0.75rem;
        border: none;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "code-highlight": CodeHighlight;
  }
}
