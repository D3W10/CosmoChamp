<script lang="ts">
    import { fly } from "svelte/transition";
    import { page } from "$lib/stores/pageStore";
    import { transition } from "$lib/stores/transitionStore";
    import Icon from "$lib/components/Icon.svelte";
    import Button from "$lib/components/Button.svelte";
</script>

<div class="w-full h-full flex p-16" in:fly={$transition.pageIn} out:fly={$transition.pageOut}>
    <div class="w-1/2 h-full flex flex-col">
        <div class="mb-7 flex justify-between items-center">
            <h1 class="text-2xl font-semibold">Game won!</h1>
        </div>
        <div class="h-full flex flex-col justify-between">
            <div class="w-1/2 flex flex-col space-y-4">
                <div class="flex items-center space-x-2">
                    <img class="h-10" src="./point.png" alt="Cosmo Points" title="Cosmo points obtained" />
                    <p class="text-xl">10</p>
                </div>
                <div class="flex items-center space-x-2">
                    <div title="Game total duration">
                        <Icon name="stopwatch" className="h-10" />
                    </div>
                    <p class="text-xl">01:23</p>
                </div>
            </div>
            <div>
                <Button on:click={() => page.set({ current: "home", back: true })}>Return to the Main Menu</Button>
            </div>
        </div>
    </div>
    <div class="w-1/2 flex justify-center items-center">
        <Icon name="crown" className="w-1/2" />
    </div>
</div>