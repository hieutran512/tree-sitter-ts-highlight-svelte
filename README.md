# tree-sitter-ts-highlight-svelte

Native Svelte wrapper for [`tree-sitter-ts-highlight`](https://www.npmjs.com/package/tree-sitter-ts-highlight) with Svelte-rendered token nodes (no raw HTML injection).

## Install

```bash
npm install tree-sitter-ts-highlight-svelte tree-sitter-ts-highlight tree-sitter-ts
```

Import a theme from the base package in your app entry:

```ts
import "tree-sitter-ts-highlight/themes/github-dark.css";
```

## Usage

```svelte
<script lang="ts">
  import { Highlight, HighlightDiff } from "tree-sitter-ts-highlight-svelte";

  const before = `const n = 1;`;
  const after = `const n = 2;`;
</script>

<Highlight
  code={`const n: number = 42;`}
  language="typescript"
  options={{ lineNumbers: true }}
/>

<HighlightDiff
  oldCode={before}
  newCode={after}
  language="typescript"
  options={{ view: "side-by-side" }}
/>
```

## API

- `Highlight`: `<pre><code>` renderer for highlighted code.
- `HighlightDiff`: native Svelte renderer for inline or side-by-side diffs.
- `getHighlightedHtml`: utility returning highlighted HTML for custom rendering.
- `getHighlightedDiffHtml`: utility returning highlighted diff HTML.
- `createHighlightedHtmlStore`: derived store for reactive highlighted HTML.
- `createHighlightedDiffHtmlStore`: derived store for reactive highlighted diff HTML.

All exports from `tree-sitter-ts-highlight` are re-exported by this package.

## GitHub Pages

A static project page is included at `docs/index.html` with:

- Library introduction
- Documentation overview
- Live utility usage demos backed by `getHighlightedHtml` / `getHighlightedDiffHtml`
- Interactive examples that render highlighted output in-browser

To host it on GitHub Pages:

1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose your default branch and folder **`/docs`**, then save.

Your page will be available at:

`https://<your-github-username>.github.io/<your-repo-name>/`

### Local PC testing for docs page

The docs runtime supports two module sources:

- default: npm CDN (`esm.sh`)
- local: `docs/vendor/*` (prepared from local builds), then sibling package fallbacks

`tree-sitter-ts` and `tree-sitter-ts-highlight` are resolved with fallbacks in this order:

1. sibling folders (`../tree-sitter-ts` and `../tree-sitter-ts-highlight`)
2. prepared local copies in `docs/vendor/`
3. npm CDN (`esm.sh`)

Theme CSS (`github-dark.css`) is loaded with fallbacks in this order:

1. `docs/vendor/tree-sitter-ts-highlight/themes/github-dark.css`
2. sibling `tree-sitter-ts-highlight/themes/github-dark.css`
3. CDN (`jsdelivr`, then `unpkg`)

To test locally before publishing:

1. Build the package:
  ```bash
  npm run build
  ```
2. Serve `docs/` through an HTTP server (not `file://`):
  ```bash
  npm run docs:serve
  ```
3. Open:
  - CDN mode: `http://127.0.0.1:4173`
  - Local build mode: `http://127.0.0.1:4173?source=local`

`npm run docs:serve` runs `docs:prepare` first, which copies available local build files into `docs/vendor/`.

## Standalone package note

This package is configured for independent GitHub/npm publishing.
It does not use local `file:..` dependencies for `tree-sitter-ts` or `tree-sitter-ts-highlight`.

## Build

```bash
npm run build
```

Build output is generated to `dist/` via `svelte-package`.

## Test

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```
