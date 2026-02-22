import { highlight, highlightDiff } from "tree-sitter-ts-highlight";
import { derived } from "svelte/store";
export function getHighlightedHtml({ code, language, options, }) {
    return highlight(code, language, {
        ...options,
        wrapInPre: false,
        language,
    });
}
export function getHighlightedDiffHtml({ oldCode, newCode, language, options, }) {
    return highlightDiff(oldCode, newCode, language, options);
}
export function createHighlightedHtmlStore({ code, language, options, }) {
    if (!options) {
        return derived([code, language], ([$code, $language]) => getHighlightedHtml({ code: $code, language: $language }));
    }
    return derived([code, language, options], ([$code, $language, $options]) => getHighlightedHtml({ code: $code, language: $language, options: $options }));
}
export function createHighlightedDiffHtmlStore({ oldCode, newCode, language, options, }) {
    if (!options) {
        return derived([oldCode, newCode, language], ([$oldCode, $newCode, $language]) => getHighlightedDiffHtml({ oldCode: $oldCode, newCode: $newCode, language: $language }));
    }
    return derived([oldCode, newCode, language, options], ([$oldCode, $newCode, $language, $options]) => getHighlightedDiffHtml({
        oldCode: $oldCode,
        newCode: $newCode,
        language: $language,
        options: $options,
    }));
}
