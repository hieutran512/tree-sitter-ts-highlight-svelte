import { highlight, highlightDiff } from "tree-sitter-ts-highlight";
import type { DiffOptions, HighlightOptions } from "tree-sitter-ts-highlight";
import { derived, type Readable } from "svelte/store";

export interface GetHighlightedHtmlParams {
    code: string;
    language: string;
    options?: Omit<HighlightOptions, "wrapInPre" | "language">;
}

export function getHighlightedHtml({
    code,
    language,
    options,
}: GetHighlightedHtmlParams): string {
    return highlight(code, language, {
        ...options,
        wrapInPre: false,
        language,
    });
}

export interface GetHighlightedDiffHtmlParams {
    oldCode: string;
    newCode: string;
    language: string;
    options?: DiffOptions;
}

export function getHighlightedDiffHtml({
    oldCode,
    newCode,
    language,
    options,
}: GetHighlightedDiffHtmlParams): string {
    return highlightDiff(oldCode, newCode, language, options);
}

export interface HighlightedHtmlStoreParams {
    code: Readable<string>;
    language: Readable<string>;
    options?: Readable<Omit<HighlightOptions, "wrapInPre" | "language"> | undefined>;
}

export function createHighlightedHtmlStore({
    code,
    language,
    options,
}: HighlightedHtmlStoreParams): Readable<string> {
    if (!options) {
        return derived([code, language], ([$code, $language]) =>
            getHighlightedHtml({ code: $code, language: $language }),
        );
    }

    return derived([code, language, options], ([$code, $language, $options]) =>
        getHighlightedHtml({ code: $code, language: $language, options: $options }),
    );
}

export interface HighlightedDiffHtmlStoreParams {
    oldCode: Readable<string>;
    newCode: Readable<string>;
    language: Readable<string>;
    options?: Readable<DiffOptions | undefined>;
}

export function createHighlightedDiffHtmlStore({
    oldCode,
    newCode,
    language,
    options,
}: HighlightedDiffHtmlStoreParams): Readable<string> {
    if (!options) {
        return derived([oldCode, newCode, language], ([$oldCode, $newCode, $language]) =>
            getHighlightedDiffHtml({ oldCode: $oldCode, newCode: $newCode, language: $language }),
        );
    }

    return derived(
        [oldCode, newCode, language, options],
        ([$oldCode, $newCode, $language, $options]) =>
            getHighlightedDiffHtml({
                oldCode: $oldCode,
                newCode: $newCode,
                language: $language,
                options: $options,
            }),
    );
}
