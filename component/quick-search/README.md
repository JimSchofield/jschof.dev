# @jschofield/quick-search

A Cmd+K search modal web component built with [Lit](https://lit.dev/) and [Fuse.js](https://www.fusejs.io/). Provides fuzzy search over page content with keyboard navigation.

## Install

```bash
npm install @jschofield/quick-search
```

## Usage

```html
<script type="module">
  import '@jschofield/quick-search';
</script>

<quick-search></quick-search>
```

No attributes needed — drop it in and it works.

## How it works

1. Fetches `/search-data.json` on first open
2. Fuzzy-searches by title, excerpt, and categories
3. Results link directly to matching pages

### Data format

The component expects a JSON file at `/search-data.json` with this shape:

```json
[
  {
    "title": "My Post Title",
    "excerpt": "A brief description...",
    "url": "/posts/my-post/",
    "categories": ["javascript", "web-components"]
  }
]
```

## Keyboard shortcuts

| Key | Action |
|---|---|
| `Cmd+K` / `Ctrl+K` | Open search |
| `Escape` | Close search |
| `Enter` | Navigate to selected result |
| Type to search | Fuzzy match across title, excerpt, categories |

## License

MIT
