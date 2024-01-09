<script lang="ts">
    import Button from "./Button.svelte";

    export let show: boolean;
    export let title = "";
    export let button = "Okay";
    export let canCancel = true;
    export let cancelButton = "Cancel";

    let dialog: HTMLDialogElement;

    $: {
        if (dialog && show)
            dialog.showModal();
    }

    function closeModal() {
        setTimeout(() => dialog.close(), 400);
        show = false;
    }
</script>

<dialog class={"w-[26rem] transition-all duration-[400ms] ease-bang-out scale-50 opacity-0 " + (show ? "open" : "closed")} bind:this={dialog} on:close={() => (show = false)}>
    <div class="p-5 flex flex-col space-y-5" role="alertdialog">
        {#if title != ""}
            <h1 class="text-2xl font-semibold">{title}</h1>
        {/if}
        <slot />
        <div class="flex justify-end items-center space-x-3">
            {#if canCancel}
                <Button secondary on:click={closeModal}>{cancelButton}</Button>
            {/if}
            <Button on:click={() => dialog.close()}>{button}</Button>
        </div>
    </div>
</dialog>

<style lang="postcss">
    dialog.open {
        @apply opacity-100 scale-100;
    }

    dialog::backdrop {
        @apply opacity-0 transition-opacity duration-[400ms] ease-bang-out;
    }

    dialog.open::backdrop {
        @apply opacity-100;
    }
</style>
