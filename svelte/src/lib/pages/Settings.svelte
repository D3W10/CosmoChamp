<script lang="ts">
    import { fly } from "svelte/transition";
    import { info } from "$lib/stores/infoStore";
    import { page } from "$lib/stores/pageStore";
    import { game } from "$lib/stores/gameStore";
    import { transition } from "$lib/stores/transitionStore";
    import { settings } from "$lib/stores/settingsStore";
    import Button from "$lib/components/Button.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import ComboBox from "$lib/components/ComboBox.svelte";
    import Input from "$lib/components/Input.svelte";
</script>

<div class="w-full h-full flex flex-col" in:fly={$transition.pageIn} out:fly={$transition.pageOut}>
    <div class="mb-7 px-16 pt-16 flex justify-between items-center">
        <h1 class="text-2xl font-semibold">Settings</h1>
        <Button type="invisible" className="h-fit flex items-center text-primary" on:click={() => page.set({ current: "home", back: true })}>
            <Icon name="chevron" className="w-5 h-5 mr-1 fill-current rotate-90" />
            Back
        </Button>
    </div>
    <div class="h-full px-16 space-y-14 overflow-y-scroll">
        <div>
            <h2 class="mb-2 text-lg font-semibold">Appearance</h2>
            <hr class="h-[3px] mb-6 bg-shade/10 border-0 rounded-full" />
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <p>Theme</p>
                        <p class="mt-0.5 text-foreground/70 text-sm font-normal">Change the game's theme</p>
                    </div>
                    <ComboBox className="w-32" items={["Midnight", "Light", "Cosmo", "Starlight", "Milky Way"]} selected={$settings.theme} on:change={(e) => settings.update("theme", e.detail.selected)} />
                </div>
                <div class="flex justify-between items-center">
                    <div>
                        <p>Reduce Motion</p>
                        <p class="mt-1 text-foreground/70 text-sm font-normal">Reduces the motion of the animations</p>
                    </div>
                    <Input type="switch" value={$settings.reduceMotion} on:input={(e) => settings.update("reduceMotion", e.detail.value)} />
                </div>
            </div>
        </div>
        <div>
            <h2 class="pb-2 text-lg font-semibold">Game</h2>
            <hr class="h-[3px] mb-6 bg-shade/10 border-0 rounded-full" />
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <p>Player Name</p>
                        <p class="mt-1 text-foreground/70 text-sm font-normal">Set the player name displayed during game</p>
                    </div>
                    <Input className="w-40" type="text" placeholder="Guest" maxlength={15} value={$settings.playerName} on:input={(e) => settings.update("playerName", e.detail.value.trim())} on:blur={() => { if ($settings.playerName.length == 0) settings.update("playerName", "Guest"); }} />
                </div>
                <div class="flex justify-between items-center">
                    <div>
                        <p>Volume</p>
                        <p class="mt-1 text-foreground/70 text-sm font-normal">Set the game music volume</p>
                    </div>
                    <Input type="range" min={0} max={100} innerClassName="w-7" value={$settings.volume} on:input={(e) => settings.update("volume", e.detail.value)} />
                </div>
                <div class="flex justify-between items-center">
                    <div>
                        <p>Sound Effects Volume</p>
                        <p class="mt-1 text-foreground/70 text-sm font-normal">Set the game sound effects volume</p>
                    </div>
                    <Input type="range" min={0} max={100} innerClassName="w-7" value={$settings.sfxVolume} on:input={(e) => settings.update("sfxVolume", e.detail.value)} />
                </div>
                <div class="flex justify-between items-center">
                    <div>
                        <p>Rules</p>
                        <p class="mt-1 text-foreground/70 text-sm font-normal">Check the game rules</p>
                    </div>
                    <Button on:click={() => { game.set(null); page.set({ current: "rules", back: false }); }}>Check Rules</Button>
                </div>
            </div>
        </div>
        <div>
            <h2 class="pb-2 text-lg font-semibold">About</h2>
            <hr class="h-[3px] mb-6 bg-shade/10 border-0 rounded-full" />
            <div class="mb-10">
                <div class="flex items-center space-x-4">
                    <img src="./logo.png" alt="Logo" class="w-16" />
                    <div class="flex flex-col">
                        <p>{$info.name}</p>
                        <p class="text-foreground/70 text-sm">Version {$info.version}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>