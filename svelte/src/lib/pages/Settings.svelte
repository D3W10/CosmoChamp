<script lang="ts">
    import { fly } from "svelte/transition";
    import { info } from "$lib/stores/infoStore";
    import { page } from "$lib/stores/pageStore";
    import { transition } from "$lib/stores/transitionStore";
    import ComboBox from "$lib/components/ComboBox.svelte";
</script>

<div class="w-full h-full p-16" in:fly={$transition.in} out:fly={$transition.out}>
    <div class="mb-7 flex justify-between items-start">
        <h1 class="text-xl font-semibold">Settings</h1>
        <button class="flex items-center text-blue-500" on:click={() => page.set({ current: "home", back: true })}>
            <span class="mr-2 block leading-3 rotate-180">➜</span>
            Back
        </button>
    </div>
    <div class="space-y-5">
        <div class="h-8 flex justify-between relative">
            <p>Theme</p>
            <ComboBox className="w-24" items={["Light", "Dark", "Blue"]} selected={2} on:change={(e) => console.log(e.detail.selected)} />
        </div>
        <div class="flex items-center space-x-4">
            <img src="./branding/logo.png" alt="Logo" class="w-16" />
            <div class="flex flex-col">
                <p>{$info?.name}</p>
                <p class="text-sm">Version {$info?.version}</p>
            </div>
        </div>
    </div>
</div>