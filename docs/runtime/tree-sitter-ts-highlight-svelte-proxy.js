const candidates = [
    "../vendor/tree-sitter-ts-highlight-svelte/lib/highlight.js",
    "../../../tree-sitter-ts-highlight-svelte/dist/lib/highlight.js",
    "../../tree-sitter-ts-highlight-svelte/dist/lib/highlight.js",
    "../tree-sitter-ts-highlight-svelte/dist/lib/highlight.js",
    "https://esm.sh/tree-sitter-ts-highlight-svelte@0.1.1/dist/lib/highlight.js",
];

async function loadModule() {
    const failures = [];

    for (const specifier of candidates) {
        try {
            const mod = await import(specifier);
            return { mod, specifier };
        } catch (error) {
            failures.push(`${specifier}: ${String(error)}`);
        }
    }

    throw new Error([
        "Failed to load tree-sitter-ts-highlight-svelte utilities from any fallback source.",
        ...failures,
    ].join("\n"));
}

const { mod } = await loadModule();

if (typeof mod.getHighlightedHtml !== "function") {
    throw new Error("Loaded tree-sitter-ts-highlight-svelte utility module but getHighlightedHtml export is missing.");
}

if (typeof mod.getHighlightedDiffHtml !== "function") {
    throw new Error("Loaded tree-sitter-ts-highlight-svelte utility module but getHighlightedDiffHtml export is missing.");
}

export const getHighlightedHtml = mod.getHighlightedHtml;
export const getHighlightedDiffHtml = mod.getHighlightedDiffHtml;
