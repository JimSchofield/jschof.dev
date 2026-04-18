# @jschofield/link-preview

A link preview web component built with [Lit](https://lit.dev/), plus a helper that auto-attaches preview popovers to existing anchors. Uses the [Popover API](https://developer.mozilla.org/docs/Web/API/Popover_API) and [CSS anchor positioning](https://developer.mozilla.org/docs/Web/CSS/CSS_anchor_positioning) — no floating-UI library required.

## Install

```bash
npm install @jschofield/link-preview
```

### Peer dependencies

This component requires the following peer dependency:

```bash
npm install lit
```

| Peer | Version |
|---|---|
| `lit` | `^3.0.0` |

## Two ways to use it

### 1. As a standalone component

Render a preview card by setting props directly:

```html
<script type="module">
  import '@jschofield/link-preview';
</script>

<link-preview
  url="https://example.com"
  title="Example Domain"
  description="Illustrative documents in literature."
  image="https://example.com/og.png"
></link-preview>
```

### 2. Auto-attach previews to every link in a container

Import the helper and point it at a scope. For each anchor inside, it appends a small 🔍 inspection button; clicking or keyboard-activating the button opens a popover with the preview.

```js
import { initLinkPreviews } from '@jschofield/link-preview';

initLinkPreviews('article');  // CSS selector
// or
initLinkPreviews(document.querySelector('main'));  // Element
```

- **Internal links** (same origin): metadata resolved from `/search-data.json`.
- **External links**: fetched via `/.netlify/functions/link-meta` with a loading state. You'll need to deploy a metadata proxy at that path (see below).

Skip an anchor by adding `data-no-preview`:

```html
<a href="/foo" data-no-preview>No preview for me</a>
```

## `<link-preview>` attributes

| Attribute | Type | Purpose |
|---|---|---|
| `url` | string | Destination URL (used by the "Go to link" actions) |
| `title` | string | Card title |
| `description` | string | Card description (3-line clamp) |
| `image` | string | Optional preview image URL |
| `loading` | boolean | Shows a loading state instead of the card |
| `hide-description` | boolean | Hide the description block |
| `hide-image` | boolean | Hide the image |
| `hide-actions` | boolean | Hide the "Go to link" / "Open in new tab" row |

## Events

| Event | When |
|---|---|
| `close` | Fires when the user clicks the × close button. Bubbles and composes through the shadow root. |

## Accessibility

- The inspection button added by `initLinkPreviews` has `aria-label="Link preview for: <link text>"`.
- The preview card has a 40×40 close button in the top-right corner.
- `delegatesFocus: true` on the shadow root routes focus to the close button when the preview is focused.
- `Escape` closes the popover and returns focus to the inspection button.
- Tabbing past the last action (or Shift-Tab on the first focusable) closes the popover and returns focus to the inspection button.

## Data formats

### Internal link metadata (`/search-data.json`)

```json
[
  {
    "title": "My Post",
    "excerpt": "A short description…",
    "url": "/posts/my-post/",
    "image": "/assets/og.png",
    "categories": ["web-components"]
  }
]
```

The `url` is matched against the anchor's `pathname`. `image` is resolved as `entry.url + entry.image`.

### External metadata proxy (`/.netlify/functions/link-meta`)

The helper calls:

```
GET /.netlify/functions/link-meta?url=<encoded-url>
```

…and expects a JSON response shaped like:

```json
{
  "title": "Page title",
  "description": "Page description",
  "image": "https://example.com/og.png"
}
```

A reference implementation (with origin allowlisting and SSRF protection for private IPs) is available alongside this package.

## Styling

The helper creates two unstyled DOM elements you can target from your site's CSS:

- `.link-preview-inspect` — the 🔍 button inserted after each anchor
- `.link-preview-popover` — the popover wrapper around `<link-preview>` (positioned via CSS anchor positioning; `position-try-fallbacks: flip-block, flip-inline`)

The `<link-preview>` card itself is styled inside the shadow DOM and honors these CSS custom properties on the host: `--body-font`, `--bg-surface`, `--border`, `--border-subtle`, `--text`, `--text-secondary`, `--link`, `--accent-secondary`, `--shadow`.

## License

MIT
