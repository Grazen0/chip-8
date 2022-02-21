import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),
	kit: {
		adapter: adapter(),
		paths:
			process.env.NODE_ENV === 'development'
				? undefined
				: {
						base: '/chip-8',
						assets: 'https://elchologamer.me/chip-8',
				  },
	},
};

export default config;
