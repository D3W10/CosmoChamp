<script lang="ts">
    import Button from "./Button.svelte";

    export let show: boolean;
    export let title = "";
    export let button = "Okay";
    export let canCancel = true;
    export let cancelButton = "Cancel";

    let dialog: HTMLDialogElement;

    $: if (dialog && show) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog class="w-[26rem]" bind:this={dialog} on:close={() => (show = false)}>
    <div class="p-5 flex flex-col space-y-5" role="alertdialog" on:click|stopPropagation>
        {#if title != ""}
            <h1 class="text-2xl font-semibold">{title}</h1>
        {/if}
        <slot />
        <div class="flex justify-end items-center space-x-3">
            {#if canCancel}
                <Button secondary on:click={() => dialog.close()}>{cancelButton}</Button>
            {/if}
            <Button on:click={() => dialog.close()}>{button}</Button>
        </div>
    </div>
</dialog>

<style>
    dialog:not([open]) {
        animation: zoom 0.4s cubic-bezier(0.8, 0, 0.85, 0.6) reverse, fade 0.2s cubic-bezier(0.8, 0, 0.85, 0.6) reverse;
    }

    dialog[open] {
        animation: zoom 0.4s cubic-bezier(0.15, 0.4, 0.2, 1), fade 0.2s cubic-bezier(0.15, 0.4, 0.2, 1);
    }
        
    @keyframes zoom {
        from {
            transform: scale(0.5);
        }
        to {
            transform: scale(1);
        }
    }

    dialog:not([open])::backdrop {
        animation: fade 0.4s cubic-bezier(0.8, 0, 0.85, 0.6) reverse;
    }

    dialog[open]::backdrop {
        animation: fade 0.4s cubic-bezier(0.15, 0.4, 0.2, 1);
    }

    @keyframes fade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>
