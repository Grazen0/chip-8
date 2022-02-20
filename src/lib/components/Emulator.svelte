<script lang="ts">
	import { onMount } from 'svelte';
	import type { RomInfo } from '$lib/types';
	import { Emulator } from '$lib/emulator';
	import { errorMessage, rom, speed } from '$lib/stores';
	import Loading from './Loading.svelte';
	import { StorageKey } from '$lib/constants';
	import OptionsBar from './OptionsBar.svelte';

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

		const savedSpeed = Number(localStorage.getItem(StorageKey.SPEED));
		if (!isNaN(savedSpeed)) $speed = savedSpeed;

		return () => {
			mounted = false;
			emulator.destroy();
		};
	});

	function reset() {
		console.log('reset');
		emulator.reset();
		if (program) emulator.loadProgram(program);
	}

	const pause = () => emulator.stop();
	const resume = () => emulator.run();

	$: if (mounted) {
		console.log('set speed');
		localStorage.setItem(StorageKey.SPEED, $speed.toString());
	}

	$: if (mounted) {
		console.log('run program');
		$errorMessage = null;

		emulator.stop();
		emulator.reset();

		if (program) {
			emulator.loadProgram(program);
			emulator.run();
		}
	}

	$: if (mounted) {
		console.log('stop & save rom');
		program = null;

		if (!$rom) {
			localStorage.removeItem(StorageKey.ROM);
		} else {
			localStorage.setItem(StorageKey.ROM, $rom);
		}
	}

	$: if (mounted && $rom) {
		console.log('load rom: ', $rom);
		loading = true;

		fetch(`/roms/${$rom}`)
			.then(res => res.arrayBuffer())
			.then(buffer => (program = new Uint8Array(buffer)))
			.catch(console.error)
			.finally(() => (loading = false));
	}
</script>

<div class="mt-12 max-w-full inline-block flex-col items-center flex-wrap">
	<OptionsBar {roms} {reset} {pause} {resume} />
	<canvas bind:this={canvas} class="border-primary border my-4" width="768" height="374">
		Your browser doesn't support canvas :(
	</canvas>

	{#if loading}
		<p><Loading /></p>
	{:else}
		<p class="text-danger font-semibold" class:text-transparent={!$errorMessage}>
			{$errorMessage || 'No errors'}
		</p>
	{/if}
</div>
