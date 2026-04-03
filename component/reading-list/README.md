# @jschofield/reading-list

A reading list / book tracker web component built with [Lit](https://lit.dev/). Fetches book data from an API and renders an interactive, filterable, sortable table.

## Install

```bash
npm install @jschofield/reading-list
```

### Peer dependencies

This component requires the following peer dependency:

```bash
npm install lit
```

| Peer | Version |
|---|---|
| `lit` | `^3.0.0` |

## Usage

```html
<script type="module">
  import '@jschofield/reading-list';
</script>

<reading-list></reading-list>

<!-- Custom API endpoint: -->
<reading-list api-endpoint="/api/my-books"></reading-list>
```

### Without a bundler

If you're not using a bundler, provide peer dependencies via an import map:

```html
<script type="importmap">
{
  "imports": {
    "lit": "https://esm.run/lit",
    "lit/": "https://esm.run/lit/"
  }
}
</script>
<script type="module" src="https://esm.run/@jschofield/reading-list"></script>
```

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `api-endpoint` | `string` | `"/.netlify/functions/reading-list"` | URL returning the books JSON |

## API response format

```json
{
  "books": [
    {
      "name": "Dune",
      "author": "Frank Herbert",
      "series": "Dune",
      "status": "Finished",
      "finished": "2024-03-15",
      "notes": "Incredible worldbuilding",
      "grade": "A+",
      "year": 2024
    }
  ]
}
```

## Features

- Search by book name, author, or series
- Filter by status, year, grade, and series
- Sortable columns (click headers to toggle)
- Color-coded grade and status badges
- "Clear All Filters" button
- Responsive table layout

## License

MIT
