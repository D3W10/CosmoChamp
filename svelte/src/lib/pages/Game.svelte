<script lang="ts">
    import { blur, crossfade, fade, fly, scale } from "svelte/transition";
    import { backOut, cubicIn } from "svelte/easing";
    import { Howl } from "howler";
    import { app } from "$lib/stores/appStore";
    import { page } from "$lib/stores/pageStore";
    import { game } from "$lib/stores/gameStore";
    import { settings } from "$lib/stores/settingsStore";
    import { transition, flip } from "$lib/stores/transitionStore";
    import { close } from "$lib/stores/closeStore";
    import { sound } from "$lib/stores/soundStore";
    import { drawCard, drawDeck, generateDeck } from "$lib/deck";
    import Modal from "$lib/components/Modal.svelte";
    import { gameModes } from "$lib/models/GameModes.object";
    import type { Card } from "$lib/models/Card.interface";

    let versus: boolean = false, show: boolean = false, start: boolean = false, tie: boolean = false, opponentHover: number = -1;
    let cards: Card[] = [], cardsElmts: HTMLImageElement[] = new Array(7), cardRegex: RegExp = /(?<=[a-zA-Z])(?=\d)/g;
    let pSendState: boolean[] = Array(7), oSendState: boolean[] = Array(7), showErrorModal: boolean = false;
    let elementAnim: string = "energy", elementAnimShow: boolean = false, cosmoP: boolean = false, cosmoO: boolean = false;
    let time: number = $game?.mode != 2 ? 15 : 5, timer: NodeJS.Timeout, runTimer: boolean = false;
    let deckEnabled: boolean = false, opponentShow: boolean = false, opponentCard: string, winner: WinChar = "U";

    const [send, receive] = crossfade({ duration: 500 });
    const wideSpace = new Howl({ src: ["sounds/wideSpace.mp3"], loop: true, html5: true, volume: $sound.bgVolume });
    const sparkle = new Howl({ src: ["sounds/sparkle.mp3"], html5: true, volume: $sound.sfxVolume });
    const wrong = new Howl({ src: ["sounds/wrong.mp3"], html5: true, volume: $sound.sfxVolume });
    const tieSfx = new Howl({ src: ["sounds/tie.mp3"], html5: true, volume: $sound.sfxVolume });

    type WinChar = "P" | "O" | "T" | "U";

    setTimeout(() => versus = true, 1000);

    $app?.updateReceiveCallback(receiveMessage);
    $app?.updateCloseCallback(() => {
        showErrorModal = true;
        runTimer = false;
        deckEnabled = false;

        if ($game)
            $game.stats.endTime = new Date();
    });
    $close.set(wideSpace);

    if ($game?.host) {
        generateDeck();
        cards = drawDeck();
        $app?.sendMessage(`DECK ${drawDeck().map((card) => card.id).join(";")}`);
    }

    function receiveMessage(message: string) {
        let args = message.split(" ");

        if (args[0] == "HOVER")
            opponentHover = +args[1];
        else if (args[0] == "DECK" && !$game?.host)
            cards = args[1].split(";").map((id) => { return { id: id }});
        else if (args[0] == "SELECT") {
            oSendState[6 - +args[1]] = true;
            sendReveal();
        }
        else if (args[0] == "REVEAL") {
            opponentCard = args[1];

            setTimeout(() => {
                opponentShow = true;

                if ($game?.host)
                    evaluateRound();
            }, 2000);
        }
        else if (args[0] == "RESULT")
            setTimeout(() => setWinner(args[1] as WinChar), 1500);
        else if (args[0] == "CARD") {
            cards[pSendState.findIndex((v) => v)] = { id: args[1] };
            pSendState = pSendState.fill(false);
            oSendState = oSendState.fill(false);
            opponentShow = false;
            winner = "U";
            setTimeout(startRound, 500);
        }
        else if (args[0] == "END") {
            if ($game)
                $game.stats.endTime = new Date();

            goToResult();
        }
    }

    function checkHoverState() {
        if (deckEnabled && !cardsElmts.some((card) => card && card.matches(":hover")))
            $app?.sendMessage("HOVER -1");
    }

    function countDown() {
        if (--time == 0) {
            if (!pSendState.includes(true) && cardsElmts[Math.floor(Math.random() * 7)])
                cardsElmts[Math.floor(Math.random() * 7)].parentElement?.click();

            runTimer = false;
            clearInterval(timer);
        }
    }

    function startRound() {
        if ($game && ($game.stats.points >= $game.goal || $game.opponent.points >= $game.goal)) {
            if ($game?.host) {
                receiveMessage("END");
                $app?.sendMessage("END");
            }
        }
        else {
            runTimer = true;
            deckEnabled = true;

            if ($game)
                $game.stats.roundCount++;
        }
    }

    function cardSelect(index: number) {
        deckEnabled = false;
        pSendState[index] = true;
        $app?.sendMessage(`SELECT ${index}`);
        $app?.sendMessage(`HOVER -1`);
        sendReveal();
    }

    function sendReveal() {
        if (pSendState.includes(true) && oSendState.includes(true)) {
            runTimer = false;

            $app?.sendMessage(`REVEAL ${cards[pSendState.indexOf(true)].id}`);
        }
    }

    function evaluateRound() {
        let pCard = cards[pSendState.findIndex((v) => v)].id.split(cardRegex)[0] as keyof typeof wins, pPower = +cards[pSendState.findIndex((v) => v)].id.split(cardRegex)[1];
        let oCard = opponentCard.split(cardRegex)[0] as keyof typeof wins, oPower = +opponentCard.split(cardRegex)[1];
        let wins = { fire: "snow", snow: "water", water: "fire" }, tempWinner: WinChar = "T" as keyof typeof conversor, conversor = { P: "O", O: "P", T: "T"};

        if (wins[pCard] == oCard)
            tempWinner = "P";
        else if (wins[oCard] == pCard)
            tempWinner = "O";
        else if (pPower > oPower)
            tempWinner = "P";
        else if (pPower < oPower)
            tempWinner = "O";

        $app?.sendMessage(`RESULT ${conversor[tempWinner]}`);
        setTimeout(() => setWinner(tempWinner), 1500);
    }

    function setWinner(winChar: WinChar) {
        winner = winChar;

        if (winChar == "P") {
            cosmoP = true;
            sparkle.play();

            setTimeout(() => {
                if ($game)
                    $game.stats.points++;

                cosmoP = false;
            }, 800);
        }
        else if (winChar == "O") {
            cosmoO = true;
            wrong.play();

            setTimeout(() => {
                if ($game)
                    $game.opponent.points++;

                cosmoO = false;
            }, 800);
        }
        else if (winChar == "T") {
            tie = true;
            tieSfx.play();
        }

        setTimeout(() => {
            if ($game?.host) {
                receiveMessage(`CARD ${drawCard().id}`);
                $app?.sendMessage(`CARD ${drawCard().id}`);
            }
        }, 2500);
    }

    function goToResult() {
        $close.close();

        page.set({ current: "result", back: false });
    }

    $: {
        if (runTimer) {
            time = $game?.mode != 2 ? 15 : 5;
            clearInterval(timer);
            timer = setInterval(countDown, 1000);
        }
        else
            clearInterval(timer);
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
                    <p class="mr-12 text-shade/20 text-4xl font-semibold skew-x-[35deg] whitespace-nowrap" in:fly={$transition.nameFlyIn(true)} out:fly={$transition.nameFlyOut(false)} on:introend={() => versus = false}>{$game?.host ? $settings.playerName : $game?.opponent.name}</p>
                </div>
                <div class="min-w-[1.5rem] max-w-[1.5rem] h-full flex justify-center items-center bg-shade/40 rounded-lg rotate-[35deg]" in:fade={{ duration: 1000 }} out:fade={{ duration: 1000, delay: 1500 }} on:outroend={() => show = true}>
                    <p class="text-7xl font-semibold rotate-[-35deg]">VS</p>
                    <p class="absolute text-7xl font-semibold rotate-[-35deg] drop-shadow-glow animate-pulse">VS</p>
                </div>
                <div class="w-full h-full flex justify-center items-end pb-10 overflow-hidden -skew-x-[35deg]">
                    <p class="ml-12 text-shade/20 text-4xl font-semibold skew-x-[35deg] whitespace-nowrap" in:fly={$transition.nameFlyIn(false)} out:fly={$transition.nameFlyOut(true)}>{!$game?.host ? $settings.playerName : $game?.opponent.name}</p>
                </div>
            </div>
        </div>
    {/if}
    {#if show}
        <div class="w-full h-full relative">
            {#if start}
                <div class="w-full h-full flex justify-center items-center absolute bg-black/50 z-20" in:fade={{ duration: 500 }} out:fade={{ duration: 500, easing: cubicIn }} on:introend={() => setTimeout(() => start = false, 1000)} on:outroend={() => { if ($game) $game.stats.startTime = new Date(); startRound(); wideSpace.play(); }}>
                    <span class="text-7xl font-semibold drop-shadow-glow" in:fly={{ duration: 500, x: -620 }} out:fly={{ duration: 500, x: 620, easing: cubicIn }}>START</span>
                </div>
            {/if}
            {#if elementAnimShow}
                <div class="w-full h-full flex justify-center items-center absolute z-10">
                    <div class="min-w-[115%] h-[175%] rotate-[-30deg] space-y-3.5 bg-black/30" in:fade={{ duration: 250 }} out:fade={{ duration: 250, delay: 250 }}>
                        {#each Array(13) as _, i}
                            <div class="h-16 bg-contain" style={`background-image: url(./elements/${elementAnim}.png); animation: ${i % 2 == 0 ? "slide-right" : "slide-left"} 2s linear;`} />
                        {/each}
                    </div>
                    <div class="w-full h-full flex justify-center items-center absolute bg-black/50" in:fade={{ duration: 250 }} out:fade={{ duration: 250, delay: 250 }} />
                    <img class="w-52 absolute drop-shadow-2xl" src={`./elements/${elementAnim}.png`} alt={elementAnim.charAt(0).toUpperCase() + elementAnim.slice(1)} in:scale={{ duration: 500, opacity: 1 }} out:scale={{ duration: 500, start: 2.5, easing: cubicIn }} on:introend={() => setTimeout(() => elementAnimShow = false, 1000)} />
                </div>
            {/if}
            {#if tie}
                <div class="w-full h-full flex justify-center items-center absolute bg-black/50 z-20" in:fade={{ duration: 500 }} out:fade={{ duration: 500, easing: cubicIn }} on:introend={() => setTimeout(() => tie = false, 1000)}>
                    <span class="text-7xl font-semibold drop-shadow-glow" in:fly={{ duration: 500, x: -620 }} out:fly={{ duration: 500, x: 620, easing: cubicIn }}>TIE</span>
                </div>
            {/if}
            <div class="w-full h-full absolute flex flex-col">
                <div class="px-6 flex justify-between items-start">
                    <div class="flex -mt-20">
                        {#each Array(7) as _, i}
                            <div class={`min-w-24 h-fit ${i != 0 ? "-ml-10 " : ""} flex`} style={`z-index: ${i};`}>
                                {#if !oSendState[i]}
                                    <img class={`opponent-card ${opponentHover == 6 - i ? "translate-y-5" : ""}`} src="./cards/back.png" alt="Opponent Card" in:fly|global={{ duration: 800, y: -100, delay: 600 - i * 100, easing: backOut }} out:receive|global={{ key: "oCard" }} />
                                {/if}
                            </div>
                        {/each}
                    </div>
                    <div class="mt-6 flex space-x-6" in:fly={{ duration: 800, x: 300 }} on:introend={() => setTimeout(() => start = true, 1000)}>
                        <div class="flex text-shade/50">
                            <div class="min-w-5 relative">
                                {#key $game?.opponent.points}
                                    <span class="absolute right-0" transition:blur={{ duration: 400 }}>{$game?.opponent.points}</span>
                                {/key}
                            </div>
                            <div class="relative">
                                <img class="w-6 h-6 -mt-0.5" src="./point.png" alt="Cosmo Points" title="Cosmo Points" />
                                {#if cosmoO}
                                    <img class="w-6 h-6 -mt-0.5 absolute top-0" src="./point.png" alt="Cosmo Points" style="animation: receive-opponent 0.8s cubic-bezier(0.32, 0, 0.67, 0);" />
                                {/if}
                            </div>
                        </div>
                        <span>{$game?.opponent.name}</span>
                    </div>
                </div>
                <div class="h-full flex justify-center items-center space-x-28">
                    <div class="sides flex justify-center items-center relative" in:fade={{ delay: 300, duration: 800 }}>
                        {#key time}
                            <span class={`absolute text-6xl ${time <= 3 ? "text-red-500" : ""} font-semibold ${!runTimer ? "opacity-50" : "opacity-100"} transition-opacity duration-200`} transition:blur={{ duration: 400 }}>{time}</span>
                        {/key}
                    </div>
                    <div class="flex space-x-6" in:fade={{ duration: 800 }}>
                        <div class={`w-32 flex bg-secondary rounded-lg transition duration-500 aspect-card ${winner[0] == "O" ? "drop-shadow-glow" : (winner[0] == "P" ? "opacity-50 scale-95" : "")}`}>
                            {#if !opponentShow}
                                <div out:flip={{ duration: 400 }}>
                                    {#each Array(7) as _, i}
                                        {#if oSendState[6 - i]}
                                            <img src="./cards/back.png" alt="Opponent Card" in:send={{ key: "oCard" }} />
                                        {/if}
                                    {/each}
                                </div>
                            {:else}
                                <img src={`./cards/${opponentCard}.png`} alt={opponentCard.charAt(0).toUpperCase() + opponentCard.slice(1).replace(cardRegex, " ")} in:flip={{ duration: 400 }} out:fade={{ duration: 400 }} />
                            {/if}
                        </div>
                        <div class={`w-32 flex bg-secondary rounded-lg transition duration-500 aspect-card ${winner[0] == "P" ? "drop-shadow-glow" : (winner[0] == "O" ? "opacity-50 scale-95" : "")}`}>
                            {#each cards as card, i}
                                {#if pSendState[i]}
                                    <button class="player-card" disabled in:send={{ key: "pCard" }} out:fade={{ duration: 400 }}>
                                        <img src={`./cards/${card.id}.png`} alt={card.id.charAt(0).toUpperCase() + card.id.slice(1).replace(cardRegex, " ")} />
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
                        <span>{$settings.playerName}</span>
                        <div class="flex text-shade/50">
                            <div class="min-w-5 relative">
                                {#key $game?.stats.points}
                                    <span class="absolute right-0" transition:blur={{ duration: 400 }}>{$game?.stats.points}</span>
                                {/key}
                            </div>
                            <div class="relative">
                                <img class="w-6 h-6 -mt-0.5" src="./point.png" alt="Cosmo Points" title="Cosmo Points" />
                                {#if cosmoP}
                                    <img class="w-6 h-6 -mt-0.5 absolute top-0" src="./point.png" alt="Cosmo Points" style="animation: receive-player 0.8s cubic-bezier(0.32, 0, 0.67, 0);" />
                                {/if}
                            </div>
                        </div>
                    </div>
                    <div class="flex -mb-20">
                        {#each cards as card, i}
                            <div class={`min-w-32 h-fit ${i != 0 ? "-ml-10 " : ""} flex`} style={`z-index: ${i};`}>
                                {#if !pSendState[i]}
                                    <button class={`player-card hover:-translate-y-5 disabled:hover:-translate-y-0`} disabled={!deckEnabled} in:fly|global={{ duration: 800, y: 150, delay: i * 100, easing: backOut }} out:receive|global={{ key: "pCard" }} on:click={() => cardSelect(i)} on:pointerenter={(e) => { if (!e.currentTarget.disabled) $app?.sendMessage(`HOVER ${i}`); }} on:pointerleave={checkHoverState}>
                                        <img bind:this={cardsElmts[i]} src={`./cards/${card.id}.png`} alt={card.id.charAt(0).toUpperCase() + card.id.slice(1).replace(cardRegex, " ")} />
                                    </button>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>
<Modal bind:show={showErrorModal} title="Opponent Disconnected" canCancel={false} on:submit={goToResult}>
    <p>Your opponent has disconnected from the game and will be considered to have given up. You will be sent to the game results page.</p>
</Modal>

<style lang="postcss">
    .sides {
        @apply w-36 h-36;
    }

    .player-card {
        @apply w-32 bg-secondary rounded-lg transition-transform aspect-card;
    }

    .opponent-card {
        @apply w-24 bg-secondary rounded-md transition-transform aspect-card;
    }

    @keyframes -global-slide-right {
        0% {
            background-position-x: 0px
        }

        100% {
            background-position-x: 128px
        }
    }

    @keyframes -global-slide-left {
        0% {
            background-position-x: 0px
        }

        100% {
            background-position-x: -128px
        }
    }

    @keyframes -global-receive-player {
        0% {
            opacity: 0;
            transform: translateY(-50px);
        }

        50% {
            opacity: 1;
        }

        100% {
            transform: translateY(0);
        }
    }

    @keyframes -global-receive-opponent {
        0% {
            opacity: 0;
            transform: translateY(50px);
        }

        50% {
            opacity: 1;
        }

        100% {
            transform: translateY(0);
        }
    }
</style>