<script lang="ts">
	import { BASE_PATH, HOST } from '../constants';
	export let title = 'CHIP-8 Emulator';
	export let description = 'A CHIP-8 emulator written in TypeScript';
	export let topic: string | undefined = undefined;

	const fullTitle = topic ? `${topic} · ${title}` : title;
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />

	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={`${HOST}${BASE_PATH}/og_image.png`} />
	<meta property="og:image:alt" content="CHIP-8 logo" />
	<meta property="og:url" content={HOST + BASE_PATH} />
</svelte:head>
