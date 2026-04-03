# @jschofield/repl-playground

A secure JavaScript REPL web component built with [Lit](https://lit.dev/) and [CodeMirror 6](https://codemirror.net/). Provides a split-pane code editor and terminal output, perfect for embedding interactive JS examples in blog posts.

## Install

```bash
npm install @jschofield/repl-playground
```

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

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `web-worker` | `boolean` | `false` | Execute code in a web worker instead of iframe |
| `start-collapsed` | `boolean` | `false` | Start with the console output collapsed |

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
