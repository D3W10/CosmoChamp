<script lang="ts">
    import { fly } from "svelte/transition";
    import { page } from "$lib/stores/pageStore";
    import { transition } from "$lib/stores/transitionStore";
    import { game } from "$lib/stores/gameStore";
    import Icon from "$lib/components/Icon.svelte";
    import ProgressBar from "$lib/components/ProgressBar.svelte";

    let value = 0;
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
    {#if $page.options && $page.options.gameMode != undefined && $page.options.gameMode}
        <div class="h-1/5 flex bg-secondary rounded-t-2xl">
            <div class="w-1/4 p-6 space-y-1">
                <p>{$game?.mode}</p>
                <p class="flex items-center text-shade/50 text-sm">{$game?.goal} <img class="w-5 h-5 ml-0.5 inline-block" src="./point.png" alt="Cosmo Points" title="Cosmo Points" /></p>
            </div>
            <div class="w-2/4 flex justify-center items-center">
                <div class="w-full flex flex-col justify-center items-center space-y-4">
                    <span class="animate-pulse">Waiting for second player</span>
                    <ProgressBar bind:value />
                </div>
            </div>
            <div class="w-1/4 p-6 space-y-1 text-right">
                <p>Player 2</p>
                <div class="flex justify-end items-center text-shade/50">
                    <div class="w-4 h-4 mr-2 bg-shade/20 rounded-full"></div>
                    <p class="flex items-center text-sm">Not Ready</p>
                </div>
            </div>
        </div>
    {/if}
</div>