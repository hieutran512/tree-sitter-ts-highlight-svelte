import type { DiffOptions, HighlightOptions } from "tree-sitter-ts-highlight";
import { type Readable } from "svelte/store";
export interface GetHighlightedHtmlParams {
    code: string;
    language: string;
    options?: Omit<HighlightOptions, "wrapInPre" | "language">;
}
export declare function getHighlightedHtml({ code, language, options, }: GetHighlightedHtmlParams): string;
export interface GetHighlightedDiffHtmlParams {
    oldCode: string;
    newCode: string;
    language: string;
    options?: DiffOptions;
}
export declare function getHighlightedDiffHtml({ oldCode, newCode, language, options, }: GetHighlightedDiffHtmlParams): string;
export interface HighlightedHtmlStoreParams {
    code: Readable<string>;
    language: Readable<string>;
    options?: Readable<Omit<HighlightOptions, "wrapInPre" | "language"> | undefined>;
}
export declare function createHighlightedHtmlStore({ code, language, options, }: HighlightedHtmlStoreParams): Readable<string>;
export interface HighlightedDiffHtmlStoreParams {
    oldCode: Readable<string>;
    newCode: Readable<string>;
    language: Readable<string>;
    options?: Readable<DiffOptions | undefined>;
}
export declare function createHighlightedDiffHtmlStore({ oldCode, newCode, language, options, }: HighlightedDiffHtmlStoreParams): Readable<string>;
//# sourceMappingURL=highlight.d.ts.map