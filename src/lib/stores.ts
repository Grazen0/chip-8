import { writable } from 'svelte/store';

export const errorMessage = writable<string | null>(null);
