<script lang="ts">
    import { app } from "$lib/stores/appStore";
    import { info } from "$lib/stores/infoStore";
    import { game } from "$lib/stores/gameStore";
    import { page } from "$lib/stores/pageStore";
    import { close } from "$lib/stores/closeStore";
    import Modal from "$lib/components/Modal.svelte";

    let showModal: boolean = false;

    $app.updateCloseCallback(() => onRedButtonClick());

    function onRedButtonClick() {
        if ($game == null)
            $app.closeWindow();
        else
            showModal = true;
    }

    function onModalSubmit() {
        $close.close();

        page.set({ current: "home", back: true });
        setTimeout(() => game.set(null), 500);
    }
</script>

<div class="w-full h-10 p-2 flex justify-between drag">
    {#if $app}
        {@const platform = $app.getPlatform()}
        <div class="w-32 flex items-center space-x-2 {platform == "darwin" ? "pl-[4.5rem]" : ""}">
            {#if platform != "darwin"}
                <img class="h-5 ml-0.5" src="./logo.png" alt="{$info.name} Logo" />
            {/if}
            <span class="text-sm font-semibold">{$info.name}</span>
        </div>
        <div class="w-32 flex items-center p-1 space-x-2">
            {#if platform != "darwin"}
                <button class="w-4 h-4 flex justify-center items-center relative bg-tertiary rounded-full overflow-hidden before:w-0 before:h-0 before:absolute before:bg-amber-500 before:rounded-full before:transition-all before:duration-[400ms] before:ease-cubic-out hover:before:w-9 hover:before:h-9 focus-visible:outline-amber-500" on:click={$app.minimizeWindow}></button>
                <button class="w-4 h-4 flex justify-center items-center relative bg-tertiary rounded-full overflow-hidden before:w-0 before:h-0 before:absolute before:bg-red-500 before:rounded-full before:transition-all before:duration-[400ms] before:ease-cubic-out hover:before:w-9 hover:before:h-9 focus-visible:outline-red-500" on:click={onRedButtonClick}></button>
            {/if}
        </div>
    {/if}
</div>
<Modal bind:show={showModal} title="Leave to Lobby" button="Yes" cancelButton="No" on:submit={onModalSubmit}>
    <p>Are you sure you want to leave this room and go back to the home page?</p>
</Modal>

<style lang="postcss">
    button {
        -webkit-app-region: no-drag;
    }

    .drag {
        -webkit-app-region: drag;
    }
</style>