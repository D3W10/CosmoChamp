<script lang="ts">
    import { app } from "$lib/stores/appStore";
    import { info } from "$lib/stores/infoStore";
</script>

<div class="w-full h-10 p-2 flex justify-between drag">
    <div class="flex items-center space-x-2">
        <img class="h-5 ml-0.5" src="./logo.png" alt={`${$info?.name} logo`} />
        <span class="text-sm font-semibold">{$info?.name}</span>
    </div>
    <div class="flex items-center p-1 space-x-2">
        <button class="w-4 h-4 flex justify-center items-center relative bg-tertiary rounded-full overflow-hidden before:w-0 before:h-0 before:absolute before:bg-amber-500 before:rounded-full before:transition-all before:duration-300 before:ease-cubic-out hover:before:w-9 hover:before:h-9 hover:before:ease-in focus-visible:outline-amber-500" on:click={$app?.minimizeWindow}></button>
        <button class="w-4 h-4 flex justify-center items-center relative bg-tertiary rounded-full overflow-hidden before:w-0 before:h-0 before:absolute before:bg-red-500 before:rounded-full before:transition-all before:duration-300 before:ease-cubic-out hover:before:w-9 hover:before:h-9 hover:before:ease-in focus-visible:outline-red-500" on:click={$app?.closeWindow}></button>
    </div>
</div>

<style lang="postcss">
    button {
        -webkit-app-region: no-drag;
    }

    .drag {
        -webkit-app-region: drag;
    }
</style>