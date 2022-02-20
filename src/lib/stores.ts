import { writable } from 'svelte/store';
import type { Quirks } from './types';

export const errorMessage = writable<string | null>(null);

export const speed = writable(12);
export const rom = writable('');
export const debug = writable(false);

export const halted = writable(true);

export const quirks = writable<Quirks>({
	vyIntoVx: false,
	bxnn: false,
	changeI: false,
});
