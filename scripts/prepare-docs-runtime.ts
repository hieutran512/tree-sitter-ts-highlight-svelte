import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

type CopyTarget = {
    from: string;
    to: string;
    label: string;
    required: boolean;
    type?: "dir";
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const copyTargets: CopyTarget[] = [
    {
        from: path.join(root, "dist", "lib", "highlight.js"),
        to: path.join(root, "docs", "vendor", "tree-sitter-ts-highlight-svelte", "lib", "highlight.js"),
        label: "tree-sitter-ts-highlight-svelte/lib/highlight",
        required: true,
    },
    {
        from: path.resolve(root, "..", "tree-sitter-ts", "dist", "index.js"),
        to: path.join(root, "docs", "vendor", "tree-sitter-ts", "index.js"),
        label: "tree-sitter-ts (sibling)",
        required: false,
    },
    {
        from: path.resolve(root, "..", "tree-sitter-ts-highlight", "dist", "index.js"),
        to: path.join(root, "docs", "vendor", "tree-sitter-ts-highlight", "index.js"),
        label: "tree-sitter-ts-highlight (sibling)",
        required: false,
    },
    {
        from: path.resolve(root, "..", "tree-sitter-ts-highlight", "themes"),
        to: path.join(root, "docs", "vendor", "tree-sitter-ts-highlight", "themes"),
        label: "tree-sitter-ts-highlight themes (sibling)",
        required: false,
        type: "dir",
    },
];

for (const target of copyTargets) {
    try {
        await fs.access(target.from);
    } catch {
        if (target.required) {
            throw new Error(`Required build artifact missing: ${target.from}`);
        }

        console.warn(`[docs:prepare] Skip ${target.label} (not found): ${target.from}`);
        continue;
    }

    if (target.type === "dir") {
        await fs.cp(target.from, target.to, { recursive: true, force: true });
        console.log(`[docs:prepare] Copied ${target.label}: ${target.from} -> ${target.to}`);
        continue;
    }

    await fs.mkdir(path.dirname(target.to), { recursive: true });
    await fs.copyFile(target.from, target.to);
    console.log(`[docs:prepare] Copied ${target.label}: ${target.from} -> ${target.to}`);
}