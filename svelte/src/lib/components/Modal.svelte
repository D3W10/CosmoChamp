<script lang="ts">
    export let show: boolean;

    let dialog: HTMLDialogElement;

    $: if (dialog && show) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog bind:this={dialog} on:close={() => (show = false)} on:click|self={() => dialog.close()}>
    <div class="p-5" role="alertdialog" on:click|stopPropagation>
        <slot />
        <button on:click={() => dialog.close()}>close modal</button>
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
