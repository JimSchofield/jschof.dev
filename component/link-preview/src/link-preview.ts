import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("link-preview")
export class LinkPreview extends LitElement {
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

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

  @property({ type: Boolean })
  error = false;

  private _dispatchClose() {
    this.dispatchEvent(new Event("close", { bubbles: true, composed: true }));
  }

  private _handleImageError() {
    this.image = "";
  }

  render() {
    if (this.loading) {
      return html`<div class="card"><button class="close-btn" @click=${this._dispatchClose} aria-label="Close preview">&times;</button><div class="loading">Loading preview…</div></div>`;
    }

    if (this.error) {
      return html`
        <div class="card">
          <button class="close-btn" @click=${this._dispatchClose} aria-label="Close preview">&times;</button>
          <div class="error">No preview meta found</div>
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

    if (!this.title && !this.description) {
      return nothing;
    }

    return html`
      <div class="card">
        <button class="close-btn" @click=${this._dispatchClose} aria-label="Close preview">&times;</button>
        ${this.image && !this.hideImage
          ? html`<img class="card-image" src=${this.image} alt="" loading="lazy" @error=${this._handleImageError} />`
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
      position: relative;
      width: 300px;
      max-width: 90vw;
      border-radius: 8px;
      background: var(--bg-surface, #ffffff);
      border: 2px solid var(--border, #1b2f36);
      box-shadow: var(--shadow, 0 4px 8px rgba(0, 0, 0, 0.15));
    }

    .close-btn {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1;
      width: 40px;
      height: 40px;
      min-width: 40px;
      min-height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 1.25rem;
      line-height: 1;
      color: var(--text-secondary, #4d5963);
      border-radius: 0 6px 0 6px;
      transition: background 0.15s, color 0.15s;

      &:hover {
        background: color-mix(in srgb, var(--text, #1b2f36) 10%, transparent);
        color: var(--text, #1b2f36);
      }

      &:focus-visible {
        outline: 2px solid var(--link, #906b56);
        outline-offset: -2px;
      }
    }

    .card-image {
      display: block;
      width: 100%;
      aspect-ratio: 1.619;
      object-fit: cover;
      border-radius: 6px 6px 0 0;
      box-shadow: none;
    }

    .card-body {
      padding: 0.5rem 0.75rem;
      padding-right: 2.5rem;
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

      &:focus-visible {
        outline: 2px solid var(--link, #906b56);
        outline-offset: -2px;
      }

      &:first-child {
        border-right: 1px solid var(--border-subtle, #d4d8db);
        border-radius: 0 0 0 6px;
      }

      &:last-child {
        border-radius: 0 0 6px 0;
      }
    }

    .loading,
    .error {
      padding: 1rem;
      padding-right: 2.5rem;
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
