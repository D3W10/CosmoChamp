<script lang="ts">
    import { tweened } from "svelte/motion";
	import { cubicOut } from "svelte/easing";

    export let value = 0;

	const progress = tweened(0, {
		duration: 400,
		easing: cubicOut
	});

    $: progress.set(value);
</script>

<div class="w-full h-1 bg-shade/5 rounded-full overflow-hidden">
    <div class="h-full bg-primary rounded-full" style="width: {$progress}%;"></div>
</div>