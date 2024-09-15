import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";
import { when } from "lit/directives/when.js";

type Option = {
  title: string,
  excerpt?: string,
  url: string,
  categories: string[]
}

@customElement("quick-search")
export class QuickSearch extends LitElement {
  #dialog = createRef<HTMLDialogElement>();

  @state()
  private searchTerm = "";

  @state()
  private options: Option[] = [];

  connectedCallback(): void {
    super.connectedCallback();

    window.addEventListener("keydown", this.#handleKeyDown);
  }

  disconnectedCallback(): void {
    window.removeEventListener("keydown", this.#handleKeyDown);
  }

  get results() {
    if (!this.searchTerm) {
      return [];
    }

    return this.options.filter((option) => {
      return option.title.includes(this.searchTerm) || option.excerpt?.includes(this.searchTerm);
    })
  }

  get hasResults() {
    return this.results.length > 0;
  }

  #handleKeyDown = (event: KeyboardEvent) => {
    const commandK = event.key === "k" && event.getModifierState("Meta");
    const controlK = event.key === "k" && event.getModifierState("Control");

    if (commandK || controlK) {
      this.#dialog.value?.showModal();
    }
  };

  #handleInput = (e: InputEvent) => {
    this.searchTerm = (e.target as HTMLInputElement).value;
  };



  render() {
    return html`
      <dialog part="qs-dialog" ${ref(this.#dialog)}>
        <input
          autofocus
          type="text"
          placeholder="Search for a page"
          part="qs-input"
          value=${this.searchTerm}
          @input=${this.#handleInput}
        />
        <hr part="qs-divider" />
        <div>
          ${when(this.hasResults, () => html`<results></results>`, () => html`default`)}
        </div>
      </dialog>
    `;
  }

  static styles = css`
    * {
      box-sizing: border-box;
    }
    dialog {
      width: 80vw;
      padding: 8px;
      border: none;
      border-radius: 8px;
      box-shadow: 0 3px 11px rgba(0, 0, 0.1);
    }

    dialog::backdrop {
      backdrop-filter: blur(2px);
    }

    input {
      width: 100%;
      padding: 1em;
      font: inherit;
      border: none;
    }

    hr {
      border: none;
      height: 1px;
      background: blue;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "quick-search": QuickSearch;
  }
}
