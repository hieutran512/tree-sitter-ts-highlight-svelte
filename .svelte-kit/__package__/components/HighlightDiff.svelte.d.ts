import type { DiffOptions } from "tree-sitter-ts-highlight";
interface $$__sveltets_2_IsomorphicComponent<Props extends Record<string, any> = any, Events extends Record<string, any> = any, Slots extends Record<string, any> = any, Exports = {}, Bindings = string> {
    new (options: import('svelte').ComponentConstructorOptions<Props>): import('svelte').SvelteComponent<Props, Events, Slots> & {
        $$bindings?: Bindings;
    } & Exports;
    (internal: unknown, props: Props & {
        $$events?: Events;
        $$slots?: Slots;
    }): Exports & {
        $set?: any;
        $on?: any;
    };
    z_$$bindings?: Bindings;
}
declare const HighlightDiff: $$__sveltets_2_IsomorphicComponent<{
    oldCode: string;
    newCode: string;
    language: string;
    options?: DiffOptions | undefined;
    containerClassName?: string | undefined;
}, {
    [evt: string]: CustomEvent<any>;
}, {}, {}, string>;
type HighlightDiff = InstanceType<typeof HighlightDiff>;
export default HighlightDiff;
//# sourceMappingURL=HighlightDiff.svelte.d.ts.map