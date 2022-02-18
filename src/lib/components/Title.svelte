<script lang="ts">
	export let title = 'CHIP-8 Emulator';
	export let topic: string | undefined = undefined;

	const fullTitle = topic ? `${topic} · ${title}` : title;
</script>

<svelte:head>
	<title>{fullTitle}</title>
</svelte:head>
