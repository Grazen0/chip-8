<script lang="ts">
	import ControlsDiagram from '$lib/components/ControlsDiagram.svelte';
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
		{ file: 'misc_test.ch8', label: 'Misc. test' },
	];

	const links = [
		{ href: '/', label: 'Home' },
		{ href: 'https://en.wikipedia.org/wiki/CHIP-8', label: 'CHIP-8 at Wikipedia' },
		{ href: 'https://github.com/ElCholoGamer/chip-8', label: 'Source' },
	];
</script>

<main class="py-14 px-6 text-center">
	<h1 class="text-3xl font-bold">CHIP-8 Emulator</h1>
	<p>By ElCholoGamer</p>

	<Emulator {roms} />

	<section>
		<h2>About</h2>
		<p>
			CHIP-8 is an interpreted programming language, developed by Joseph Weisbecker. It was
			originally implemented for the COSMAC VIP in the mid-1970s, and was made to allow
			videogames to be more easily programmed.
		</p>
	</section>

	<section>
		<h2>Controls</h2>
		<p>
			This emulator maps the keys in the original COSMAC VIP keypad to the modern QWERTY
			keyboard.
		</p>
		<ControlsDiagram />
	</section>

	<section class="mb-2">
		<h2>Links</h2>
		<ul class="flex justify-center">
			{#each links as { href, label }, i}
				<li class="px-4 border-primary" class:border-l-2={i !== 0}>
					<a {href}>{label}</a>
				</li>
			{/each}
		</ul>
	</section>
</main>
