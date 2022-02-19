<script lang="ts">
	import type { RomInfo, Runnable } from '$lib/types';
	import { debug, rom, speed } from '$lib/stores';

	export let reset: Runnable;
	export let roms: RomInfo[];
</script>

<div class="flex items-center justify-between">
	<div>
		<label for="rom">ROM: </label>
		<select name="rom" bind:value={$rom} class="bg-black border border-primary p-1">
			<option value="" disabled>Select a ROM...</option>
			{#each roms as rom}
				<option value={rom.file}>{rom.label}</option>
			{/each}
		</select>

		<span class="mx-4">
			<label for="speed">Steps/tick: </label>
			<input
				type="range"
				name="speed"
				min="1"
				max="40"
				bind:value={$speed}
				class="translate-y-[0.45rem]"
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

		<button class="border border-primary py-1 px-2 ml-4" on:click={reset}>Reset</button>
	</div>
</div>
