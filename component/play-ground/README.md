# @jschofield/play-ground

Interactive code editor and live preview web component built with [Lit](https://lit.dev/) and [CodeMirror 6](https://codemirror.net/). A split-pane playground for HTML/CSS/JS — like a lightweight CodePen you can embed anywhere.

## Install

```bash
npm install @jschofield/play-ground
```

## Usage

```html
<script type="module">
  import '@jschofield/play-ground';
</script>

<play-ground>
  <template>
    <style>
      h1 { color: tomato; }
    </style>
    <h1>Hello!</h1>
  </template>
</play-ground>
```

### Inline HTML attribute

```html
<play-ground html="<h1>Quick example</h1>"></play-ground>
```

### Code folding

Collapse specific lines on initial load (useful for hiding boilerplate):

```html
<play-ground fold="1,5">
  <template>
    <!-- line 1 is folded -->
    ...
  </template>
</play-ground>
```

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `html` | `string` | `""` | Initial HTML content (alternative to `<template>`) |
| `fold` | `string` | `""` | Comma-separated line numbers to fold on load |

## Features

- Live preview updates as you type (200ms debounce)
- Format button (Prettier with HTML/CSS/JS support)
- Vim mode toggle (persists across page via shared state)
- Sandboxed iframe preview (`allow-scripts allow-forms allow-same-origin`)
- Responsive: stacks vertically below 900px

## License

MIT
