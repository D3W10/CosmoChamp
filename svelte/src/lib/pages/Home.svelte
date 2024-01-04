<script lang="ts">
    import { fly } from "svelte/transition";
    import { page } from "$lib/stores/pageStore";
    import { transition } from "$lib/stores/transitionStore";
    import Icon from "../components/Icon.svelte";
    import Modal from "../components/Modal.svelte";

    let showModal = false;
</script>

<div class="w-full h-full" in:fly={$transition.in} out:fly={$transition.out}>
    <div class="w-full h-full flex flex-col justify-center items-center">
        <h1 class="w-125 mb-3 text-xl font-semibold">Welcome Champ</h1>
        <div class="h-4/6 flex space-x-5">
            <button class="w-60 flex flex-col justify-center items-center relative bg-secondary rounded-xl space-y-2 overflow-hidden z-0 before:w-0 before:h-0 before:block before:absolute before:bg-overlay before:rounded-full before:transition-all before:duration-500 before:ease-leap-out before:-z-10 hover:before:w-112 hover:before:h-112" on:click={() => showModal = true}>
                <Icon name="create" className="w-12 h-12 drop-shadow-lg" />
                <p>Create room</p>
            </button>
            <div class="flex flex-col w-60 space-y-5">
                <button class="h-2/3 flex flex-col justify-center items-center relative bg-secondary rounded-xl space-y-2 overflow-hidden z-0 before:w-0 before:h-0 before:block before:absolute before:bg-overlay before:rounded-full before:transition-all before:duration-500 before:ease-leap-out before:-z-10 hover:before:w-96 hover:before:h-96">
                    <Icon name="join" className="w-12 h-12 drop-shadow-lg" />
                    <p>Join room</p>
                </button>
                <button class="h-1/3 flex flex-col justify-center items-center relative bg-secondary rounded-xl space-y-2 overflow-hidden z-0 before:w-0 before:h-0 before:block before:absolute before:bg-overlay before:rounded-full before:transition-all before:duration-500 before:ease-leap-out before:-z-10 hover:before:w-72 hover:before:h-72" on:click={() =>  page.set({ current: "settings", back: false })}>
                    <Icon name="settings" className="w-12 h-12 drop-shadow-lg" />
                    <p>Settings</p>
                </button>
            </div>
        </div>
    </div>
</div>
<Modal bind:showModal>
	<h2 slot="header">
		modal
		<small><em>adjective</em> mod·al \ˈmō-dəl\</small>
	</h2>

	<ol class="definition-list">
		<li>of or relating to modality in logic</li>
		<li>
			containing provisions as to the mode of procedure or the manner of taking effect —used of a
			contract or legacy
		</li>
		<li>of or relating to a musical mode</li>
		<li>of or relating to structure as opposed to substance</li>
		<li>
			of, relating to, or constituting a grammatical form or category characteristically indicating
			predication
		</li>
		<li>of or relating to a statistical mode</li>
	</ol>

	<a href="https://www.merriam-webster.com/dictionary/modal">merriam-webster.com</a>
</Modal>