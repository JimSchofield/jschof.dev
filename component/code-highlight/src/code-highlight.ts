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

  @property({ attribute: "line-numbers", type: Boolean, reflect: true })
  lineNumbers = false;

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

  #dedent(text: string): string {
    const lines = text.replace(/^\n+/, "").replace(/\s+$/, "").split("\n");
    // Use the first non-empty line's indent as the base — template literals
    // or other embedded content may have less indentation than the code itself
    const firstNonEmpty = lines.find((l) => l.trim().length > 0);
    const baseIndent = firstNonEmpty?.match(/^(\s*)/)?.[1].length ?? 0;
    if (baseIndent === 0) return lines.join("\n");
    return lines.map((l) => l.startsWith(" ".repeat(baseIndent)) ? l.slice(baseIndent) : l).join("\n");
  }

  prettifyAndSet(content: string, parser = this.lang) {
    this.content = this.#dedent(content);

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

  @property({ attribute: "active-lines" })
  activeLines = "";

  @state()
  content = "";

  get #rendered() {
    return hljs.highlight(this.content, { language: this.lang }).value;
  }

  #splitIntoLines(highlightedHtml: string): string[] {
    const lines: string[] = [];
    let current = "";
    const openTags: string[] = [];

    let i = 0;
    while (i < highlightedHtml.length) {
      if (highlightedHtml[i] === "\n") {
        lines.push(current + openTags.map(() => "</span>").reverse().join(""));
        current = openTags.join("");
        i++;
      } else if (highlightedHtml[i] === "<") {
        const closeMatch = highlightedHtml.slice(i).match(/^<\/span>/);
        if (closeMatch) {
          current += closeMatch[0];
          openTags.pop();
          i += closeMatch[0].length;
        } else {
          const openMatch = highlightedHtml.slice(i).match(/^<span[^>]*>/);
          if (openMatch) {
            current += openMatch[0];
            openTags.push(openMatch[0]);
            i += openMatch[0].length;
          } else {
            current += highlightedHtml[i];
            i++;
          }
        }
      } else {
        current += highlightedHtml[i];
        i++;
      }
    }
    if (current) {
      lines.push(current + openTags.map(() => "</span>").reverse().join(""));
    }
    return lines;
  }

  #parseActiveLines(): Set<number> {
    const active = new Set<number>();
    if (!this.activeLines) return active;

    for (const part of this.activeLines.split(",")) {
      const trimmed = part.trim();
      if (trimmed.includes("-")) {
        const [a, b] = trimmed.split("-").map(Number);
        for (let i = a; i <= b; i++) active.add(i);
      } else {
        active.add(Number(trimmed));
      }
    }
    return active;
  }

  setActiveLines(lineSpec: string) {
    this.activeLines = lineSpec;
  }

  clearActiveLines() {
    this.activeLines = "";
  }

  getFirstActiveLine(): HTMLElement | null {
    return (
      this.shadowRoot?.querySelector<HTMLElement>(".line.active") ?? null
    );
  }

  getScrollContainer(): HTMLElement {
    return this;
  }

  private _lastRendered = "";

  updated(changed: Map<string, unknown>) {
    const codeEl = this.shadowRoot?.querySelector("code");
    if (!codeEl) return;

    const rendered = this.#rendered.trim();

    // Only rebuild DOM when the code content changes
    if (rendered !== this._lastRendered) {
      this._lastRendered = rendered;
      const lines = this.#splitIntoLines(rendered);
      codeEl.innerHTML = lines
        .map(
          (line, i) =>
            `<span class="line" data-line="${i + 1}">${line || "&nbsp;"}</span>`,
        )
        .join("");
    }

    // Update active/dimmed classes (preserves DOM so transitions work)
    if (changed.has("activeLines") || rendered !== this._lastRendered) {
      this.#applyActiveClasses(codeEl);
    }
  }

  #applyActiveClasses(codeEl: HTMLElement) {
    const active = this.#parseActiveLines();
    const hasActive = active.size > 0;
    const lineEls = codeEl.querySelectorAll<HTMLElement>(".line");

    for (const el of lineEls) {
      const lineNum = Number(el.dataset.line);
      const isActive = active.has(lineNum);
      el.classList.toggle("active", hasActive && isActive);
      el.classList.toggle("dimmed", hasActive && !isActive);
    }

  }

  render() {
    return html`<pre><code class="theme-tokyo-night-dark hljs"></code></pre>`;
  }

  static styles = [
    unsafeCSS(tokyoNight),
    css`
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      :host {
        display: block;
        max-width: 100%;
        max-height: var(--code-max-height, none);
        border-radius: var(--code-border-radius, 8px);
        overflow: auto;
        scrollbar-width: none;
      }

      :host::-webkit-scrollbar {
        display: none;
      }

      pre {
        margin: 0;
        width: 100%;
        border-radius: var(--code-border-radius, 8px);
      }

      code.hljs {
        width: 100%;
        min-width: fit-content;
        font-size: 0.85em;
        font-family: "Fira Code", monospace;
        line-height: 1.4;
        padding: 0.5rem 0.75rem;
        padding-bottom: var(--code-padding-bottom, 0.5rem);
        border: none;
      }

      :host([line-numbers]) code.hljs {
        padding-left: 0;
      }

      :host([line-numbers]) .line::before {
        content: attr(data-line);
        display: inline-block;
        width: 3ch;
        margin-right: 0.75em;
        text-align: right;
        color: rgba(255, 255, 255, 0.25);
        user-select: none;
      }

      .line {
        display: block;
        padding: 0 0.75rem;
        margin: 0 -0.75rem;
        background: transparent;
        transition: opacity 0.4s ease, background 0.4s ease;
      }

      .line.dimmed {
        opacity: 0.4;
      }

      .line.active {
        opacity: 1;
        background: rgba(255, 255, 255, 0.05);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "code-highlight": CodeHighlight;
  }
}
