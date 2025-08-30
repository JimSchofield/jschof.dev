import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";
import { map } from "lit/directives/map.js";
import { Task } from "@lit/task";

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

  private dataTask = new Task(this, {
    task: async () => {
      const response = await fetch("/search-data.json");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const options: Option[] = await response.json();

      this.fuse = new Fuse(options, {
        keys: ["title", "categories", "excerpt"],
        shouldSort: true,
        includeScore: true,
      });

      return options;
    },
    args: () => [],
  });

  connectedCallback(): void {
    super.connectedCallback();

    window.addEventListener("keydown", this.#handleKeyDown);
  }

  disconnectedCallback(): void {
    window.removeEventListener("keydown", this.#handleKeyDown);
  }

  get results() {
    if (!this.searchTerm || !this.fuse || this.dataTask.status !== 2) {
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
            ${this.dataTask.render({
              pending: () =>
                html`<div class="message">Loading search data...</div>`,
              error: (error: unknown) =>
                html`<div class="message error">
                  Search unavailable:
                  ${error instanceof Error ? error.message : "Unknown error"}
                </div>`,
              complete: () => {
                if (this.hasResults) {
                  return html`
                    <ul>
                      ${map(this.results, ({ item }) => {
                        return html`<li>
                          <a part="qs-result" class="result" href=${item.url}>
                            <div part="qs-title" class="title">
                              ${item.title}
                            </div>
                            <div part="qs-excerpt" class="excerpt">
                              ${item.excerpt}
                            </div>
                            <div part="qs-categories" class="categories">
                              ${item.categories.map((category) => {
                                return html`<span>${category}</span>`;
                              })}
                            </div>
                          </a>
                        </li>`;
                      })}
                    </ul>
                  `;
                } else {
                  return html`<div class="message">
                    Enter a search term or select a category. Press escape to
                    return.
                  </div>`;
                }
              },
            })}
          </div>
        </div>
      </dialog>
    `;
  }

  static styles = css`
    :host {
      --gunmetal: #1b2f36;
      --seasalt: #fafafa;
      --carrot: #f79103;
      --teal: #376170;
      --raw-umber: #906b56;
      --paynes-gray: #4d5963;
      --shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      --gradient: linear-gradient(
        135deg,
        var(--paynes-gray) 0% 20%,
        var(--carrot) 20% 40%,
        var(--teal) 40% 60%,
        var(--raw-umber) 60% 80%,
        var(--gunmetal) 80% 100%
      );
    }

    * {
      box-sizing: border-box;
    }

    *:focus-visible {
      outline: 2px solid var(--raw-umber);
      outline-offset: 1px;
    }

    dialog {
      margin-top: 10vh;
      height: auto;
      width: 90vw;
      max-width: 600px;
      max-height: 80vh;
      padding: 0;
      border: 2px solid var(--gunmetal);
      border-radius: 8px;
      background: var(--seasalt);
      color: var(--gunmetal);
      box-shadow: var(--shadow);
      overflow: hidden;
      font-family: "Atkinson Hyperlegible Next", system-ui, sans-serif;
    }

    dialog::backdrop {
      backdrop-filter: blur(4px);
      background: rgba(27, 47, 54, 0.1);
    }

    .inner {
      max-height: 100%;
      padding: 1rem;
    }

    .controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    input {
      flex: 1;
      padding: 0.75rem;
      font: inherit;
      font-size: 1rem;
      border: 2px solid var(--teal);
      border-radius: 8px;
      background: var(--seasalt);
      color: var(--gunmetal);

      &:focus {
        outline: none;
        border-color: var(--carrot);
        box-shadow: 0 0 0 2px rgba(247, 145, 3, 0.2);
      }

      &::placeholder {
        color: var(--paynes-gray);
      }
    }

    .close {
      display: inline-block;
      padding: 0.75rem 1rem;
      background: var(--gunmetal);
      color: var(--seasalt);
      border-radius: 8px;
      box-shadow: var(--shadow);
      border: none;
      font: inherit;
      cursor: pointer;

      &:hover {
        background: var(--gradient);
      }

      &:focus-visible {
        outline: 2px solid var(--raw-umber);
        outline-offset: 1px;
        background: var(--gradient);
      }
    }

    hr {
      width: 100%;
      border: none;
      height: 4px;
      background: var(--gradient);
      border-radius: 2px;
      margin: 0 0 1rem 0;
    }

    .results {
      max-height: 60vh;
      overflow-y: auto;
    }

    .message {
      padding: 2rem 1rem;
      text-align: center;
      color: var(--paynes-gray);
      font-style: italic;
    }

    .message.error {
      color: var(--raw-umber);
      font-weight: bold;
    }

    ul {
      margin: 0;
      padding: 0;
      padding-top: 0.5rem;
      list-style-type: none;
      display: grid;
      gap: 0.5rem;
    }

    .result {
      display: block;
      padding: 1rem;
      color: var(--gunmetal);
      text-decoration: none;
      border: 2px solid transparent;
      border-radius: 8px;
      background: var(--seasalt);
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--teal);
        transform: translateY(-1px);
      }

      &:focus-visible {
        outline: none;
        border-color: var(--carrot);
        box-shadow: 0 0 0 2px rgba(247, 145, 3, 0.2);
      }
    }

    .title {
      font-weight: bold;
      font-size: 1.1rem;
      margin-bottom: 0.25rem;
      color: var(--gunmetal);
      line-height: 1.2;
    }

    .excerpt {
      font-size: 0.9rem;
      color: var(--paynes-gray);
      line-height: 1.4;
      margin-bottom: 0.5rem;
    }

    .categories {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
      font-size: 0.8rem;
      text-transform: capitalize;

      & span {
        padding: 0.125rem 0.5rem;
        background: var(--teal);
        color: var(--seasalt);
        border-radius: 4px;
        font-weight: 500;
      }

      & span:last-child::after {
        content: none;
      }
    }


    /* Responsive adjustments */
    @media (max-width: 600px) {
      dialog {
        width: 95vw;
        margin-top: 5vh;
        max-height: 85vh;
      }

      .inner {
        padding: 0.75rem;
      }

      .controls {
        flex-direction: column;
        gap: 0.75rem;
      }

      .close {
        width: 100%;
        order: -1;
      }

      input {
        width: 100%;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "quick-search": QuickSearch;
  }
}
