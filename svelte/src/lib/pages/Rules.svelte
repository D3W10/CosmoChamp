<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import { app } from "$lib/stores/appStore";
    import { page } from "$lib/stores/pageStore";
    import { game } from "$lib/stores/gameStore";
    import { transition } from "$lib/stores/transitionStore";
    import { settings } from "$lib/stores/settingsStore";
    import Icon from "$lib/components/Icon.svelte";
    import ProgressBar from "$lib/components/ProgressBar.svelte";
    import Button from "$lib/components/Button.svelte";
    import Modal from "$lib/components/Modal.svelte";

    let gameAnnounced = $game?.host, playerAnnounced = false, didReady = false, opponentReady = false;
    let showErrorModal = false, modalMessage: string;

    $app?.updateReceiveCallback(receiveMessage);

    (async () => {
        if ($game?.host) {
            let status = await $app?.createServer($game.ip, $game.port);

            if (status == "CONNECTED") {
                
            }
            else if (status == "EADDRINUSE") {
                modalMessage = "Looks like the specified port is already in use. Please try again with another port.";
                showErrorModal = true;
            }
        }
        else {
            let status = await $app?.connectClient($game?.ip!, $game?.port!);

            if (status == "CONNECTED") {
                $app?.sendMessage(`HEY ${$settings?.playerName}`);
            }
            else if (status == "ECONNREFUSED") {
                modalMessage = "It appears there's no room hosted on the specified IP address and port. Please check those and try again.";
                showErrorModal = true;
            }
        }
    })();

    function onErrorSubmit() {
        game.set(null);
        page.set({ current: "home", back: true });
    }

    function receiveMessage(message: string) {
        let args = message.split(" ");

        if (args[0] == "HEY" && $game?.host) {
            $app?.sendMessage(`HEY ${$game.mode} ${$game.goal} ${$settings?.playerName}`);

            game.update((g) => {
                if (g) g.opponent = args.slice(1, args.length).join(" ");

                return g;
            });
            playerAnnounced = true;
        }
        else if (args[0] == "HEY" && !$game?.host) {
            game.update((g) => {
                if (g) {
                    g.mode = args[1];
                    g.goal = +args[2];
                    g.opponent = args.slice(3, args.length).join(" ");
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
</script>

<div class="w-full h-full flex flex-col" in:fly={$transition.pageIn} out:fly={$transition.pageOut}>
    <div class="h-full flex">
        <button class="w-1/5 flex justify-center items-center opacity-30 disabled:opacity-5 transition-opacity hover:opacity-70 disabled:hover:opacity-5" disabled>
            <Icon name="chevron" className="w-1/2 fill-current rotate-90" />
        </button>
        <div class="w-full relative">
            <div class="w-full absolute">

            </div>
            <div class="w-full absolute">
                
            </div>
            <div class="w-full absolute">
                
            </div>
        </div>
        <button class="w-1/5 flex justify-center items-center opacity-30 disabled:opacity-5 transition-opacity hover:opacity-70 disabled:hover:opacity-5">
            <Icon name="chevron" className="w-1/2 fill-current -rotate-90" />
        </button>
    </div>
    {#if $game != null}
        <div class="h-1/5 flex bg-secondary rounded-t-2xl">
            <div class="w-1/4 p-6 space-y-1">
                {#if gameAnnounced}
                    <div in:fade={{ duration: 1000, easing: cubicOut }}>
                        <p>{$game?.mode}</p>
                        <p class="flex items-center text-shade/50 text-sm">{$game?.goal} <img class="w-5 h-5 ml-0.5 inline-block" src="./point.png" alt="Cosmo Points" title="Cosmo Points" /></p>
                    </div>
                {/if}
            </div>
            <div class="w-2/4 relative flex justify-center items-center">
                {#if !playerAnnounced}
                    <div class="w-full absolute flex flex-col justify-center items-center space-y-4" out:fade={{ duration: 1000, easing: cubicOut }}>
                        <span class="animate-pulse">{$game.host ? "Waiting for second player" : "Connecting to the host"}</span>
                        <ProgressBar indeterminate />
                    </div>
                {:else}
                    <div class="w-full absolute flex flex-col justify-center items-center" in:fade={{ duration: 1000, delay: 800, easing: cubicOut }}>
                        <Button className="w-36 text-base" disabled={didReady} on:click|once={() => { $app?.sendMessage("READY"); didReady = true; onReady(); }}>Ready</Button>
                    </div>
                {/if}
            </div>
            <div class="w-1/4 p-6 space-y-1 text-right">
                {#if playerAnnounced}
                    <div in:fade={{ duration: 1000, easing: cubicOut }}>
                        <p>{$game.opponent}</p>
                        <div class={`flex justify-end items-center ${!opponentReady ? "text-shade/50" : "text-green-500"}`}>
                            <div class={`w-4 h-4 mr-2 rounded-full ${!opponentReady ? "bg-shade/20" : "bg-green-500"}`} />
                            <p class="flex items-center text-sm">{!opponentReady ? "Not Ready" : "Ready"}</p>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>
<Modal bind:show={showErrorModal} title="Unable to Connect" canCancel={false} on:submit={onErrorSubmit}>
    <span>{modalMessage}</span>
</Modal>