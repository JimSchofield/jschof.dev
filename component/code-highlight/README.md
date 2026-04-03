# @jschofield/code-highlight

Syntax highlighting web component built with [Lit](https://lit.dev/) and [highlight.js](https://highlightjs.org/). Supports line activation/dimming for pedagogical code walkthroughs.

## Install

```bash
npm install @jschofield/code-highlight
```

### Peer dependencies

This component requires the following peer dependencies:

```bash
npm install lit prettier
```

| Peer | Version |
|---|---|
| `lit` | `^3.0.0` |
| `prettier` | `^3.0.0` |

## Usage

```html
<script type="module">
  import '@jschofield/code-highlight';
</script>

<code-highlight lang="javascript" line-numbers active-lines="2-4">
  <template>
    <script>
      const greeting = "hello";
      console.log(greeting); // highlighted
      const unused = "dim";  // highlighted
    </script>
  </template>
</code-highlight>
```

### HTML content

```html
<code-highlight lang="html">
  <template>
    <div>
      <h1>My heading</h1>
    </div>
  </template>
</code-highlight>
```

### CSS content

```html
<code-highlight lang="css">
  <template>
    <style>
      body { color: red; }
    </style>
  </template>
</code-highlight>
```

### Without a bundler

If you're not using a bundler, provide peer dependencies via an import map:

```html
<script type="importmap">
{
  "imports": {
    "lit": "https://esm.run/lit",
    "lit/": "https://esm.run/lit/",
    "prettier/standalone": "https://esm.run/prettier/standalone",
    "prettier/plugins/": "https://esm.run/prettier/plugins/"
  }
}
</script>
<script type="module" src="https://esm.run/@jschofield/code-highlight"></script>
```

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `lang` | `string` | `"html"` | Language for syntax highlighting (`html`, `javascript`, `typescript`, `tsx`, `jsx`, `css`) |
| `dont-pretty` | `boolean` | `false` | Disable Prettier auto-formatting |
| `line-numbers` | `boolean` | `false` | Show line numbers in the gutter |
| `active-lines` | `string` | `""` | Comma/range-separated line numbers to highlight (e.g., `"1,3-5,8"`) |

## JavaScript API

```js
const el = document.querySelector('code-highlight');

el.setActiveLines('2-4,7');  // highlight specific lines
el.clearActiveLines();       // remove all highlighting
el.getFirstActiveLine();     // get DOM ref to first active line
el.getScrollContainer();     // get the scrollable container
```

## License

MIT
