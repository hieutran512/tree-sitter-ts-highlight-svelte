import { get, writable } from "svelte/store";
import { createHighlightedDiffHtmlStore, createHighlightedHtmlStore, getHighlightedDiffHtml, getHighlightedHtml, } from "../lib/highlight";
const highlightMock = jest.fn();
const highlightDiffMock = jest.fn();
jest.mock("tree-sitter-ts-highlight", () => ({
    highlight: (...args) => highlightMock(...args),
    highlightDiff: (...args) => highlightDiffMock(...args),
}));
describe("highlight utilities", () => {
    beforeEach(() => {
        highlightMock.mockReset();
        highlightDiffMock.mockReset();
    });
    test("getHighlightedHtml forwards args and enforces wrapInPre=false", () => {
        highlightMock.mockReturnValue("<span>ok</span>");
        const html = getHighlightedHtml({
            code: "const n = 1;",
            language: "typescript",
            options: { lineNumbers: true },
        });
        expect(html).toBe("<span>ok</span>");
        expect(highlightMock).toHaveBeenCalledWith("const n = 1;", "typescript", {
            lineNumbers: true,
            wrapInPre: false,
            language: "typescript",
        });
    });
    test("getHighlightedDiffHtml forwards args", () => {
        highlightDiffMock.mockReturnValue("<div>diff</div>");
        const html = getHighlightedDiffHtml({
            oldCode: "a",
            newCode: "b",
            language: "typescript",
            options: { view: "inline" },
        });
        expect(html).toBe("<div>diff</div>");
        expect(highlightDiffMock).toHaveBeenCalledWith("a", "b", "typescript", { view: "inline" });
    });
    test("createHighlightedHtmlStore reacts to code/language changes", () => {
        highlightMock.mockImplementation((code, language) => `${language}:${code}`);
        const code = writable("const n = 1;");
        const language = writable("typescript");
        const store = createHighlightedHtmlStore({ code, language });
        expect(get(store)).toBe("typescript:const n = 1;");
        code.set("const n = 2;");
        expect(get(store)).toBe("typescript:const n = 2;");
        language.set("javascript");
        expect(get(store)).toBe("javascript:const n = 2;");
    });
    test("createHighlightedDiffHtmlStore reacts with optional options store", () => {
        highlightDiffMock.mockImplementation((oldCode, newCode, language, options) => `${language}:${oldCode}->${newCode}:${options?.view ?? "side-by-side"}`);
        const oldCode = writable("a");
        const newCode = writable("b");
        const language = writable("typescript");
        const options = writable({ view: "inline" });
        const store = createHighlightedDiffHtmlStore({ oldCode, newCode, language, options });
        expect(get(store)).toBe("typescript:a->b:inline");
        newCode.set("c");
        expect(get(store)).toBe("typescript:a->c:inline");
        options.set(undefined);
        expect(get(store)).toBe("typescript:a->c:side-by-side");
    });
});
