const candidates = [
    "../vendor/tree-sitter-ts-highlight/index.js",
    "../../../tree-sitter-ts-highlight/dist/index.js",
    "../../tree-sitter-ts-highlight/dist/index.js",
    "../tree-sitter-ts-highlight/dist/index.js",
    "https://esm.sh/tree-sitter-ts-highlight@0.1.1",
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

    throw new Error(["Failed to load tree-sitter-ts-highlight from any fallback source.", ...failures].join("\n"));
}

const { mod } = await loadModule();

const required = [
    "enhanceSemantics",
    "applyDecorations",
    "groupTokensByLine",
    "createDiffModelWithTokens",
    "highlight",
    "highlightDiff",
];

for (const name of required) {
    if (!(name in mod)) {
        throw new Error(`Loaded tree-sitter-ts-highlight module but missing export: ${name}`);
    }
}

export const enhanceSemantics = mod.enhanceSemantics;
export const applyDecorations = mod.applyDecorations;
export const groupTokensByLine = mod.groupTokensByLine;
export const createDiffModelWithTokens = mod.createDiffModelWithTokens;
export const highlight = mod.highlight;
export const highlightDiff = mod.highlightDiff;
