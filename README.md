# tree-sitter-ts-highlight-svelte

Native Svelte components and utilities for `tree-sitter-ts-highlight`.
Use this package when you want syntax-highlighted code/diffs rendered as native Svelte nodes.

## Install

```bash
npm install tree-sitter-ts-highlight-svelte tree-sitter-ts-highlight tree-sitter-ts
```

Import a theme once in your app entry:

```ts
import "tree-sitter-ts-highlight/themes/github-dark.css";
```

## Quick start

```svelte
<script lang="ts">
  import { Highlight, HighlightDiff } from "tree-sitter-ts-highlight-svelte";

  const oldCode = `const n = 1;`;
  const newCode = `const n = 2;`;
</script>

<Highlight
  code={`const total: number = 42;`}
  language="typescript"
  options={{ lineNumbers: true }}
/>

<HighlightDiff
  oldCode={oldCode}
  newCode={newCode}
  language="typescript"
  options={{ view: "side-by-side" }}
/>
```

## Exports

### Components

- `Highlight`
  - Props: `code`, `language`, `options?`, `preClassName?`, `codeClassName?`
  - Renders highlighted code inside `<pre><code>`.
- `HighlightDiff`
  - Props: `oldCode`, `newCode`, `language`, `options?`, `containerClassName?`
  - Renders inline or side-by-side diffs.

### Utilities

- `getHighlightedHtml({ code, language, options? })`
- `getHighlightedDiffHtml({ oldCode, newCode, language, options? })`
- `createHighlightedHtmlStore({ code, language, options? })`
- `createHighlightedDiffHtmlStore({ oldCode, newCode, language, options? })`

All exports from `tree-sitter-ts-highlight` are also re-exported.
Type exports from `tree-sitter-ts-highlight` and `Token` from `tree-sitter-ts` are re-exported for TypeScript consumers.

## Notes

- `language` is passed through to `tree-sitter-ts-highlight`.
- `Highlight` always renders with `wrapInPre: false` internally to avoid nested `<pre>`.
- For additional live demos and theme previews, use the upstream project page:
  <https://github.com/hieutran512/tree-sitter-ts-highlight>

## Package scripts

```bash
npm run build
npm run typecheck
npm test
```
