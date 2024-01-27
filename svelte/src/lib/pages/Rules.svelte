<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import { app } from "$lib/stores/appStore";
    import { info } from "$lib/stores/infoStore";
    import { page } from "$lib/stores/pageStore";
    import { game } from "$lib/stores/gameStore";
    import { transition } from "$lib/stores/transitionStore";
    import { settings } from "$lib/stores/settingsStore";
    import Icon from "$lib/components/Icon.svelte";
    import ProgressBar from "$lib/components/ProgressBar.svelte";
    import Button from "$lib/components/Button.svelte";
    import ComboBox from "$lib/components/ComboBox.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import { gameModes } from "$lib/models/GameModes.object";

    let gameAnnounced = $game?.host, playerAnnounced = false, didReady = false, opponentReady = false;
    let currentPage = 0, currentPageIdx = 0, selectedGameMode = $game ? $game?.mode : 0;
    let showErrorModal = false, modalData: [string, string, string?, string?] = ["", ""];

    $app?.updateReceiveCallback(receiveMessage);

    (async () => {
        if ($game?.host) {
            let status = await $app?.createServer($game.ip, $game.port);

            if (status == "EADDRINUSE") {
                modalData = ["Unable to Connect", "Looks like the specified port is already in use. Please try again with another port."];
                showErrorModal = true;
            }
        }
        else {
            let status = await $app?.connectClient($game?.ip!, $game?.port!);

            if (status == "CONNECTED")
                $app?.sendMessage(`HEY ${$settings?.playerName}`);
            else if (status == "ECONNREFUSED") {
                modalData = ["Unable to Connect", "It appears there's no room hosted on the specified IP address and port. Please check those and try again."];
                showErrorModal = true;
            }
        }
    })();

    function onErrorSubmit() {
        page.set({ current: "home", back: true });

        setTimeout(() => game.set(null), 500);
    }

    function receiveMessage(message: string) {
        let args = message.split(" ");

        if (args[0] == "HEY" && $game?.host) {
            $app?.sendMessage(`HEY ${$info?.version} ${$game.mode} ${$game.goal} ${$settings?.playerName}`);

            game.update((g) => {
                if (g) g.opponent = args.slice(1, args.length).join(" ");

                return g;
            });
            playerAnnounced = true;
        }
        else if (args[0] == "HEY" && !$game?.host) {
            if (args[1] != $info?.version) {
                modalData = ["Incompatible Room", "The room you're trying to join is running a different version of the game. Please try again with a different room.", args[1], $info?.version];;
                showErrorModal = true;
                return;
            }

            game.update((g) => {
                if (g) {
                    g.mode = +args[2] as (0 | 1 | 2);
                    g.goal = +args[3];
                    g.opponent = args.slice(4, args.length).join(" ");
                }

                return g;
            });
            playerAnnounced = true;
            gameAnnounced = true;
        }
        else if (args[0] == "READY") {
            opponentReady = true;
            onReady();
        }
        else if (args[0] == "START")
            page.set({ current: "game", back: false });
    }

    function onReady() {
        if ($game?.host && didReady && opponentReady) {
            setTimeout(() => {
                $app?.sendMessage("START");
                page.set({ current: "game", back: false });
            }, 100);
        }
    }

    function nextPage() {
        page.set({ current: "rules", back: false });
        currentPage = gameModes[selectedGameMode].rules[++currentPageIdx];
    }

    function previousPage() {
        page.set({ current: "rules", back: true });
        currentPage = gameModes[selectedGameMode].rules[--currentPageIdx];
    }
</script>

<div class="w-full h-full flex flex-col" in:fly={$transition.pageIn} out:fly={$transition.pageOut}>
    <div class="h-full flex">
        <button class="w-1/5 flex justify-center items-center opacity-30 disabled:opacity-5 transition-opacity duration-200 hover:opacity-70 disabled:hover:opacity-5" disabled={currentPage == gameModes[selectedGameMode].rules[0]} on:click={previousPage}>
            <Icon name="chevron" className="w-1/2 fill-current rotate-90" />
        </button>
        <div class="w-full max-h-[452px] text-lg">
            {#if currentPage == 0}
                <div class="w-full h-full flex items-center space-x-14" in:fly={$transition.pageIn} out:fly={$transition.pageOut}>
                    <img src="./rules/graph.png" alt="Basic Element Graph" class="w-1/3" />
                    <div class="w-2/3 h-full flex flex-col justify-center space-y-8">
                        <p>The game consists of 3 basic elements that cancel each other out, those elements are fire, water and snow.</p>
                        <p>The fire melts the snow, the snow freezes the water and the water extinguishes the fire.</p>
                    </div>
                </div>
            {:else if currentPage == 1}
                <div class="w-full h-full flex items-center space-x-14" in:fly={$transition.pageIn} out:fly={$transition.pageOut}>
                    <img src="./rules/graphCard.png" alt="Card Graph" class="w-1/3" />
                    <div class="w-2/3 h-full flex flex-col justify-center space-y-8">
                        <p>Every element has 10 cards with different power levels, if both players use a card with the same element, the card with higher power wins.</p>
                        <p>If it happens that both you and your opponent end up with a card from the same element and equal power, it is considered a tie and neither player wins.</p>
                    </div>
                </div>
            {:else if currentPage == 2}
                <div class="w-full h-full flex items-center space-x-14" in:fly={$transition.pageIn} out:fly={$transition.pageOut}>
                    <div class="w-1/3 relative">
                        <img src="./rules/graphTime.png" alt="Time Graph" class="w-full" />
                        <p class="absolute bottom-10 right-10 text-6xl font-semibold">{selectedGameMode != 2 ? "15" : "5"}</p>
                    </div>
                    <div class="w-2/3 h-full flex flex-col justify-center space-y-8">
                        <p>When the time starts ticking down select 1 of your 7 cards, you will have {selectedGameMode != 2 ? "15" : "5"} seconds to do so.</p>
                        <p>After both players select a card, both will be revealed. The player who played the card that won will be awarded with a Cosmo Point <img class="w-6 h-6 -mt-0.5 inline-block" src="./point.png" alt="Cosmo Points" title="Cosmo Points" /></p>
                    </div>
                </div>
            {:else if currentPage == 3}
                <div class="w-full h-full flex items-center space-x-14" in:fly={$transition.pageIn} out:fly={$transition.pageOut}>
                    <div class="w-1/3 relative">
                        <img src="./rules/graphWin.png" alt="Win Graph" class="w-full" />
                        <p class="absolute top-[6.5rem] right-32 text-[4rem] font-semibold">{$game ? $game?.goal : "15"}</p>
                    </div>
                    <div class="w-2/3 h-full flex flex-col justify-center space-y-8">
                        <p>Keep on winning rounds and stack as many points as you can.</p>
                        <p>In order to win, you must get the amount of Cosmo Points <img class="w-6 h-6 -mt-0.5 inline-block" src="./point.png" alt="Cosmo Points" title="Cosmo Points" /> set on the goal.</p>
                    </div>
                </div>
            {:else if currentPage == 4}
                <div class="w-full h-full flex items-center space-x-14" in:fly={$transition.pageIn} out:fly={$transition.pageOut}>
                    <img src="./rules/graphSpecial.png" alt="Special Elements Graph" class="w-1/3" />
                    <div class="w-2/3 h-full flex flex-col justify-center space-y-8">
                        <p>During your game you will come across cards with special elements such as energy, wind, nature and space.</p>
                        <p>Every time a round ends you have a 20% chance of getting one of these cards and you can use them along with a basic element when the time starts ticking.</p>
                    </div>
                </div>
            {:else if currentPage == 5}
                <div class="w-full h-full flex items-center space-x-14" in:fly={$transition.pageIn} out:fly={$transition.pageOut}>
                    <img src="./rules/graphEnergy.png" alt="Energy Element Graph" class="w-1/3" />
                    <div class="w-2/3 h-full flex flex-col justify-center space-y-8">
                        <p>The energy element allows you to reduce the power level of the opponent card by 3 levels.</p>
                        <p>For example, if the opponent played a snow 7 it will become a snow 4.</p>
                    </div>
                </div>
            {:else if currentPage == 6}
                <div class="w-full h-full flex items-center space-x-14" in:fly={$transition.pageIn} out:fly={$transition.pageOut}>
                    <img src="./rules/graphWind.png" alt="Wind Element Graph" class="w-1/3" />
                    <div class="w-2/3 h-full flex flex-col justify-center space-y-8">
                        <p>The wind element reverses the normal element cycle presentend on one of the rules before.</p>
                        <p>For example, if the opponent played a fire card and you played an ice card, you win.</p>
                    </div>
                </div>
            {:else if currentPage == 7}
                <div class="w-full h-full flex items-center space-x-14" in:fly={$transition.pageIn} out:fly={$transition.pageOut}>
                    <img src="./rules/graphNature.png" alt="Nature Element Graph" class="w-1/3" />
                    <div class="w-2/3 h-full flex flex-col justify-center space-y-8">
                        <p>The nature element switched the opponent card with a card of the same element you played, keeping the power level intact.</p>
                        <p>For example, if you played a water card and the opponent played a fire card, the opponent card will be replaced with a water card.</p>
                    </div>
                </div>
            {:else if currentPage == 8}
                <div class="w-full h-full flex items-center space-x-14" in:fly={$transition.pageIn} out:fly={$transition.pageOut}>
                    <div class="w-1/3 relative">
                        <img src="./rules/graphSpace.png" alt="Space Element Graph" class="w-full" />
                        <p class="absolute bottom-8 left-7 text-2xl font-semibold">1</p>
                        <p class="absolute bottom-8 right-16 text-[2.75rem] font-semibold">3</p>
                    </div>
                    <div class="w-2/3 h-full flex flex-col justify-center space-y-8">
                        <p>The space element has the power to give you 3 Cosmo Points <img class="w-6 h-6 -mt-0.5 inline-block" src="./point.png" alt="Cosmo Points" title="Cosmo Points" /> if you manage to win the round, opposed to the traditional 1.</p>
                    </div>
                </div>
            {/if}
        </div>
        <button class="w-1/5 flex justify-center items-center opacity-30 disabled:opacity-5 transition-opacity duration-200 hover:opacity-70 disabled:hover:opacity-5" disabled={currentPage == gameModes[selectedGameMode].rules.slice(-1)[0]} on:click={nextPage}>
            <Icon name="chevron" className="w-1/2 fill-current -rotate-90" />
        </button>
    </div>
    <div class="h-1/5 flex bg-secondary rounded-t-2xl">
        {#if $game != null}
            <div class="w-1/4 p-6 space-y-1">
                {#if gameAnnounced}
                    <div in:fade={{ duration: 500 }}>
                        <p>{gameModes[selectedGameMode].name}</p>
                        <p class="flex items-center text-shade/50 text-sm">{$game?.goal} <img class="w-5 h-5 -mt-0.5 inline-block" src="./point.png" alt="Cosmo Points" title="Cosmo Points" /></p>
                    </div>
                {/if}
            </div>
            <div class="w-2/4 relative flex justify-center items-center">
                {#if !playerAnnounced}
                    <div class="w-full absolute flex flex-col justify-center items-center space-y-4" in:fade={{ duration: 500, delay: 500 }} out:fade={{ duration: 500 }}>
                        <span class="animate-pulse">{$game.host ? "Waiting for second player" : "Connecting to the host"}</span>
                        <ProgressBar indeterminate />
                    </div>
                {:else}
                    <div class="w-full absolute flex flex-col justify-center items-center" in:fade={{ duration: 500, delay: 500 }} out:fade={{ duration: 500 }}>
                        <Button className="w-36 text-base" disabled={didReady} on:click|once={() => { $app?.sendMessage("READY"); didReady = true; onReady(); }}>Ready</Button>
                    </div>
                {/if}
            </div>
            <div class="w-1/4 p-6 space-y-1 text-right">
                {#if playerAnnounced}
                    <div transition:fade={{ duration: 500 }}>
                        <p>{$game.opponent}</p>
                        <div class={`flex justify-end items-center transition-colors ${!opponentReady ? "text-shade/50" : "text-green-500"}`}>
                            <div class={`w-4 h-4 mr-2 rounded-full transition-colors ${!opponentReady ? "bg-shade/20" : "bg-green-500"}`} />
                            <p class="flex items-center text-sm">{!opponentReady ? "Not Ready" : "Ready"}</p>
                        </div>
                    </div>
                {/if}
            </div>
        {:else}
            <div class="w-1/4 p-6 flex flex-col justify-start space-y-1">
                <p>Game Mode</p>
                <ComboBox className="w-full" items={Object.keys(gameModes)} listReverse={true} bind:selected={selectedGameMode} on:change={() => { page.set({ current: "rules", back: true }); currentPage = 0; currentPageIdx = 0; }} />
            </div>
            <div class="w-2/4" />
            <div class="w-1/4 p-6 flex justify-end items-center">
                <button class="h-fit flex items-center text-primary" on:click={() => page.set({ current: "settings", back: true })}>
                    <Icon name="chevron" className="w-5 h-5 mr-1 fill-current rotate-90" />
                    Back
                </button>
            </div>
        {/if}
    </div>
</div>
<Modal bind:show={showErrorModal} bind:title={modalData[0]} canCancel={false} on:submit={onErrorSubmit}>
    <p>{modalData[1]}</p>
    {#if modalData[2] && modalData[3]}
        <div>
            <p>Host version: {modalData[2]}</p>
            <p class="mt-2">Your version: {modalData[3]}</p>
        </div>
    {/if}
</Modal>