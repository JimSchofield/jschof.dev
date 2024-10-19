import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";
import { when } from "lit/directives/when.js";
import { map } from "lit/directives/map.js";

import Fuse from "fuse.js";

type Option = {
  title: string;
  excerpt?: string;
  url: string;
  categories: string[];
};

@customElement("quick-search")
export class QuickSearch extends LitElement {
  #dialog = createRef<HTMLDialogElement>();
  fuse?: Fuse<Option>;

  @state()
  private searchTerm = "";

  @state()
  private options: Option[] = [];

  connectedCallback(): void {
    super.connectedCallback();

    window.addEventListener("keydown", this.#handleKeyDown);

    this.options = this.#scrapeOptions();

    this.fuse = new Fuse(this.options, {
      keys: ["title", "categories", "excerpt"],
      shouldSort: true,
      includeScore: true,
      // includeMatches: true, // LATER!
    });
  }

  disconnectedCallback(): void {
    window.removeEventListener("keydown", this.#handleKeyDown);
  }

  #scrapeOptions() {
    const searchOptionNodes =
      this.querySelectorAll<HTMLElement>("search-option");

    if (!searchOptionNodes) return [];

    return Array.from(searchOptionNodes).map((el) => {
      const title = el.getAttribute("value") ?? "";
      const excerpt = el.getAttribute("excerpt") ?? "";
      const url = el.getAttribute("url") ?? "";
      const categories = el.getAttribute("categories")?.split(",") ?? [];

      return { title, excerpt, url, categories };
    });
  }

  get results() {
    if (!this.searchTerm || !this.fuse) {
      return [];
    }

    return this.fuse.search(this.searchTerm);
  }

  get hasResults() {
    return this.results.length > 0;
  }

  #handleKeyDown = (event: KeyboardEvent) => {
    const commandK = event.key === "k" && event.getModifierState("Meta");
    const controlK = event.key === "k" && event.getModifierState("Control");

    if (commandK || controlK) {
      this.open();
    }
  };

  #handleInput = (e: InputEvent) => {
    this.searchTerm = (e.target as HTMLInputElement).value;
  };

  open = () => {
    this.#dialog.value?.showModal();
  };

  close = () => {
    this.#dialog.value?.close();
  };

  render() {
    return html`
      <dialog part="qs-dialog" ${ref(this.#dialog)}>
        <div class="inner">
          <div class="controls">
            <input
              autofocus
              type="text"
              placeholder="Search for a page"
              part="qs-input"
              value=${this.searchTerm}
              @input=${this.#handleInput}
            />
            <button class="close" @click=${this.close}>Close</button>
          </div>
          <hr part="qs-divider" />
          <div part="qs-results" class="results">
            ${when(
              this.hasResults,
              () => html`
                <ul>
                  ${map(this.results, ({ item }) => {
                    return html`<li>
                      <a part="qs-result" class="result" href=${item.url}>
                        <div part="qs-title" class="title">${item.title}</div>
                        <div part="qs-excerpt" class="excerpt">
                          ${item.excerpt}
                        </div>
                        <div part="qs-categories" class="categories">
                          ${item.categories.map((category, index) => {
                            if (index === item.categories.length - 1) {
                              return html`<span>${category}</span>`;
                            } else {
                              return html`<span>${category},</span>`;
                            }
                          })}
                        </div>
                      </a>
                    </li>`;
                  })}
                </ul>
              `,
              () =>
                html`Enter a search term or select a category. Press escape to
                return.`,
            )}
          </div>
        </div>
      </dialog>
    `;
  }

  static styles = css`
    * {
      box-sizing: border-box;
    }

    *:focus-visible {
      outline: 2px solid #f79103;
      outline-offset: -2px;
    }

    dialog {
      margin-top: 10vh;
      height: auto;
      width: 80vw;
      max-width: 600px;
      max-height: 80vh;
      padding: 0;
      border: none;
      border-radius: 8px;
      color: #1b2f36;
      box-shadow: 0 3px 8px rgba(0, 0, 0.1);
      overflow: hidden;
    }

    dialog::backdrop {
      backdrop-filter: blur(2px);
    }

    .inner {
      max-height: 100%;
      padding: 0.75rem;
    }

    input {
      width: 100%;
      padding: 0.7rem;
      font: inherit;
      border: none;
    }

    hr {
      width: 100%;
      border: none;
      height: 1px;
      background: #376170;
    }

    ul {
      margin: 0;
      padding: 0;
      list-style-type: none;
      display: grid;
      gap: 10px;
    }

    .results {
      max-height: 70vh;
      overflow: auto;
    }

    .result {
      display: grid;
      position: relative;
      padding: 0.5em;
      color: inherit;
      grid-template-columns: 4fr 1fr;
      gap: 0.25em;
      font: inherit;
      text-decoration: none;
      border-radius: 8px;

      &:focus,
      &:hover {
        background: #dfe3e6;
      }
    }

    .title {
      grid-column: 1 / 3;
      font-weight: bold;
    }

    .excerpt {
      grid-column: 1 / 3;
      font-size: 14px;
    }

    .categories {
      display: none;
      text-transform: capitalize;
    }

    .controls {
      display: flex;
      align-items: center;
    }

    .close {
      margin: 0;
      padding: 0.25em;
      background: none;
      border: none;
      font: inherit;
      cursor: pointer;

      &:focus,
      &:hover {
        background: #dfe3e6;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "quick-search": QuickSearch;
  }
}
