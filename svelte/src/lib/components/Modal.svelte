<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { settings } from "../stores/settingsStore";
    import Button from "./Button.svelte";

    export let show: boolean;
    export let title: string = "";
    export let button: string = "Okay";
    export let canCancel: boolean = true;
    export let cancelButton: string = "Cancel";

    let dialog: HTMLDialogElement;
    const dispatch = createEventDispatcher<{ submit: undefined }>();

    $: {
        if (dialog && show)
            dialog.showModal();
    }

    function closeModal(submit: boolean) {
        if (submit)
            setTimeout(() => dispatch("submit"), 0);

        setTimeout(() => dialog.close(), 400);
        show = false;
    }
</script>

<dialog class={`w-[26rem] transition-all ease-quint-out opacity-0 ${show ? "open" : "closed"} ${!$settings.reduceMotion ? "duration-[400ms] scale-50" : "duration-200 scale-75 reduced"}`} bind:this={dialog} on:close={() => (show = false)}>
    <div class="p-5 flex flex-col space-y-5" role="alertdialog">
        {#if title != ""}
            <h1 class="text-2xl font-semibold">{title}</h1>
        {/if}
        <slot />
        <div class="flex justify-end items-center space-x-3">
            {#if canCancel}
                <Button secondary on:click={() => closeModal(false)}>{cancelButton}</Button>
            {/if}
            <Button on:click={() => closeModal(true)}>{button}</Button>
        </div>
    </div>
</dialog>

<style lang="postcss">
    dialog.open {
        @apply opacity-100 scale-100;
    }

    dialog::backdrop {
        @apply opacity-0 transition-opacity duration-[400ms] ease-quint-out;
    }

    dialog.reduced::backdrop {
        @apply duration-200;
    }

    dialog.open::backdrop {
        @apply opacity-100;
    }
</style>
