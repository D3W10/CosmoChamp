<script lang="ts">
    import { fly } from "svelte/transition";
    import { page } from "$lib/stores/pageStore";
    import { transition } from "$lib/stores/transitionStore";
    import Icon from "$lib/components/Icon.svelte";
    import ProgressBar from "$lib/components/ProgressBar.svelte";

    export let gameMode: boolean;
</script>

<div class="w-full h-full flex flex-col" in:fly={$transition.in} out:fly={$transition.out}>
    <div class="h-full flex">
        <button class="w-1/5 flex justify-center items-center opacity-5 transition-opacity hover:opacity-70">
            <Icon name="chevron" className="w-1/2 fill-current rotate-90" />
        </button>
        <div class="w-full">
            <div>

            </div>
            <div>
                
            </div>
            <div>
                
            </div>
        </div>
        <button class="w-1/5 flex justify-center items-center opacity-30 transition-opacity hover:opacity-70">
            <Icon name="chevron" className="w-1/2 fill-current -rotate-90" />
        </button>
    </div>
    {#if !gameMode}
        <div class="h-1/5 flex bg-secondary rounded-t-2xl">
            <div class="w-1/4 p-6 flex justify-start items-center">
                <div class="flex flex-col space-y-2">
                    <span>Name</span>
                    <input type="text" />
                </div>
            </div>
            <div class="w-2/4 flex justify-center items-center">
                <div class="w-full flex flex-col justify-center items-center space-y-4">
                    <span class="animate-pulse">Waiting for second player</span>
                    <ProgressBar />
                </div>
            </div>
            <div class="w-1/4 p-6 flex justify-end items-center">
                <div class="flex flex-col space-y-2">
                    <span>Goal</span>
                    <input class="w-20" type="text" />
                </div>
            </div>
        </div>
    {/if}
</div>