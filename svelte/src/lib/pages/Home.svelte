<script lang="ts">
    import { fly } from "svelte/transition";
    import { page } from "$lib/stores/pageStore";
    import { transition } from "$lib/stores/transitionStore";
    import Icon from "../components/Icon.svelte";
    import Modal from "../components/Modal.svelte";
    import Input from "../components/Input.svelte";

    let showModal = false;
</script>

<div class="w-full h-full" in:fly={$transition.in} out:fly={$transition.out}>
    <div class="w-full h-full flex flex-col justify-center items-center space-y-3">
        <h1 class="w-125 text-2xl font-semibold">Welcome Champ 🚀</h1>
        <div class="h-4/6 flex space-x-5">
            <button class="w-60 flex flex-col justify-center items-center relative bg-secondary rounded-xl space-y-2 overflow-hidden z-0 before:w-0 before:h-0 before:block before:absolute before:bg-shade/10 before:rounded-full before:transition-all before:duration-500 before:ease-leap-out before:-z-10 hover:before:w-112 hover:before:h-112" on:click={() => showModal = true}>
                <Icon name="create" className="w-12 h-12 drop-shadow-lg" />
                <p>Create room</p>
            </button>
            <div class="flex flex-col w-60 space-y-5">
                <button class="h-2/3 flex flex-col justify-center items-center relative bg-secondary rounded-xl space-y-2 overflow-hidden z-0 before:w-0 before:h-0 before:block before:absolute before:bg-shade/10 before:rounded-full before:transition-all before:duration-500 before:ease-leap-out before:-z-10 hover:before:w-96 hover:before:h-96" on:click={() => page.set({ current: "rules", back: false })}>
                    <Icon name="join" className="w-12 h-12 drop-shadow-lg" />
                    <p>Join room</p>
                </button>
                <button class="h-1/3 flex flex-col justify-center items-center relative bg-secondary rounded-xl space-y-2 overflow-hidden z-0 before:w-0 before:h-0 before:block before:absolute before:bg-shade/10 before:rounded-full before:transition-all before:duration-500 before:ease-leap-out before:-z-10 hover:before:w-72 hover:before:h-72" on:click={() => page.set({ current: "settings", back: false })}>
                    <Icon name="settings" className="w-12 h-12 drop-shadow-lg" />
                    <p>Settings</p>
                </button>
            </div>
        </div>
    </div>
</div>
<Modal bind:show={showModal} title="Create Room" button="Create">
    <div class="flex space-x-4">
        <div class="w-3/4 space-y-1">
            <span class="ml-0.5 text-sm">IP Address</span>
            <Input type="text" placeholder="127.0.0.1" />
        </div>
        <div class="w-1/4 space-y-1">
            <span class="ml-0.5 text-sm">Port</span>
            <Input type="number" placeholder="1515" min={1} max={49150} />
        </div>
    </div>
</Modal>