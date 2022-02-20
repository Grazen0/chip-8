<script lang="ts">
	import type { RomInfo, Runnable } from '$lib/types';
	import { debug, halted, rom, speed } from '$lib/stores';

	export let reset: Runnable;
	export let pause: Runnable;
	export let resume: Runnable;
	export let roms: RomInfo[];
</script>

<div class="flex items-center justify-between">
	<div>
		<label for="rom">ROM: </label>
		<select name="rom" bind:value={$rom} class="bg-black border border-primary p-1">
			<option value disabled>Select a ROM...</option>
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
		<input
			type="checkbox"
			name="debug"
			bind:checked={$debug}
			class="relative cursor-pointer m-0 bg-black appearance-none text-primary w-5 h-5 border border-primary translate-y-1 before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[0.65rem] before:h-[0.65rem] before:bg-primary before:hidden checked:before:inline"
		/>
		<label for="debug">Debug</label>

		<button class="ml-0" on:click={$halted ? resume : pause}>
			{$halted ? 'Resume' : 'Pause'}
		</button>
		<button on:click={reset}>Reset</button>
	</div>
</div>
