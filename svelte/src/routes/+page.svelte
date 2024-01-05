<script lang="ts">
    import { onMount } from "svelte";
    import { info } from "$lib/stores/infoStore";
    import { page } from "$lib/stores/pageStore";
    import { settings } from "$lib/stores/settingsStore";
    import FrameBar from "$lib/components/FrameBar.svelte";
    import Home from "$lib/pages/Home.svelte";
    import Settings from "$lib/pages/Settings.svelte";

    onMount(() => setup())

    $: $settings, setup();

    function setup() {
        try {
            document.documentElement.setAttribute("data-theme", $settings?.theme == 1 ? "dark" : ($settings?.theme == 2 ? "blue" : "light"));
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
        <Settings />
    {:else if $page.current == "game"}
        <Settings />
    {:else if $page.current == "result"}
        <Settings />
    {:else if $page.current == "settings"}
        <Settings />
    {/if}
</main>