<script lang="ts">
    import { onMount } from "svelte";
    import { info } from "$lib/stores/infoStore";
    import { page } from "$lib/stores/pageStore";
    import { settings } from "$lib/stores/settingsStore";
    import FrameBar from "$lib/components/FrameBar.svelte";
    import Home from "$lib/pages/Home.svelte";
    import Rules from "$lib/pages/Rules.svelte";
    import Game from "$lib/pages/Game.svelte";
    import Settings from "$lib/pages/Settings.svelte";

    onMount(() => setup())

    $: $settings, setup();

    function setup() {
        try {
            let themeTranslation = { 0: "light", 1: "midnight", 2: "cosmo", 3: "starlight", 4: "sun", 5: "milkyway" };

            document.documentElement.setAttribute("data-theme", themeTranslation[$settings?.theme as keyof typeof themeTranslation]);
        }
        catch {}
    }
</script>

<svelte:head>
    <title>{$info?.name}</title>
</svelte:head>

<FrameBar />
<main class="w-full h-full bg-background rounded-t-2xl overflow-hidden">
    {#if $page.current == "home"}
        <Home />
    {:else if $page.current == "rules"}
        <Rules />
    {:else if $page.current == "game"}
        <Game />
    {:else if $page.current == "result"}
        <Settings />
    {:else if $page.current == "settings"}
        <Settings />
    {/if}
</main>