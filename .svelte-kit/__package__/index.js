export { default as Highlight } from "./components/Highlight.svelte";
export { default as HighlightDiff } from "./components/HighlightDiff.svelte";
export { getHighlightedHtml, getHighlightedDiffHtml, createHighlightedHtmlStore, createHighlightedDiffHtmlStore, } from "./lib/highlight";
export { createHighlightRenderable, createDiffRenderable, cssTextToStyleObject, } from "./lib/svelte-renderer";
export * from "tree-sitter-ts-highlight";
