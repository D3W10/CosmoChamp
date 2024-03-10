<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { Howl } from "howler";
    import { sound } from "$lib/stores/soundStore";

    export let type: "visible" | "invisible" = "visible";
    export let className: string = "";
    export let disabled: boolean = false;
    export let secondary: boolean = false;

    const dispatch = createEventDispatcher<{ click: MouseEvent }>();
    const click = new Howl({ src: ["sounds/click.mp3"], html5: true, volume: $sound.btnVolume });

    function onClick(e: MouseEvent) {
        click.play();

        dispatch("click", e);
    }
</script>

{#if type == "visible"}
    <button class="px-4 py-1.5 flex justify-center items-center relative text-sm {!secondary ? "text-white bg-primary" : "bg-tertiary"} disabled:opacity-50 disabled:bg-tertiary rounded-lg transition-colors overflow-hidden z-0 before:block disabled:before:hidden before:left-1/2 before:right-1/2 before:aspect-square before:absolute {!secondary ? "before:bg-black/20" : "before:bg-shade/5"} before:rounded-full before:transition-all before:duration-[400ms] before:ease-cubic-out before:-z-10 hover:before:-left-3 hover:before:-right-3 {className}" {disabled} on:click={onClick}>
        <slot />
    </button>
{:else}
    <button class={className} {disabled} on:click={onClick}>
        <slot />
    </button>
{/if}