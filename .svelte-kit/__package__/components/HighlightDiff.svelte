<script lang="ts">
    import type { DiffOptions } from "tree-sitter-ts-highlight";
    import {
        createDiffRenderable,
        styleObjectToCssText,
        type RenderToken,
    } from "../lib/svelte-renderer";

    interface HighlightDiffProps {
        oldCode: string;
        newCode: string;
        language: string;
        options?: DiffOptions;
        containerClassName?: string;
    }

    export let oldCode: HighlightDiffProps["oldCode"];
    export let newCode: HighlightDiffProps["newCode"];
    export let language: HighlightDiffProps["language"];
    export let options: HighlightDiffProps["options"] = undefined;
    export let containerClassName: HighlightDiffProps["containerClassName"] =
        "";

    $: renderable = createDiffRenderable(oldCode, newCode, language, options);

    function tokenStyle(token: RenderToken): string {
        return token.style ? styleObjectToCssText(token.style) : "";
    }
</script>

<div class={containerClassName}>
    {#if renderable.view === "inline"}
        <table
            class={`${renderable.classPrefix}diff ${renderable.classPrefix}diff-inline`}
        >
            <tbody>
                {#each renderable.rows as row}
                    {#if row.changeType === "context"}
                        <tr
                            class={`${renderable.classPrefix}diff-row ${renderable.classPrefix}diff-context`}
                        >
                            <td class={`${renderable.classPrefix}diff-gutter`}
                                >{row.newLineNumber ?? ""}</td
                            >
                            <td class={`${renderable.classPrefix}diff-sign`}>
                            </td>
                            <td class={`${renderable.classPrefix}diff-content`}>
                                {#if row.newTokens.length > 0}
                                    {#each row.newTokens as token}
                                        {#if token.wrap}
                                            <span
                                                class={token.className}
                                                style={tokenStyle(token)}
                                                {...token.dataAttrs}
                                                >{token.value}</span
                                            >
                                        {:else}
                                            {token.value}
                                        {/if}
                                    {/each}
                                {:else}
                                    {row.newText}
                                {/if}
                            </td>
                        </tr>
                    {:else}
                        {#if row.oldLineNumber !== null}
                            <tr
                                class={`${renderable.classPrefix}diff-row ${renderable.classPrefix}diff-removed`}
                            >
                                <td
                                    class={`${renderable.classPrefix}diff-gutter`}
                                    >{row.oldLineNumber}</td
                                >
                                <td class={`${renderable.classPrefix}diff-sign`}
                                    >-</td
                                >
                                <td
                                    class={`${renderable.classPrefix}diff-content`}
                                >
                                    {#if row.oldTokens.length > 0}
                                        {#each row.oldTokens as token}
                                            {#if token.wrap}
                                                <span
                                                    class={token.className}
                                                    style={tokenStyle(token)}
                                                    {...token.dataAttrs}
                                                    >{token.value}</span
                                                >
                                            {:else}
                                                {token.value}
                                            {/if}
                                        {/each}
                                    {:else}
                                        {row.oldText}
                                    {/if}
                                </td>
                            </tr>
                        {/if}
                        {#if row.newLineNumber !== null}
                            <tr
                                class={`${renderable.classPrefix}diff-row ${renderable.classPrefix}diff-added`}
                            >
                                <td
                                    class={`${renderable.classPrefix}diff-gutter`}
                                    >{row.newLineNumber}</td
                                >
                                <td class={`${renderable.classPrefix}diff-sign`}
                                    >+</td
                                >
                                <td
                                    class={`${renderable.classPrefix}diff-content`}
                                >
                                    {#if row.newTokens.length > 0}
                                        {#each row.newTokens as token}
                                            {#if token.wrap}
                                                <span
                                                    class={token.className}
                                                    style={tokenStyle(token)}
                                                    {...token.dataAttrs}
                                                    >{token.value}</span
                                                >
                                            {:else}
                                                {token.value}
                                            {/if}
                                        {/each}
                                    {:else}
                                        {row.newText}
                                    {/if}
                                </td>
                            </tr>
                        {/if}
                    {/if}
                {/each}
            </tbody>
        </table>
    {:else}
        <table
            class={`${renderable.classPrefix}diff ${renderable.classPrefix}diff-side-by-side`}
        >
            <tbody>
                {#if renderable.showHeader}
                    <tr class={`${renderable.classPrefix}diff-header`}>
                        <th
                            class={`${renderable.classPrefix}diff-label`}
                            colspan="2">{renderable.oldLabel}</th
                        >
                        <th
                            class={`${renderable.classPrefix}diff-label`}
                            colspan="2">{renderable.newLabel}</th
                        >
                    </tr>
                {/if}

                {#each renderable.rows as row}
                    <tr
                        class={`${renderable.classPrefix}diff-row ${renderable.classPrefix}diff-${row.changeType}`}
                    >
                        <td class={`${renderable.classPrefix}diff-gutter`}
                            >{row.oldLineNumber ?? ""}</td
                        >
                        <td class={`${renderable.classPrefix}diff-content`}>
                            {#if row.oldLineNumber !== null}
                                {#if row.oldTokens.length > 0}
                                    {#each row.oldTokens as token}
                                        {#if token.wrap}
                                            <span
                                                class={token.className}
                                                style={tokenStyle(token)}
                                                {...token.dataAttrs}
                                                >{token.value}</span
                                            >
                                        {:else}
                                            {token.value}
                                        {/if}
                                    {/each}
                                {:else}
                                    {row.oldText}
                                {/if}
                            {/if}
                        </td>
                        <td class={`${renderable.classPrefix}diff-gutter`}
                            >{row.newLineNumber ?? ""}</td
                        >
                        <td class={`${renderable.classPrefix}diff-content`}>
                            {#if row.newLineNumber !== null}
                                {#if row.newTokens.length > 0}
                                    {#each row.newTokens as token}
                                        {#if token.wrap}
                                            <span
                                                class={token.className}
                                                style={tokenStyle(token)}
                                                {...token.dataAttrs}
                                                >{token.value}</span
                                            >
                                        {:else}
                                            {token.value}
                                        {/if}
                                    {/each}
                                {:else}
                                    {row.newText}
                                {/if}
                            {/if}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {/if}
</div>
