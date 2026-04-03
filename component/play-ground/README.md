# @jschofield/play-ground

Interactive code editor and live preview web component built with [Lit](https://lit.dev/) and [CodeMirror 6](https://codemirror.net/). A split-pane playground for HTML/CSS/JS — like a lightweight CodePen you can embed anywhere.

## Install

```bash
npm install @jschofield/play-ground
```

### Peer dependencies

This component requires the following peer dependencies:

```bash
npm install lit prettier codemirror @codemirror/commands @codemirror/lang-html @codemirror/lang-javascript @codemirror/language @codemirror/state @codemirror/view @replit/codemirror-vim
```

| Peer | Version |
|---|---|
| `lit` | `^3.0.0` |
| `prettier` | `^3.0.0` |
| `codemirror` | `^6.0.1` |
| `@codemirror/commands` | `^6.3.3` |
| `@codemirror/lang-html` | `^6.4.8` |
| `@codemirror/lang-javascript` | `^6.2.1` |
| `@codemirror/language` | `^6.10.1` |
| `@codemirror/state` | `^6.4.1` |
| `@codemirror/view` | `^6.24.1` |
| `@replit/codemirror-vim` | `^6.3.0` |

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

### Without a bundler

This component has many CodeMirror peer dependencies, so a bundler is strongly recommended. If you must go without one, you'll need an import map for all peers:

```html
<script type="importmap">
{
  "imports": {
    "lit": "https://esm.run/lit",
    "lit/": "https://esm.run/lit/",
    "prettier/standalone": "https://esm.run/prettier/standalone",
    "prettier/plugins/": "https://esm.run/prettier/plugins/",
    "codemirror": "https://esm.run/codemirror",
    "@codemirror/commands": "https://esm.run/@codemirror/commands",
    "@codemirror/lang-html": "https://esm.run/@codemirror/lang-html",
    "@codemirror/lang-javascript": "https://esm.run/@codemirror/lang-javascript",
    "@codemirror/language": "https://esm.run/@codemirror/language",
    "@codemirror/state": "https://esm.run/@codemirror/state",
    "@codemirror/view": "https://esm.run/@codemirror/view",
    "@replit/codemirror-vim": "https://esm.run/@replit/codemirror-vim"
  }
}
</script>
<script type="module" src="https://esm.run/@jschofield/play-ground"></script>
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
