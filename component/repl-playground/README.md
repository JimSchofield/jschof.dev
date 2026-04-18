# @jschofield/repl-playground

A secure JavaScript REPL web component built with [Lit](https://lit.dev/) and [CodeMirror 6](https://codemirror.net/). Provides a split-pane code editor and terminal output, perfect for embedding interactive JS examples in blog posts.

## Install

```bash
npm install @jschofield/repl-playground
```

### Peer dependencies

This component requires the following peer dependencies:

```bash
npm install lit prettier @codemirror/commands @codemirror/lang-javascript @codemirror/language @codemirror/state @codemirror/theme-one-dark @codemirror/view @replit/codemirror-vim
```

| Peer | Version |
|---|---|
| `lit` | `^3.0.0` |
| `prettier` | `^3.0.0` |
| `@codemirror/commands` | `^6.10.0` |
| `@codemirror/lang-javascript` | `^6.2.4` |
| `@codemirror/language` | `^6.10.1` |
| `@codemirror/state` | `^6.5.2` |
| `@codemirror/theme-one-dark` | `^6.1.3` |
| `@codemirror/view` | `^6.38.8` |
| `@replit/codemirror-vim` | `^6.3.0` |

## Usage

```html
<script type="module">
  import '@jschofield/repl-playground';
</script>

<repl-playground>
  <template>
    <script>
      const nums = [1, 2, 3];
      console.log(nums.map(n => n * 2));
    </script>
  </template>
</repl-playground>
```

### Web worker execution

For async code or heavier workloads:

```html
<repl-playground web-worker>
  <template>
    <script>
      const res = await fetch('https://api.example.com/data');
      console.log(await res.json());
    </script>
  </template>
</repl-playground>
```

### Start collapsed

```html
<repl-playground start-collapsed>
  <template>
    <script>
      console.log("expand to see output");
    </script>
  </template>
</repl-playground>
```

### Line numbers

Opt into a line-number gutter. The attribute can be toggled dynamically — add or remove it at runtime and the gutter appears/disappears without losing cursor position, undo history, or vim state.

```html
<repl-playground line-numbers>
  <template>
    <script>
      const greet = name => `hello, ${name}`;
      console.log(greet("world"));
    </script>
  </template>
</repl-playground>
```

### Code folding

Fold specific lines or ranges on load. Single numbers use language-aware folding (fold the block starting at that line); ranges fold the specified lines explicitly. The fold gutter and fold keymap are always active when the attribute is set.

```html
<repl-playground fold="1,5,23-34">
  <template>
    <script>
      // ... long example ...
    </script>
  </template>
</repl-playground>
```

Syntax: comma-separated. Whitespace around tokens is tolerated (`"1, 5, 23-34"` works). Out-of-range or invalid entries are skipped silently.

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
    "@codemirror/commands": "https://esm.run/@codemirror/commands",
    "@codemirror/lang-javascript": "https://esm.run/@codemirror/lang-javascript",
    "@codemirror/language": "https://esm.run/@codemirror/language",
    "@codemirror/state": "https://esm.run/@codemirror/state",
    "@codemirror/theme-one-dark": "https://esm.run/@codemirror/theme-one-dark",
    "@codemirror/view": "https://esm.run/@codemirror/view",
    "@replit/codemirror-vim": "https://esm.run/@replit/codemirror-vim"
  }
}
</script>
<script type="module" src="https://esm.run/@jschofield/repl-playground"></script>
```

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `web-worker` | `boolean` | `false` | Execute code in a web worker instead of iframe |
| `start-collapsed` | `boolean` | `false` | Start with the console output collapsed |
| `line-numbers` | `boolean` | `false` | Show line numbers in the editor gutter (toggleable at runtime) |
| `fold` | `string` | `""` | Comma-separated fold spec applied on load, e.g. `"1,5,23-34"`. Single numbers fold the block starting at that line; ranges fold the specified lines explicitly. |

## Controls

| Control | Description |
|---|---|
| Run | Execute code (`Cmd+Enter` / `Ctrl+Enter`) |
| Format | Auto-format with Prettier |
| Reset | Restore initial code from template |
| Vim mode | Toggle vim keybindings (persists across page and tabs) |
| Console toggle | Collapse/expand the output pane |

## Security

Code execution is sandboxed in an iframe with `allow-scripts` only (or in a web worker). Execution has a 5-second timeout to prevent infinite loops. Console output is captured and displayed in the terminal pane.

## Output

- `console.log/warn/error` output is captured
- Return values are prefixed with an arrow
- Errors shown in red with context
- Color-coded output: success (green), error (red), info (blue)

## License

MIT
