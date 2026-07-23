---
"@jschofield/code-highlight": minor
---

Add Svelte language support and an optional language badge.

`lang="svelte"` now formats snippets with `prettier-plugin-svelte` (preserving `$:` labels, `{expr}` bindings, and blank lines) and highlights them with the XML/HTML grammar, which colors tags, attributes, and the embedded `<script>` as JS. A dedicated `handleSvelte()` reads the whole component from the template rather than a single `<script>` child.

Display the source language in the top-right corner by default; pass `hide-language` to suppress it. Badge colors are themeable via the `--code-lang-color` and `--code-lang-bg` custom properties.

Also fixes blank lines being rendered at zero height when they fall inside a wrapping highlight span (previously interior blank lines could visually collapse).
