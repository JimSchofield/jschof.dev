import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

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
  createRenderRoot() {
    return this;
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

    // Not sure this is needed
    // The slot has no change handlers
    // Not sure someone could mess with it...
    // Array.from(this.children).forEach((child) => child.remove());
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
    if (this.dontPretty) {
      this.content = content;
    } else {
      prettier
        .format(content, { parser, plugins })
        .then((result) => (this.content = result));
    }
  }

  @property()
  lang = "html";

  @state()
  content = "";

  get #rendered() {
    return hljs.highlight(this.content, { language: this.lang }).value;
  }

  render() {
    return html` <style>
        code-highlight {
          display: flex;

          & pre {
            display: flex;
          }
        }
        ${tokyoNight}
      </style>
      <pre>
<code
  .innerHTML=${this.#rendered.trim()}
  class="theme-tokyo-night-dark hljs
        "
>
</code>
    </pre>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "code-highlight": CodeHighlight;
  }
}
