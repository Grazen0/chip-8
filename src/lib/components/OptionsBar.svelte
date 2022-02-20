<script lang="ts">
	import type { FileChangeEvent, RomInfo, Runnable } from '$lib/types';
	import { debug, halted, rom, speed } from '$lib/stores';
	import { ROM_CUSTOM } from '$lib/constants';
	import FileInput from './FileInput.svelte';

	export let handleUpload: (file: File) => void;
	export let reset: Runnable;
	export let pause: Runnable;
	export let resume: Runnable;
	export let roms: RomInfo[];

	const handleFileChange = (e: CustomEvent<FileChangeEvent>) => handleUpload(e.detail.file);
</script>

<div class="flex items-center justify-between">
	<div class="relative">
		{#if $rom === ROM_CUSTOM}
			<div class="absolute bottom-[120%] left-0">
				<FileInput accept=".ch8" on:change={handleFileChange} />
			</div>
		{/if}

		<label for="rom">ROM: </label>
		<select
			name="rom"
			bind:value={$rom}
			class="cursor-pointer bg-black border border-primary p-1"
		>
			<option value={ROM_CUSTOM}>[Custom]</option>
			{#each roms as rom}
				<option value={rom.file}>{rom.label}</option>
			{/each}
		</select>

		<span class="mx-2">
			<label for="speed">Steps/tick: </label>
			<input
				type="range"
				name="speed"
				min="1"
				max="100"
				bind:value={$speed}
				class="translate-y-[0.45rem] w-32"
			/>
			{$speed}
		</span>
	</div>

	<div>
		<input type="checkbox" name="debug" bind:checked={$debug} />
		<label for="debug">Debug</label>

		<button class="ml-0" on:click={$halted ? resume : pause}>
			{$halted ? 'Resume' : 'Pause'}
		</button>
		<button on:click={reset}>Reset</button>
	</div>
</div>
