<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { slide } from "svelte/transition";
    import { quintOut } from "svelte/easing";

    export let className: string = "";
    export let items: string[];
    export let selected: number = 0;

    let open = false;
    const dispatch = createEventDispatcher();
    $: selectedItem = items[selected];

    function itemSelected(index: number) {
        selected = index;

        dispatch("change", { selected: index });
    }
</script>

<button class={"absolute right-0 bg-tertiary rounded-lg overflow-hidden " + className} role="combobox" aria-controls="comboboxItems" aria-expanded={open} on:click={() => open = !open}>
    <div class="px-3 py-1 bg-secondary rounded-b-lg text-left">
        <span>{selectedItem}</span>
    </div>
    {#if open}
        <div id="comboboxItems" class="flex flex-col bg-tertiary" transition:slide={{ duration: 500, easing: quintOut }}>
            {#each items as item, i}
                <button class="px-3 py-1 text-left" on:click={() => itemSelected(i)}>{item}</button>
            {/each}
        </div>
    {/if}
</button>