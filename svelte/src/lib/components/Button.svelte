<script lang="ts">
    export let className = "";
    export let disabled = false;
    export let secondary = false;
</script>

<button class={"w-fit px-4 py-1.5 flex justify-center items-center relative text-sm " + (!secondary ? "text-white bg-primary" : "bg-tertiary") + " disabled:bg-tertiary rounded-lg overflow-hidden z-0 before:block before:left-1/2 before:right-1/2 before:aspect-square before:absolute " + (!secondary ? "before:bg-primary-dark" : "before:bg-shade/5") + " before:rounded-full before:transition-all before:duration-[400ms] before:ease-leap-out before:-z-10 hover:before:-left-3 hover:before:-right-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary " + className} {disabled} on:click>
    <slot />
</button>