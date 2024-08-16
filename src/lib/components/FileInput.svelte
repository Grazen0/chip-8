<script lang="ts">
	import type { FileChangeEvent } from '$lib/types';

	import { createEventDispatcher } from 'svelte';

	export let accept = '';
	export let name = '';

	let input: HTMLInputElement;
	let currentFile = '[No file selected]';

	const dispatch = createEventDispatcher<{ change: FileChangeEvent }>();

	const handleClick = () => input.click();

	const handleFileChange: svelte.JSX.FormEventHandler<HTMLInputElement> = e => {
		const file = e.currentTarget.files?.[0];
		if (!file) return;

		currentFile = file.name;
		dispatch('change', { file });
	};
</script>

<span class="flex-nowrap" style="display:flex">
	<button class="py-0 px-2" on:click={handleClick}>Upload</button>
	{currentFile}
</span>
<input type="file" {accept} {name} class="hidden" bind:this={input} on:change={handleFileChange} />
