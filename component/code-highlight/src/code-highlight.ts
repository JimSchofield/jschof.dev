import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "highlight.js/styles/tokyo-night-dark.css";

import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import cssHighlight from "highlight.js/lib/languages/css";

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

    if (["javascript", "typescript"].includes(this.lang)) {
      // We expect a single script tag to hold content in DOM
      const content =
        this.querySelector("template")?.content.querySelector(
          "script",
        )?.innerHTML;

      if (!content) {
        throw new Error(
          `Language is ${this.lang}, however there is no script tag that would contain the code to highlight`,
        );
      }

      this.content = content;
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
    return html`<div>
      <pre>
<code
  .innerHTML=${this.#rendered.trim()}
  class="theme-tokyo-night-dark hljs
        "
>
</code>
    </pre>
    </div>`;
  }

  static styles = css``;
}

declare global {
  interface HTMLElementTagNameMap {
    "code-highlight": CodeHighlight;
  }
}
