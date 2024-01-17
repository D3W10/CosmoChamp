<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import { backOut } from "svelte/easing";
    import { page } from "$lib/stores/pageStore";
    import { transition } from "$lib/stores/transitionStore";

    let start = false;

    setTimeout(() => {
        start = true;
    }, 1000);
</script>

<div class="w-full h-full flex flex-col" in:fly={$transition.in} out:fly={$transition.out}>
    {#if start}
        <div class="px-6 flex justify-between items-start">
            <div class="flex -mt-20">
                <img class="z-[0] enemy-card" src="./cards/back.png" alt="Enemy Card" in:fly={{ duration: 800, y: -100, delay: 600, easing: backOut }} />
                <img class="-ml-10 z-[1] enemy-card" src="./cards/back.png" alt="Enemy Card" in:fly={{ duration: 800, y: -100, delay: 500, easing: backOut }} />
                <img class="-ml-10 z-[2] enemy-card" src="./cards/back.png" alt="Enemy Card" in:fly={{ duration: 800, y: -100, delay: 400, easing: backOut }} />
                <img class="-ml-10 z-[3] enemy-card" src="./cards/back.png" alt="Enemy Card" in:fly={{ duration: 800, y: -100, delay: 300, easing: backOut }} />
                <img class="-ml-10 z-[4] enemy-card" src="./cards/back.png" alt="Enemy Card" in:fly={{ duration: 800, y: -100, delay: 200, easing: backOut }} />
                <img class="-ml-10 z-[5] enemy-card" src="./cards/back.png" alt="Enemy Card" in:fly={{ duration: 800, y: -100, delay: 100, easing: backOut }} />
                <img class="-ml-10 z-[6] enemy-card" src="./cards/back.png" alt="Enemy Card" in:fly={{ duration: 800, y: -100, easing: backOut }} />
            </div>
            <div class="mt-6 flex space-x-8" in:fly={{ duration: 800, x: 300 }}>
                <span class="flex text-shade/50">0<img class="w-6 mx-0.5" src="./point.png" alt="Cosmo Points" title="Cosmo Points">points</span>
                <span>Player 2</span>
            </div>
        </div>
        <div class="h-full flex justify-center items-center space-x-24">
            <div class="sides flex justify-center items-center">
                <span>15</span>
            </div>
            <div class="flex space-x-6" in:fade={{ duration: 800 }}>
                <div class="w-32 bg-secondary rounded-lg aspect-card" />
                <div class="w-32 bg-secondary rounded-lg aspect-card" />
            </div>
            <div class="sides flex flex-col justify-center items-center space-y-3" in:fade={{ delay: 300, duration: 800 }}>
                <div class="flex space-x-3">
                    <img class="w-16 h-16 opacity-10" src="./elements/energy.png" alt="Energy Element" />
                    <img class="w-16 h-16 opacity-10" src="./elements/wind.png" alt="Wind Element" />
                </div>
                <div class="flex space-x-3">
                    <img class="w-16 h-16 opacity-10" src="./elements/nature.png" alt="Nature Element" />
                    <img class="w-16 h-16 opacity-10" src="./logo.png" alt="Space Element" />
                </div>
            </div>
        </div>
        <div class="px-6 flex justify-between items-end">
            <div class="mb-6 flex space-x-8" in:fly={{ duration: 800, x: -300 }}>
                <span>Player 1</span>
                <span class="flex text-shade/50">0<img class="w-6 mx-0.5" src="./point.png" alt="Cosmo Points" title="Cosmo Points">points</span>
            </div>
            <div class="flex -mb-20">
                <img class="z-[0] hover:-translate-y-5 player-card" src="./cards/space.png" alt="" in:fly={{ duration: 800, y: 150, easing: backOut }} />
                <img class="-ml-10 z-[1] hover:-translate-y-5 player-card" src="./cards/space.png" alt="" in:fly={{ duration: 800, y: 150, delay: 100, easing: backOut }} />
                <img class="-ml-10 z-[2] hover:-translate-y-5 player-card" src="./cards/space.png" alt="" in:fly={{ duration: 800, y: 150, delay: 200, easing: backOut }} />
                <img class="-ml-10 z-[3] hover:-translate-y-5 player-card" src="./cards/space.png" alt="" in:fly={{ duration: 800, y: 150, delay: 300, easing: backOut }} />
                <img class="-ml-10 z-[4] hover:-translate-y-5 player-card" src="./cards/space.png" alt="" in:fly={{ duration: 800, y: 150, delay: 400, easing: backOut }} />
                <img class="-ml-10 z-[5] hover:-translate-y-5 player-card" src="./cards/space.png" alt="" in:fly={{ duration: 800, y: 150, delay: 500, easing: backOut }} />
                <img class="-ml-10 z-[6] hover:-translate-y-5 player-card" src="./cards/space.png" alt="" in:fly={{ duration: 800, y: 150, delay: 600, easing: backOut }} />
            </div>
        </div>
    {/if}
</div>

<style lang="postcss">
    .sides {
        @apply w-36 h-36;
    }

    .player-card {
        @apply w-32 bg-secondary rounded-lg transition-transform;
    }

    .enemy-card {
        @apply w-24 bg-secondary rounded-md;
    }
</style>