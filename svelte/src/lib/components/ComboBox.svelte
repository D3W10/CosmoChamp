<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { slide } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    import Icon from "./Icon.svelte";

    export let className: string = "";
    export let items: string[];
    export let selected: number = 0;
    export let listClassName: string = "";

    let open = false;
    const dispatch = createEventDispatcher();
    $: selectedItem = items[selected];

    function itemSelected(index: number) {
        selected = index;

        dispatch("change", { selected: index });
    }
</script>

<button class={`block relative rounded-md z-10 ${className}`} role="combobox" aria-controls="comboboxItems" aria-expanded={open} on:click={() => open = !open}>
    <div class="px-2 py-1.5 flex justify-between items-center bg-tertiary text-left rounded-md">
        <span class="text-sm">{selectedItem}</span>
        <Icon name="chevron" className={`w-5 h-5 ml-2 fill-current transition-transform duration-500 ${open ? "-rotate-180" : ""}`} />
    </div>
    {#if open}
        <div class="w-full absolute top-6 bg-tertiary rounded-b-md overflow-hidden -z-10" transition:slide={{ duration: 500, easing: quintOut }}>
            <div id="comboboxItems" class={`max-h-[7.5rem] flex flex-col bg-shade/5 overflow-y-scroll ${listClassName}`}>
                {#each items as item, i}
                    <button class={"px-2 py-1.5 text-left text-sm " + (i == 0 ? "pt-3.5" : "")} on:click={() => itemSelected(i)}>{item}</button>
                {/each}
            </div>
        </div>
    {/if}
</button>