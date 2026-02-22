import { applyDecorations, createDiffModelWithTokens, enhanceSemantics, groupTokensByLine } from "tree-sitter-ts-highlight";
import type {
    Decoration,
    DiffChangeType,
    DiffOptions,
    DiffRow,
    HighlightOptions,
    HtmlTheme,
} from "tree-sitter-ts-highlight";
import { tokenize, type Token } from "tree-sitter-ts";

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

export function createHighlightRenderable(
    code: string,
    language: string,
    options: Omit<HighlightOptions, "wrapInPre" | "language"> = {},
): HighlightRenderable {
    const rawTokens = tokenize(code, language);
    const tokens = options.semanticHighlighting ? enhanceSemantics(rawTokens) : rawTokens;
    const classPrefix = options.classPrefix ?? "hlts-";

    const groups = groupTokensByLine(tokens);
    const startLine = options.startLine ?? 1;
    const lines = groups.map((group) => ({
        lineNumber: group.lineNumber - groups[0].lineNumber + startLine,
        tokens: toRenderTokens(group.tokens, classPrefix, options.theme, options.decorations),
    }));

    return {
        lineNumbers: options.lineNumbers ?? false,
        dataLineAttributes: options.dataLineAttributes ?? true,
        lines,
        tokens: toRenderTokens(tokens, classPrefix, options.theme, options.decorations),
        preStyle: {
            ...(options.theme?.background ? { background: options.theme.background } : {}),
            ...(options.theme?.foreground ? { color: options.theme.foreground } : {}),
        },
    };
}

export function createDiffRenderable(
    oldCode: string,
    newCode: string,
    language: string,
    options: DiffOptions = {},
): DiffRenderable {
    const diff = createDiffModelWithTokens(oldCode, newCode, language, options);
    const classPrefix = options.classPrefix ?? "hlts-";

    const rows = diff.model.rows.map((row) =>
        toDiffRow(row, diff.oldLineTokens, diff.newLineTokens, classPrefix, options.theme, options.decorations),
    );

    return {
        view: options.view ?? "side-by-side",
        showHeader: options.showHeader ?? true,
        oldLabel: diff.model.oldLabel,
        newLabel: diff.model.newLabel,
        rows,
        classPrefix,
    };
}

export function cssTextToStyleObject(cssText: string): Record<string, string> {
    const style: Record<string, string> = {};

    for (const declaration of cssText.split(";")) {
        const trimmed = declaration.trim();
        if (!trimmed) {
            continue;
        }

        const separatorIndex = trimmed.indexOf(":");
        if (separatorIndex === -1) {
            continue;
        }

        const property = trimmed.slice(0, separatorIndex).trim();
        const value = trimmed.slice(separatorIndex + 1).trim();
        if (!property || !value) {
            continue;
        }

        style[property] = value;
    }

    return style;
}

export function styleObjectToCssText(style: Record<string, string>): string {
    return Object.entries(style)
        .map(([key, value]) => `${key}: ${value}`)
        .join("; ");
}

function toRenderTokens(
    tokens: Token[],
    classPrefix: string,
    theme?: HtmlTheme,
    decorations?: Decoration[],
): RenderToken[] {
    const decorated =
        decorations && decorations.length > 0
            ? applyDecorations(tokens, decorations)
            : tokens.map((token) => ({
                token,
                extraClasses: [],
                extraAttrs: {},
                extraStyle: undefined,
            }));

    return decorated.map(({ token, extraClasses, extraAttrs, extraStyle }) => {
        const wrap = token.category !== "whitespace" && token.category !== "newline";

        if (theme) {
            const baseStyle = theme.styles[token.category] ?? "";
            const style = cssTextToStyleObject([baseStyle, extraStyle].filter(Boolean).join(";"));

            return {
                value: token.value,
                category: token.category,
                style,
                dataAttrs: extraAttrs,
                wrap,
            };
        }

        return {
            value: token.value,
            category: token.category,
            className: [classPrefix + token.category, ...extraClasses].join(" "),
            dataAttrs: extraAttrs,
            wrap,
        };
    });
}

function toDiffRow(
    row: DiffRow,
    oldTokenMap: Map<number, Token[]>,
    newTokenMap: Map<number, Token[]>,
    classPrefix: string,
    theme?: HtmlTheme,
    decorations?: Decoration[],
): DiffRenderableRow {
    const oldTokens =
        row.oldLineNumber === null
            ? []
            : toRenderTokens(oldTokenMap.get(row.oldLineNumber) ?? [], classPrefix, theme, decorations);

    const newTokens =
        row.newLineNumber === null
            ? []
            : toRenderTokens(newTokenMap.get(row.newLineNumber) ?? [], classPrefix, theme, decorations);

    return {
        changeType: row.changeType,
        oldLineNumber: row.oldLineNumber,
        newLineNumber: row.newLineNumber,
        oldText: row.oldText,
        newText: row.newText,
        oldTokens,
        newTokens,
    };
}
