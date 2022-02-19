<script lang="ts">
	import { onMount } from 'svelte';

	export let dot = '.';
	export let maxDots = 3;

	let dotCount = 1;

	onMount(() => {
		const timer = setInterval(() => {
			if (++dotCount > maxDots) {
				dotCount = 1;
			}
		}, 500);

		return () => clearInterval(timer);
	});

	$: dots = dot.repeat(dotCount);
	$: dotsLeft = dot.repeat(maxDots - dotCount);
</script>

Loading{dots}<span class="text-transparent">{dotsLeft}</span>
