export { default as Highlight } from "./components/Highlight.svelte";
export { default as HighlightDiff } from "./components/HighlightDiff.svelte";
export { getHighlightedHtml, getHighlightedDiffHtml, createHighlightedHtmlStore, createHighlightedDiffHtmlStore, } from "./lib/highlight";
export type { GetHighlightedHtmlParams, GetHighlightedDiffHtmlParams, HighlightedHtmlStoreParams, HighlightedDiffHtmlStoreParams, } from "./lib/highlight";
export type { HighlightRenderable, DiffRenderable, DiffRenderableRow, RenderToken, } from "./lib/svelte-renderer";
export { createHighlightRenderable, createDiffRenderable, cssTextToStyleObject, } from "./lib/svelte-renderer";
export * from "tree-sitter-ts-highlight";
//# sourceMappingURL=index.d.ts.map