# @jschofield/scroll-explain

A scroll-driven code walkthrough web component built with [Lit](https://lit.dev/). Creates a two-column layout where prose explanations on the left drive line highlighting in a sticky code block on the right. Pairs with [`@jschofield/code-highlight`](https://www.npmjs.com/package/@jschofield/code-highlight).

## Install

```bash
npm install @jschofield/scroll-explain @jschofield/code-highlight
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
  import '@jschofield/scroll-explain';
  import '@jschofield/code-highlight';
</script>

<scroll-explain>
  <div slot="prose">
    <p>Here's how this function works:</p>

    <explain-section lines="1-3">
      <p>First, we set up the variables...</p>
    </explain-section>

    <explain-section lines="5-8">
      <p>Then we process each item in the loop...</p>
    </explain-section>

    <explain-section lines="10-12">
      <p>Finally, we return the result.</p>
    </explain-section>
  </div>

  <code-highlight lang="javascript" slot="code" line-numbers>
    <template>
      <script>
        const items = getData();
        const results = [];
        let count = 0;

        for (const item of items) {
          const processed = transform(item);
          results.push(processed);
          count++;
        }

        console.log(`Processed ${count} items`);
        return results;
      </script>
    </template>
  </code-highlight>
</scroll-explain>
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
<script type="module" src="https://esm.run/@jschofield/scroll-explain"></script>
<script type="module" src="https://esm.run/@jschofield/code-highlight"></script>
```

## Slots

| Slot | Content |
|---|---|
| `prose` | Container with text and `<explain-section>` elements |
| `code` | A `<code-highlight>` element with `line-numbers` |

## `<explain-section>` attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `lines` | `string` | `""` | Line spec to highlight when this section is visible (e.g., `"1-3,5,7-9"`) |

## How it works

As the user scrolls, an IntersectionObserver detects which `<explain-section>` is visible and tells the `<code-highlight>` element to activate the corresponding lines. The code block smoothly scrolls to keep the active lines centered.

## Responsive behavior

- **Desktop (>900px):** Two-column grid. Code sticks to the right side.
- **Mobile (<900px):** Code sticks to the top of the viewport. Prose scrolls below.

## License

MIT
