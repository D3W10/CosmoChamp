<script lang="ts">
    import { spring } from "svelte/motion";
    import Icon from "./Icon.svelte";

    export let className  = "";
    export let type: "text" | "number" | "wheel" | "ip";
    export let value: any = null;
    export let placeholder = "";
    export let maxlength: number | undefined = undefined;
    export let min = 0;
    export let max = 10;
    export let step = 1;
    
    let error = false, inputElm: HTMLInputElement;
    const displayed = spring();

    $: {
        if (type == "wheel" && value === null)
            value = min;
    }
    
    $: displayed.set(value / step);
    $: offset = ((n: number, m: number) => ((n % m) + m) % m)($displayed, 1);

    $: {
        if (value !== null && value !== "") {
            if ((type == "text" || type == "number") && inputElm != undefined)
                error = !inputElm.checkValidity();
            else if (type == "ip")
                error = !/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/g.test(value);
        }
        else
            error = false;
    }
</script>

    <div class={`bg-tertiary rounded-md transition-all duration-200 focus-visible:outline focus-within:ring-2 focus-within:ring-inset ${!error ? "focus-within:ring-primary" : "ring-2 ring-inset ring-red-600 focus-within:ring-red-600"} ${className}`}>
    {#if type == "text"}
        <input type="text" placeholder={placeholder} {maxlength} bind:value bind:this={inputElm} on:input />
    {:else if type == "number"}
        <input type="number" placeholder={placeholder} {min} {max} {step} bind:value bind:this={inputElm} on:input />
    {:else if type == "ip"}
        <input type="text" placeholder={placeholder} maxlength={15} bind:value bind:this={inputElm} on:input />
    {:else if type == "wheel"}
        <div class="flex">
            <div class="w-full h-8 relative overflow-hidden">
                <div class="w-full h-full absolute" style="transform: translate(0, {100 * offset}%)">
                    <p class="w-full h-full px-2 py-1.5 absolute text-sm -top-full">{Math.floor($displayed + 1) * step}</p>
                    <p class="w-full h-full px-2 py-1.5 absolute text-sm">{Math.floor($displayed) * step}</p>
                </div>
            </div>
            <div class="h-8 px-1.5 flex flex-col justify-center">
                    <button class="rounded-sm overflow-hidden" on:click={() => value = Math.min(Math.max(value + step, min), max)}>
                    <Icon name="chevron" className="h-4 -mb-1 fill-current -rotate-180" />
                </button>
                    <button class="rounded-sm overflow-hidden" on:click={() => value = Math.min(Math.max(value - step, min), max)}>
                    <Icon name="chevron" className="h-4 -mt-1 fill-current" />
                </button>
            </div>
        </div>
    {/if}
</div>