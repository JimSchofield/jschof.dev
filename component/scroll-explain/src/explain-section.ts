import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("explain-section")
export class ExplainSection extends LitElement {
  @property()
  lines = "";

  render() {
    return html`<slot></slot>`;
  }

  static styles = css`
    :host {
      display: block;
      min-height: 40vh;
      padding: 1rem 0;
    }

    :host(:first-of-type) {
      padding-top: 0;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "explain-section": ExplainSection;
  }
}
