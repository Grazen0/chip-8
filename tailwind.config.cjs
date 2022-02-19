const colors = require('tailwindcss/colors');

module.exports = {
	content: ['./src/**/*.{html,svelte}'],
	theme: {
		extend: {
			colors: {
				primary: '#b4e5af',
				danger: colors.red[500],
			},
		},
	},
	plugins: [],
};
