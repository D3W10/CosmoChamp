<script lang="ts">
    import FrameBar from "$lib/components/FrameBar.svelte";
    import Home from "$lib/pages/Home.svelte";
    import Settings from "$lib/pages/Settings.svelte";
    import { info } from "$lib/stores/infoStore";
    import { page } from "$lib/stores/pageStore";
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