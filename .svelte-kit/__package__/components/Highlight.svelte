<script lang="ts">
    import type { HighlightOptions } from "tree-sitter-ts-highlight";
    import {
        createHighlightRenderable,
        styleObjectToCssText,
        type RenderToken,
    } from "../lib/svelte-renderer";

    interface HighlightProps {
        code: string;
        language: string;
        options?: Omit<HighlightOptions, "wrapInPre" | "language">;
        preClassName?: string;
        codeClassName?: string;
    }

    export let code: HighlightProps["code"];
    export let language: HighlightProps["language"];
    export let options: HighlightProps["options"] = undefined;
    export let preClassName: HighlightProps["preClassName"] = "";
    export let codeClassName: HighlightProps["codeClassName"] = "";

    $: renderable = createHighlightRenderable(code, language, options);
    $: preStyle = styleObjectToCssText(renderable.preStyle);
    $: mergedPreClass = ["hlts", `hlts-lang-${language}`, preClassName]
        .filter(Boolean)
        .join(" ");
    $: mergedCodeClass = [codeClassName].filter(Boolean).join(" ");

    function tokenStyle(token: RenderToken): string {
        return token.style ? styleObjectToCssText(token.style) : "";
    }
</script>

<pre class={mergedPreClass} style={preStyle}>
  <code class={mergedCodeClass}>
    {#if renderable.lineNumbers}
            <table class="hlts-table">
        <tbody>
          {#each renderable.lines as line}
                        <tr
                            data-line={renderable.dataLineAttributes
                                ? line.lineNumber
                                : undefined}>
              <td class="hlts-line-number">{line.lineNumber}</td>
              <td class="hlts-line-content">
                {#each line.tokens as token}
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
              </td>
            </tr>
                    {/each}
        </tbody>
      </table>
        {:else}
            {#each renderable.tokens as token}
                {#if token.wrap}
                    <span
                        class={token.className}
                        style={tokenStyle(token)}
                        {...token.dataAttrs}>{token.value}</span
                    >
                {:else}
                    {token.value}
                {/if}
            {/each}
        {/if}
  </code>
</pre>
