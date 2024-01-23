<script lang="ts">
    export let className = "";
    export let disabled = false;
    export let secondary = false;
</script>

<button class={`px-4 py-1.5 flex justify-center items-center relative text-sm ${!secondary ? "text-white bg-primary" : "bg-tertiary"} disabled:opacity-50 disabled:bg-tertiary rounded-lg transition-colors overflow-hidden z-0 before:block disabled:before:hidden before:left-1/2 before:right-1/2 before:aspect-square before:absolute ${!secondary ? "before:bg-black/20" : "before:bg-shade/5"} before:rounded-full before:transition-all before:duration-[400ms] before:ease-leap-out before:-z-10 hover:before:-left-3 hover:before:-right-3 ${className}`} {disabled} on:click>
    <slot />
</button>