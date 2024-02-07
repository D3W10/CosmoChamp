<script lang="ts">
    import { fly } from "svelte/transition";
    import { page } from "$lib/stores/pageStore";
    import { transition } from "$lib/stores/transitionStore";
    import { game } from "$lib/stores/gameStore";
    import Button from "$lib/components/Button.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import Input from "$lib/components/Input.svelte";
    import ComboBox from "$lib/components/ComboBox.svelte";
    import { gameModes } from "$lib/models/GameModes.object";

    let showCreateModal = false, showJoinModal = false;
    let ipValue: string, portValue: number, modeValue: number, goalValue: number = 15;
    let defaultGameOpts = { opponent: { name: "", points: 0 }, stats: { roundCount: 0, points: 0, startTime: new Date(), endTime: new Date() } };

    function onCreateRoom() {
        game.set({ host: true, ip: ipValue || "127.0.0.1", port: portValue || 1515, mode: modeValue as (0 | 1 | 2), goal: goalValue, ...defaultGameOpts });
        page.set({ current: "rules", back: false });
    }

    function onJoinRoom() {
        game.set({ host: false, ip: ipValue || "127.0.0.1", port: portValue || 1515, mode: modeValue as (0 | 1 | 2), goal: goalValue, ...defaultGameOpts });
        page.set({ current: "rules", back: false });
    }
</script>

<div class="w-full h-full" in:fly={$transition.pageIn} out:fly={$transition.pageOut}>
    <div class="w-full h-full flex flex-col justify-center items-center space-y-3">
        <h1 class="w-125 text-2xl font-semibold">Welcome Champ <Icon name="rocket" className="w-7 h-7 -mt-0.5 inline-block" /></h1>
        <div class="h-4/6 flex space-x-5">
            <Button type="invisible" className="w-60 flex flex-col justify-center items-center relative bg-secondary rounded-xl space-y-2 overflow-hidden z-0 before:w-0 before:h-0 before:block before:absolute before:bg-shade/5 before:rounded-full before:transition-all before:duration-[400ms] before:ease-cubic-out before:-z-10 hover:before:w-112 hover:before:h-112" on:click={() => (showCreateModal = true)}>
                <Icon name="create" className="w-12 h-12 drop-shadow-lg" />
                <p>Create room</p>
            </Button>
            <div class="flex flex-col w-60 space-y-5">
                <Button type="invisible" className="h-2/3 flex flex-col justify-center items-center relative bg-secondary rounded-xl space-y-2 overflow-hidden z-0 before:w-0 before:h-0 before:block before:absolute before:bg-shade/5 before:rounded-full before:transition-all before:duration-[400ms] before:ease-cubic-out before:-z-10 hover:before:w-96 hover:before:h-96" on:click={() => (showJoinModal = true)}>
                    <Icon name="join" className="w-12 h-12 drop-shadow-lg" />
                    <p>Join room</p>
                </Button>
                <Button type="invisible" className="h-1/3 flex flex-col justify-center items-center relative bg-secondary rounded-xl space-y-2 overflow-hidden z-0 before:w-0 before:h-0 before:block before:absolute before:bg-shade/5 before:rounded-full before:transition-all before:duration-[400ms] before:ease-cubic-out before:-z-10 hover:before:w-72 hover:before:h-72" on:click={() => page.set({ current: "settings", back: false })}>
                    <Icon name="settings" className="w-12 h-12 drop-shadow-lg" />
                    <p>Settings</p>
                </Button>
            </div>
        </div>
    </div>
</div>
<Modal bind:show={showCreateModal} title="Create Room" button="Create" cancelButton="Back" on:submit={onCreateRoom}>
    <div class="flex space-x-4">
        <div class="w-3/4 space-y-1">
            <span class="ml-0.5 text-sm">IP Address</span>
            <Input type="ip" placeholder="127.0.0.1" bind:value={ipValue} />
        </div>
        <div class="w-1/4 space-y-1">
            <span class="ml-0.5 text-sm">Port</span>
            <Input type="number" placeholder="1515" min={1} max={57322} bind:value={portValue} />
        </div>
    </div>
    <div class="flex space-x-4">
        <div class="w-1/2 space-y-1">
            <span class="ml-0.5 text-sm">Game Mode</span>
            <ComboBox className="w-full" items={gameModes.map((e) => e.name)} listClassName="h-[3.75rem]" bind:selected={modeValue} />
        </div>
        <div class="w-1/2 space-y-1">
            <span class="ml-0.5 text-sm">Winning Goal <img class="w-5 h-5 -mt-0.5 inline-block" src="./point.png" alt="Cosmo Points" title="Cosmo Points" /></span>
            <Input type="wheel" min={5} max={50} step={5} bind:value={goalValue} />
        </div>
    </div>
</Modal>
<Modal bind:show={showJoinModal} title="Join Room" button="Join" cancelButton="Back" on:submit={onJoinRoom}>
    <div class="flex space-x-4">
        <div class="w-3/4 space-y-1">
            <span class="ml-0.5 text-sm">IP Address</span>
            <Input type="ip" placeholder="127.0.0.1" bind:value={ipValue} />
        </div>
        <div class="w-1/4 space-y-1">
            <span class="ml-0.5 text-sm">Port</span>
            <Input type="number" placeholder="1515" min={1} max={49150} bind:value={portValue} />
        </div>
    </div>
</Modal>