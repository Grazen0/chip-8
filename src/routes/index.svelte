<script lang="ts">
	import Emulator from '$lib/components/Emulator.svelte';

	const roms = [
		{ file: 'ibm_logo.ch8', label: 'IBM logo' },
		{ file: 'pong.ch8', label: 'Pong' },
		{ file: 'space_invaders.ch8', label: 'Space Invaders' },
		{ file: 'Blinky.ch8', label: 'Blinky' },
		{ file: 'snake.ch8', label: 'Snake' },
		{ file: 'tetris.ch8', label: 'Tetris' },
		{ file: 'lunar_lander.ch8', label: 'Lunar Lander' },
		{ file: 'bowling.ch8', label: 'Bowling' },
		{ file: 'opcode_test.ch8', label: 'Opcode test' },
		{ file: 'delay_timer_test.ch8', label: 'Delay timer test' },
		{ file: 'random_number_test.ch8', label: 'Random number test' },
	];
</script>

<main class="py-14 px-6">
	<h1 class="text-center text-3xl font-bold">CHIP-8 Emulator</h1>
	<p class="text-center">By ElCholoGamer</p>

	<div class="my-12 flex flex-col items-center">
		<Emulator {roms} />
	</div>
</main>
