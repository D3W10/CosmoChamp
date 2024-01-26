<script lang="ts">
    import { crossfade, fade, fly } from "svelte/transition";
    import { backOut, quintIn, quintOut } from "svelte/easing";
    import { app } from "$lib/stores/appStore";
    import { page } from "$lib/stores/pageStore";
    import { game } from "$lib/stores/gameStore";
    import { settings } from "$lib/stores/settingsStore";
    import { transition } from "$lib/stores/transitionStore";
    import { drawCard, drawDeck } from "$lib/deck";
    import { gameModes } from "$lib/models/GameModes.object";
    import type { Card } from "$lib/models/Card.interface";

    let versus = false, start = false, opponentHover = -1;
    let cards: Card[] = [], cardsElmts: HTMLImageElement[] = new Array(7);
    let pSendState: boolean[] = Array(7), oSendState: boolean[] = Array(7);

    setTimeout(() => versus = true, 1000);

    $app?.updateReceiveCallback(receiveMessage);

    if ($game?.host) {
        cards = drawDeck();
        $app?.sendMessage(`DECK ${drawDeck().map((card) => card.id).join(";")}`);
    }

    function receiveMessage(message: string) {
        let args = message.split(" ");

        if (args[0] == "HOVER")
            opponentHover = +args[1];
        else if (args[0] == "DECK" && !$game?.host)
            cards = args[1].split(";").map((id) => { return { id: id }});
        else if (args[0] == "SELECT")
            oSendState[+args[1]] = true;
    }

    function checkHoverState() {
        if (!cardsElmts.some((card) => card.matches(":hover")))
            $app?.sendMessage("HOVER -1");
    }
</script>

<div class="w-full h-full" in:fly={$transition.pageIn} out:fly={$transition.pageOut}>
    {#if versus}
        <div class="w-full h-full flex flex-col justify-center items-center space-y-20">
            <div class="w-1/3 flex justify-around" in:fade={{ duration: 1000 }} out:fade={{ duration: 1000, delay: 1500 }}>
                <span class="text-2xl">{gameModes[$game ? $game.mode : 0].name}</span>
                <span class="flex text-shade/50 text-2xl">{$game?.goal}<img class="w-8 mx-0.5" src="./point.png" alt="Cosmo Points" title="Cosmo Points" /></span>
            </div>
            <div class="w-[115%] h-1/2 flex items-center space-x-0.5">
                <div class="w-full h-full flex justify-center items-start pt-10 overflow-hidden -skew-x-[35deg]">
                    <p class="mr-12 text-shade/20 text-4xl font-semibold skew-x-[35deg] whitespace-nowrap" in:fly={$transition.nameFlyIn(true)} out:fly={$transition.nameFlyOut(false)} on:introend={() => versus = false}>{$game?.host ? $settings?.playerName : $game?.opponent}</p>
                </div>
                <div class="min-w-[1.5rem] max-w-[1.5rem] h-full flex justify-center items-center bg-shade/40 rounded-lg rotate-[35deg]" in:fade={{ duration: 1000 }} out:fade={{ duration: 1000, delay: 1500 }} on:outroend={() => start = true}>
                    <p class="text-7xl font-semibold rotate-[-35deg]">VS</p>
                    <p class="absolute text-7xl font-semibold rotate-[-35deg] drop-shadow-glow animate-pulse">VS</p>
                </div>
                <div class="w-full h-full flex justify-center items-end pb-10 overflow-hidden -skew-x-[35deg]">
                    <p class="ml-12 text-shade/20 text-4xl font-semibold skew-x-[35deg] whitespace-nowrap" in:fly={$transition.nameFlyIn(false)} out:fly={$transition.nameFlyOut(true)}>{!$game?.host ? $settings?.playerName : $game?.opponent}</p>
                </div>
            </div>
        </div>
    {/if}
    {#if start}
        <div class="w-full h-full flex flex-col relative">
            <div class="px-6 flex justify-between items-start">
                <div class="flex -mt-20">
                    {#each Array(7) as _, i}
                        {#if !oSendState[i]}
                            <img class={`${i != 0 ? "-ml-10" : ""} enemy-card ${opponentHover == 6 - i ? "translate-y-5" : ""}`} src="./cards/back.png" alt="Enemy Card" style={`z-index: ${i};`} in:fly|global={{ duration: 800, y: -100, delay: 600 - i * 100, easing: backOut }} out:receive={{ key: "oCard" }} />
                        {/if}
                    {/each}
                </div>
                <div class="mt-6 flex space-x-6" in:fly={{ duration: 800, x: 300 }}>
                    <span class="flex text-shade/50">0<img class="w-6 mx-0.5" src="./point.png" alt="Cosmo Points" title="Cosmo Points" />points</span>
                <span>{$game?.opponent}</span>
            </div>
        </div>
        <div class="h-full flex justify-center items-center space-x-28">
            <div class="sides flex justify-center items-center" in:fade={{ delay: 300, duration: 800 }}>
                <span class="text-6xl font-semibold">15</span>
            </div>
            <div class="flex space-x-6" in:fade={{ duration: 800 }}>
                    <div class="w-32 bg-secondary rounded-lg aspect-card">
                        {#each Array(7) as _, i}
                            {#if oSendState[i]}
                                <img src="./cards/back.png" alt="Enemy Card" in:send={{ key: "oCard" }} />
                            {/if}
                        {/each}
                    </div>
                    <div class="w-32 bg-secondary rounded-lg aspect-card">
                        {#each cards as card, i}
                            {#if pSendState[i]}
                                <button class="player-card" disabled in:send={{ key: "pCard" }}>
                                    <img src={`./cards/${card.id}.png`} alt={card.id.charAt(0).toUpperCase() + card.id.slice(1).replace(/(?<=\w)(?=\d)/g, " ")} />
                                </button>
                            {/if}
                        {/each}
                    </div>
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
                <div class="mb-6 flex space-x-6" in:fly={{ duration: 800, x: -300 }}>
                    <span>{$settings?.playerName}</span>
                    <span class="flex text-shade/50">0<img class="w-6 mx-0.5" src="./point.png" alt="Cosmo Points" title="Cosmo Points" />points</span>
                </div>
                <div class="flex -mb-20">
                    {#each cards as card, i}
                        {#if !pSendState[i]}
                            <button class={`${i != 0 ? "-ml-10 " : ""} player-card hover:-translate-y-5`} style={`z-index: ${i};`} in:fly|global={{ duration: 800, y: 150, delay: i * 100, easing: backOut }} out:receive={{ key: "pCard" }} on:click={() => { pSendState[i] = true; $app?.sendMessage(`SELECT ${i}`) }} on:pointerenter={() => $app?.sendMessage(`HOVER ${i}`)} on:pointerleave={checkHoverState}>
                                <img bind:this={cardsElmts[i]} src={`./cards/${card.id}.png`} alt={card.id.charAt(0).toUpperCase() + card.id.slice(1).replace(/(?<=\w)(?=\d)/g, " ")} />
                            </button>
                        {/if}
                    {/each}
                </div>
            </div>
        </div>
    {/if}
</div>

<style lang="postcss">
    .sides {
        @apply w-36 h-36;
    }

    .player-card {
        @apply w-32 bg-secondary rounded-lg transition-transform aspect-card;
    }

    .enemy-card {
        @apply w-24 bg-secondary rounded-md transition-transform aspect-card;
    }
</style>