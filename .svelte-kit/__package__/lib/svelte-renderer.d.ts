import type { DiffChangeType, DiffOptions, HighlightOptions } from "tree-sitter-ts-highlight";
import { type Token } from "tree-sitter-ts";
export interface RenderToken {
    value: string;
    category: Token["category"];
    className?: string;
    style?: Record<string, string>;
    dataAttrs?: Record<string, string>;
    wrap: boolean;
}
export interface HighlightRenderableLine {
    lineNumber: number;
    tokens: RenderToken[];
}
export interface HighlightRenderable {
    lineNumbers: boolean;
    dataLineAttributes: boolean;
    lines: HighlightRenderableLine[];
    tokens: RenderToken[];
    preStyle: Record<string, string>;
}
export interface DiffRenderableRow {
    changeType: DiffChangeType;
    oldLineNumber: number | null;
    newLineNumber: number | null;
    oldText: string;
    newText: string;
    oldTokens: RenderToken[];
    newTokens: RenderToken[];
}
export interface DiffRenderable {
    view: "side-by-side" | "inline";
    showHeader: boolean;
    oldLabel: string;
    newLabel: string;
    rows: DiffRenderableRow[];
    classPrefix: string;
}
export declare function createHighlightRenderable(code: string, language: string, options?: Omit<HighlightOptions, "wrapInPre" | "language">): HighlightRenderable;
export declare function createDiffRenderable(oldCode: string, newCode: string, language: string, options?: DiffOptions): DiffRenderable;
export declare function cssTextToStyleObject(cssText: string): Record<string, string>;
export declare function styleObjectToCssText(style: Record<string, string>): string;
//# sourceMappingURL=svelte-renderer.d.ts.map