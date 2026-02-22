import { createDiffRenderable, createHighlightRenderable, cssTextToStyleObject, styleObjectToCssText, } from "../lib/svelte-renderer";
const tokenizeMock = jest.fn();
const enhanceSemanticsMock = jest.fn();
const groupTokensByLineMock = jest.fn();
const applyDecorationsMock = jest.fn();
const createDiffModelWithTokensMock = jest.fn();
jest.mock("tree-sitter-ts", () => ({
    tokenize: (...args) => tokenizeMock(...args),
}));
jest.mock("tree-sitter-ts-highlight", () => ({
    applyDecorations: (...args) => applyDecorationsMock(...args),
    enhanceSemantics: (...args) => enhanceSemanticsMock(...args),
    groupTokensByLine: (...args) => groupTokensByLineMock(...args),
    createDiffModelWithTokens: (...args) => createDiffModelWithTokensMock(...args),
}));
describe("svelte renderer utilities", () => {
    beforeEach(() => {
        tokenizeMock.mockReset();
        enhanceSemanticsMock.mockReset();
        groupTokensByLineMock.mockReset();
        applyDecorationsMock.mockReset();
        createDiffModelWithTokensMock.mockReset();
    });
    test("cssTextToStyleObject parses valid declarations", () => {
        expect(cssTextToStyleObject("color: red; background: #000; invalid; :missing; opacity: 0.8"))
            .toEqual({ color: "red", background: "#000", opacity: "0.8" });
    });
    test("styleObjectToCssText serializes style object", () => {
        expect(styleObjectToCssText({ color: "red", background: "#000" })).toBe("color: red; background: #000");
    });
    test("createHighlightRenderable supports semantic highlighting and themes", () => {
        const rawTokens = [
            { value: "const", category: "keyword" },
            { value: " ", category: "whitespace" },
        ];
        const semanticTokens = [{ value: "const", category: "keyword" }];
        tokenizeMock.mockReturnValue(rawTokens);
        enhanceSemanticsMock.mockReturnValue(semanticTokens);
        groupTokensByLineMock.mockReturnValue([
            { lineNumber: 3, tokens: semanticTokens },
            { lineNumber: 4, tokens: semanticTokens },
        ]);
        applyDecorationsMock.mockImplementation((tokens) => tokens.map((token) => ({
            token,
            extraClasses: ["extra"],
            extraAttrs: { "data-test": "1" },
            extraStyle: "font-weight: 700",
        })));
        const renderable = createHighlightRenderable("const a = 1;", "typescript", {
            semanticHighlighting: true,
            startLine: 10,
            decorations: [{ line: 1 }],
            theme: {
                name: "test-theme",
                background: "#111",
                foreground: "#eee",
                styles: { keyword: "color: #f00" },
            },
        });
        expect(tokenizeMock).toHaveBeenCalledWith("const a = 1;", "typescript");
        expect(enhanceSemanticsMock).toHaveBeenCalledWith(rawTokens);
        expect(renderable.lines[0].lineNumber).toBe(10);
        expect(renderable.lines[1].lineNumber).toBe(11);
        expect(renderable.tokens[0].style).toEqual({ color: "#f00", "font-weight": "700" });
        expect(renderable.tokens[0].dataAttrs).toEqual({ "data-test": "1" });
        expect(renderable.preStyle).toEqual({ background: "#111", color: "#eee" });
    });
    test("createDiffRenderable builds rows and applies defaults", () => {
        createDiffModelWithTokensMock.mockReturnValue({
            model: {
                oldLabel: "Old",
                newLabel: "New",
                rows: [
                    {
                        changeType: "modified",
                        oldLineNumber: 1,
                        newLineNumber: 2,
                        oldText: "a",
                        newText: "b",
                    },
                ],
            },
            oldLineTokens: new Map([[1, [{ value: "a", category: "identifier" }]]]),
            newLineTokens: new Map([[2, [{ value: "b", category: "identifier" }]]]),
        });
        const diff = createDiffRenderable("a", "b", "typescript", {});
        expect(createDiffModelWithTokensMock).toHaveBeenCalledWith("a", "b", "typescript", {});
        expect(diff.view).toBe("side-by-side");
        expect(diff.showHeader).toBe(true);
        expect(diff.classPrefix).toBe("hlts-");
        expect(diff.rows).toHaveLength(1);
        expect(diff.rows[0].oldTokens[0].className).toBe("hlts-identifier");
    });
});
