<script lang="ts">
    import { fly } from "svelte/transition";
    import { Howl } from "howler";
    import { page } from "$lib/stores/pageStore";
    import { game } from "$lib/stores/gameStore";
    import { transition } from "$lib/stores/transitionStore";
    import { sound } from "$lib/stores/soundStore";
    import Icon from "$lib/components/Icon.svelte";
    import Button from "$lib/components/Button.svelte";

    const tada = new Howl({ src: ["sounds/tada.mp3"], html5: true, volume: $sound.sfxVolume });
    const mystic = new Howl({ src: ["sounds/mystic.mp3"], html5: true, volume: $sound.sfxVolume });

    function returnHome() {
        page.set({ current: "home", back: true });

        setTimeout(() => game.set(null), 500);
    }

    function roundNumber(num: number) {
        return num.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
    }

    $: gameTime = $game ? ($game.stats.endTime.getTime() - $game.stats.startTime.getTime()) / 1000 : 0;
    $: gameWon = $game && $game?.stats.points >= $game?.opponent.points;
    $: timeString = gameTime > 60 ? `${roundNumber(Math.floor(gameTime / 60))}:${roundNumber(Math.floor(gameTime % 60))}` : `${Math.floor(gameTime)} seconds`;

    setTimeout(() => {
        if (gameWon)
            tada.play();
        else
            mystic.play();
    }, 500);
</script>

<div class="w-full h-full flex p-16" in:fly={$transition.pageIn} out:fly={$transition.pageOut}>
    <div class="w-1/2 h-full flex flex-col">
        <div class="mb-9 flex justify-between items-center">
            <h1 class="text-2xl font-semibold">{gameWon ? "Game won!" : "Game over"}</h1>
        </div>
        <div class="h-full flex flex-col justify-between">
            <div class="w-1/2 flex flex-col space-y-4">
                <div class="flex items-center space-x-2">
                    <img class="h-9" src="./point.png" alt="Cosmo Points" title="Cosmo points obtained" />
                    <p class="text-lg">{$game?.stats.points} points</p>
                </div>
                <div class="flex items-center space-x-2">
                    <div title="Amount of rounds played">
                        <Icon name="round" className="h-9" />
                    </div>
                    <p class="text-lg">{$game?.stats.roundCount} rounds</p>
                </div>
                <div class="flex items-center space-x-2">
                    <div title="Game duration">
                        <Icon name="stopwatch" className="h-9" />
                    </div>
                    <p class="text-lg">{timeString}</p>
                </div>
            </div>
            <div>
                <Button on:click={returnHome}>Return to the Main Menu</Button>
            </div>
        </div>
    </div>
    <div class="w-1/2 flex justify-center items-center">
        <Icon name={gameWon ? "crown" : "sad"} className="w-1/2" />
    </div>
</div>