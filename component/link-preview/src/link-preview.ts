import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("link-preview")
export class LinkPreview extends LitElement {
  @property() url = "";
  @property() title = "";
  @property() description = "";
  @property() image = "";

  @property({ type: Boolean, attribute: "hide-description" })
  hideDescription = false;

  @property({ type: Boolean, attribute: "hide-image" })
  hideImage = false;

  @property({ type: Boolean, attribute: "hide-actions" })
  hideActions = false;

  @property({ type: Boolean })
  loading = false;

  render() {
    if (this.loading) {
      return html`<div class="card"><div class="loading">Loading preview…</div></div>`;
    }

    if (!this.title && !this.description) {
      return nothing;
    }

    return html`
      <div class="card">
        ${this.image && !this.hideImage
          ? html`<img class="card-image" src=${this.image} alt="" loading="lazy" />`
          : nothing}
        <div class="card-body">
          ${this.title
            ? html`<div class="card-title">${this.title}</div>`
            : nothing}
          ${this.description && !this.hideDescription
            ? html`<div class="card-description">${this.description}</div>`
            : nothing}
        </div>
        ${!this.hideActions
          ? html`
              <div class="card-actions">
                <a class="action" href=${this.url}>Go to link</a>
                <a class="action" href=${this.url} target="_blank" rel="noopener">Open in new tab</a>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      font-family: var(--body-font, system-ui, sans-serif);
    }

    .card {
      width: 300px;
      max-width: 90vw;
      border-radius: 8px;
      overflow: hidden;
      background: var(--bg-surface, #ffffff);
      border: 2px solid var(--border, #1b2f36);
      box-shadow: var(--shadow, 0 4px 8px rgba(0, 0, 0, 0.15));
    }

    .card-image {
      display: block;
      width: 100%;
      aspect-ratio: 1.619;
      object-fit: cover;
      border-radius: 0;
      box-shadow: none;
    }

    .card-body {
      padding: 0.5rem 0.75rem;
    }

    .card-title {
      font-weight: 800;
      font-size: 0.9rem;
      line-height: 1.2;
      color: var(--text, #1b2f36);
      margin-bottom: 0.25rem;
    }

    .card-description {
      font-size: 0.8rem;
      line-height: 1.4;
      color: var(--text-secondary, #4d5963);
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-actions {
      display: flex;
      border-top: 1px solid var(--border-subtle, #d4d8db);
    }

    .action {
      flex: 1;
      display: block;
      padding: 0.4rem 0.5rem;
      text-align: center;
      font-size: 0.8rem;
      text-decoration: none;
      color: var(--link, #906b56);
      transition: background 0.15s;

      &:hover {
        background: color-mix(in srgb, var(--accent-secondary, #376170) 10%, transparent);
      }

      &:first-child {
        border-right: 1px solid var(--border-subtle, #d4d8db);
      }
    }

    .loading {
      padding: 1rem;
      text-align: center;
      font-size: 0.85rem;
      color: var(--text-secondary, #4d5963);
      font-style: italic;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "link-preview": LinkPreview;
  }
}
