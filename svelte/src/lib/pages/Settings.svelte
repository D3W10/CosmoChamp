<script lang="ts">
    import { fly } from "svelte/transition";
    import { info } from "$lib/stores/infoStore";
    import { page } from "$lib/stores/pageStore";
    import { transition } from "$lib/stores/transitionStore";
    import { settings } from "$lib/stores/settingsStore";
    import Icon from "$lib/components/Icon.svelte";
    import ComboBox from "$lib/components/ComboBox.svelte";
    import Input from "$lib/components/Input.svelte";
    import Button from "$lib/components/Button.svelte";

    let playerName: string = $settings?.playerName!;
</script>

<div class="w-full h-full p-16" in:fly={$transition.in} out:fly={$transition.out}>
    <div class="mb-7 flex justify-between items-start">
        <h1 class="text-2xl font-semibold">Settings</h1>
        <button class="flex items-center text-primary-light" on:click={() => page.set({ current: "home", back: true })}>
            <Icon name="chevron" className="w-5 h-5 mr-1 fill-current rotate-90" />
            Back
        </button>
    </div>
    <div class="space-y-5">
        <div class="h-8 flex justify-between">
            <p class="flex items-center">Theme</p>
            <ComboBox className="w-32" items={["Light", "Midnight", "Cosmo", "Starlight", "Sun", "Milky Way"]} selected={$settings?.theme} on:change={(e) => settings.update("theme", e.detail.selected)} />
        </div>
        <div class="h-8 flex justify-between">
            <p class="flex items-center">Player Name</p>
            <Input className="w-40" type="text" placeholder="Guest" maxlength={15} bind:value={playerName} on:input={() => settings.update("playerName", playerName.trim() || "Guest")} />
        </div>
        <div class="h-8 flex justify-between">
            <p class="flex items-center">Rules</p>
            <Button on:click={() => page.set({ current: "rules", back: false })}>Check Rules</Button>
        </div>
        <div class="flex items-center space-x-4">
            <img src="./logo.png" alt="Logo" class="w-16" />
            <div class="flex flex-col">
                <p>{$info?.name}</p>
                <p class="text-sm">Version {$info?.version}</p>
            </div>
        </div>
    </div>
</div>