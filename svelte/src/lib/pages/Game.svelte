<script lang="ts">
    import { fly } from "svelte/transition";
    import { page } from "$lib/stores/pageStore";
    import { transition } from "$lib/stores/transitionStore";
</script>

<div class="w-full h-full flex flex-col" in:fly={$transition.in} out:fly={$transition.out}>
    <div class="px-6 flex justify-between items-start">
        <div class="flex -mt-20">
            <img class="w-24 bg-secondary rounded-md" src="./cards/back.png" alt="Card Back" />
            <img class="w-24 -ml-10 bg-secondary rounded-md" src="./cards/back.png" alt="Card Back" />
            <img class="w-24 -ml-10 bg-secondary rounded-md" src="./cards/back.png" alt="Card Back" />
            <img class="w-24 -ml-10 bg-secondary rounded-md" src="./cards/back.png" alt="Card Back" />
            <img class="w-24 -ml-10 bg-secondary rounded-md" src="./cards/back.png" alt="Card Back" />
            <img class="w-24 -ml-10 bg-secondary rounded-md" src="./cards/back.png" alt="Card Back" />
            <img class="w-24 -ml-10 bg-secondary rounded-md" src="./cards/back.png" alt="Card Back" />
        </div>
        <div class="mt-6 flex space-x-8">
            <span class="flex text-overlay">1<img class="w-6 mx-0.5" src="./point.png" alt="cosmo">point</span>
            <span>Player 2</span>
        </div>
    </div>
    <div class="h-full flex justify-center items-center space-x-24">
        <div class="sides"/>
        <div class="flex space-x-6">
            <img class="w-32 bg-secondary rounded-lg" src="./cards/fire6.png" alt="Enemy Card Slot" />
            <img class="w-32 bg-secondary rounded-lg" src="./cards/snow9.png" alt="My Card Slot" />
        </div>
        <div class="sides flex flex-col justify-center items-center space-y-3">
            <div class="flex space-x-3">
                <img class="w-16 h-16 opacity-100" src="./elements/energy.png" alt="Energy Element" />
                <img class="w-16 h-16 opacity-10" src="./elements/wind.png" alt="Wind Element" />
            </div>
            <div class="flex space-x-3">
                <img class="w-16 h-16 opacity-10" src="./elements/nature.png" alt="Nature Element" />
                <img class="w-16 h-16 opacity-100" src="./logo.png" alt="Space Element" />
            </div>
        </div>
    </div>
    <div class="px-6 flex justify-between items-end">
        <div class="mb-6 flex space-x-8">
            <span>Player 1</span>
            <span class="flex text-overlay">5<img class="w-6 mx-0.5" src="./point.png" alt="cosmo">points</span>
        </div>
        <div class="flex -mb-20">
            <img class="w-32 bg-secondary rounded-lg transition-transform z-[0] hover:-translate-y-5" src="./cards/water3.png" alt="Card Back" />
            <img class="w-32 -ml-10 bg-secondary rounded-lg transition-transform z-[1] hover:-translate-y-5" src="./cards/fire7.png" alt="Card Back" />
            <img class="w-32 -ml-10 bg-secondary rounded-lg transition-transform z-[2] hover:-translate-y-5" src="./cards/fire3.png" alt="Card Back" />
            <img class="w-32 -ml-10 bg-secondary rounded-lg transition-transform z-[3] hover:-translate-y-5" src="./cards/snow6.png" alt="Card Back" />
            <img class="w-32 -ml-10 bg-secondary rounded-lg transition-transform z-[4] hover:-translate-y-5" src="./cards/water1.png" alt="Card Back" />
            <img class="w-32 -ml-10 bg-secondary rounded-lg transition-transform z-[5] hover:-translate-y-5" src="./cards/fire2.png" alt="Card Back" />
            <img class="w-32 -ml-10 bg-secondary rounded-lg transition-transform z-[6] hover:-translate-y-5" src="./cards/snow5.png" alt="Card Back" />
        </div>
    </div>
</div>

<style lang="postcss">
    .sides {
        @apply w-36 h-36;
    }
</style>