import { LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("repl-playground")
export class ReplPlayground extends LitElement {}

declare global {
  interface HTMLElementTagNameMap {
    "repl-playgroundcode-highlight": ReplPlayground;
  }
}
