const candidates = [
    "../vendor/tree-sitter-ts/index.js",
    "../../../tree-sitter-ts/dist/index.js",
    "../../tree-sitter-ts/dist/index.js",
    "../tree-sitter-ts/dist/index.js",
    "https://esm.sh/tree-sitter-ts@0.1.1",
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

    throw new Error(["Failed to load tree-sitter-ts from any fallback source.", ...failures].join("\n"));
}

const { mod } = await loadModule();

if (typeof mod.tokenize !== "function") {
    throw new Error("Loaded tree-sitter-ts module but tokenize export is missing.");
}

export const tokenize = mod.tokenize;
