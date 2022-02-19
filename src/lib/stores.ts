import { writable } from 'svelte/store';

export const errorMessage = writable<string | null>(null);

export const speed = writable(12);
export const rom = writable('');
export const debug = writable(false);
