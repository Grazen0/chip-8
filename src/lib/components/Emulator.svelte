<script lang="ts">
	import { onMount } from 'svelte';
	import type { RomInfo } from '$lib/types';
	import { Emulator } from '$lib/emulator';
	import { errorMessage } from '$lib/stores';
	import Loading from './Loading.svelte';
	import { StorageKey } from '$lib/constants';

	export let roms: RomInfo[];

	let canvas: HTMLCanvasElement;
	let emulator: Emulator | null = null;
	let program: Uint8Array | null = null;
	let loading = false;
	let rom = roms[0].file;
	let mounted = false;
	let speed = 10;

	onMount(() => {
		mounted = true;
		emulator = new Emulator(canvas);

		const savedRom = localStorage.getItem(StorageKey.ROM);
		if (savedRom) rom = savedRom;

		const savedSpeed = parseInt(localStorage.getItem(StorageKey.SPEED) || '');
		if (!isNaN(savedSpeed)) speed = savedSpeed;

		return () => {
			mounted = false;
			emulator?.stop();
		};
	});

	function reset() {
		program = program;
	}

	$: {
		if (mounted) localStorage.setItem(StorageKey.SPEED, speed.toString());
		emulator?.setSpeed(speed);
	}

	$: if (program) {
		errorMessage.set(null);

		emulator?.stop();
		emulator?.run(program);
	}

	$: if (mounted) {
		localStorage.setItem(StorageKey.ROM, rom);

		loading = true;
		errorMessage.set(null);

		fetch(`/roms/${rom}`)
			.then(res => res.arrayBuffer())
			.then(buffer => (program = new Uint8Array(buffer)))
			.catch(console.error)
			.finally(() => (loading = false));
	}
</script>

<span>
	<div class="flex items-center">
		<div>
			<span>
				<label for="rom">ROM: </label>
				<select
					name="rom"
					bind:value={rom}
					class="rounded bg-black border border-primary p-1"
				>
					{#each roms as rom}
						<option value={rom.file}>{rom.label}</option>
					{/each}
				</select>
			</span>

			<span class="mx-4">
				<label for="speed">Speed: </label>
				<input type="range" name="speed" min="1" max="20" bind:value={speed} />
			</span>
		</div>

		<button class="rounded border border-primary p-1 ml-auto" on:click={reset}>Reset</button>
	</div>

	<canvas
		bind:this={canvas}
		class="border-primary border my-4 p-1 rounded w-[768px] h-[374px]"
		style="image-rendering: crisp-edges;"
		width="64"
		height="32"
	>
		Your browser doesn't support canvas :(
	</canvas>

	{#if loading}
		<p class="text-center"><Loading /></p>
	{:else if $errorMessage}
		<p class="text-center text-danger font-semibold">{$errorMessage}</p>
	{/if}
</span>
