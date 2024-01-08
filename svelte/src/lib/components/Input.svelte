<script lang="ts">
    export let className  = "";
    export let type: "text" | "number" | "ip";
    export let value: any = null;
    export let placeholder = "";
    export let maxlength: number | undefined = undefined;
    export let min = 0;
    export let max = 10;
    export let step = 1;
    
    let inputType: string = "", error = false;

    const inputTypeMapper = {
        text: ["text", "ip"],
        number: ["number"]
    }

    $: {
        for (const key in inputTypeMapper) {
            if (inputTypeMapper[key as keyof typeof inputTypeMapper].includes(type)) {
                inputType = key;
                break;
            }
        }
    }

    function saveAndCheck(e: Event & { currentTarget: EventTarget & HTMLInputElement; }) {
        if (e.currentTarget.checkValidity())
            value = e.currentTarget.value;

        error = !e.currentTarget.checkValidity();
    }
</script>

<div class={"bg-tertiary rounded-md transition-all duration-200 focus-visible:outline focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary " + (error ? "ring-2 ring-inset ring-red-600 focus-within:ring-red-600 " : "") + className}>
    <input type={inputType} placeholder={placeholder} {maxlength} {min} {max} {step} on:input={saveAndCheck} />
</div>