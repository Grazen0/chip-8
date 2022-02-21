<script lang="ts">
	import { onMount } from 'svelte';
	import type { RomInfo } from '$lib/types';
	import { Emulator } from '$lib/emulator';
	import { debug, errorMessage, halted, rom, speed } from '$lib/stores';
	import { ROM_CUSTOM, StorageKey } from '$lib/constants';
	import Loading from './Loading.svelte';
	import OptionsBar from './OptionsBar.svelte';
	import DebugButton from './DebugButton.svelte';
	import QuirksSelector from './QuirksSelector.svelte';
	import { assets, base } from '$app/paths';

	export let roms: RomInfo[];

	let canvas: HTMLCanvasElement;
	let emulator: Emulator;
	let program: Uint8Array | null = null;
	let loading = false;
	let mounted = false;

	onMount(() => {
		mounted = true;
		emulator = new Emulator(canvas);

		const savedRom = localStorage.getItem(StorageKey.ROM);
		if (savedRom && roms.some(r => r.file === savedRom)) {
			$rom = savedRom;
		}

		return () => {
			mounted = false;
			emulator.destroy();
		};
	});

	const reset = () => {
		emulator.reset();
		if (program) emulator.loadProgram(program);
	};
	const pause = () => emulator.halt();
	const resume = () => emulator.run();

	const timeStep = () => {
		emulator.timeStep();
		emulator.draw(false);
	};

	const step = () => {
		emulator.step();
		emulator.draw(false);
	};

	const handleUpload = (file: File) => {
		program = null;
		loading = true;

		file.arrayBuffer()
			.then(buffer => (program = new Uint8Array(buffer)))
			.catch(console.error)
			.finally(() => (loading = false));
	};

	$: if (mounted) {
		// On program change: Run program
		speed.update(s => s + 1);
		$errorMessage = null;

		emulator.halt();
		emulator.reset();

		if (program) {
			emulator.loadProgram(program);
			emulator.run();
		}
	}

	$: if (mounted && $rom) {
		// On ROM change: Load ROM
		program = null;

		if ($rom !== ROM_CUSTOM) {
			loading = true;
			fetch(`${assets}/roms/${$rom}`)
				.then(res => res.arrayBuffer())
				.then(buffer => (program = new Uint8Array(buffer)))
				.catch(console.error)
				.finally(() => (loading = false));
		}
	}
</script>

<div class="mt-12 max-w-full inline-block flex-col items-center flex-wrap">
	<OptionsBar {roms} {reset} {pause} {resume} {handleUpload} />
	<div class="inline-block relative">
		<canvas bind:this={canvas} class="border-primary border my-4" width="768" height="374">
			Your browser doesn't support canvas :(
		</canvas>

		{#if $debug && $halted}
			<div class="absolute top-full right-0">
				<DebugButton on:click={timeStep}>Time step</DebugButton>
				<DebugButton on:click={step}>Step</DebugButton>
			</div>
		{/if}
	</div>

	{#if loading}
		<p><Loading /></p>
	{:else}
		<p class="text-danger font-semibold" class:text-transparent={!$errorMessage}>
			{$errorMessage || 'No errors'}
		</p>
	{/if}

	<QuirksSelector />
</div>
