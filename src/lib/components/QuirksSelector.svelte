<script lang="ts">
	import { quirks } from '../stores';
</script>

<div class="text-left">
	<h3 class="text-xl my-2">Quirks:</h3>

	<div class="pl-4">
		<label>
			<input type="checkbox" bind:checked={$quirks.vyIntoVx} />
			8xy[6E]: Put VY into VX before shift
		</label>
		<br />
		<label>
			<input type="checkbox" bind:checked={$quirks.bxnn} />
			Bnnn: Use VX instead of V0
		</label>
		<br />
		<label>
			<input type="checkbox" bind:checked={$quirks.changeI} />
			FX[56]5: Change value of I
		</label>
	</div>
</div>
