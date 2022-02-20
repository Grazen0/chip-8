import { writable, type StartStopNotifier } from 'svelte/store';
import { ROM_CUSTOM, StorageKey } from './constants';
import type { Quirks, ToString } from './types';

function storable<T extends ToString>(storageKey: string, value?: T, start?: StartStopNotifier<T>) {
	const { subscribe, set, update } = writable(value, start);

	return {
		subscribe,
		set: (newValue: T) => {
			localStorage.setItem(storageKey, newValue.toString());
			set(newValue);
		},
		update,
	};
}

export const errorMessage = writable<string | null>(null);

export const speed = storable(StorageKey.SPEED, 12);
export const rom = storable(StorageKey.ROM, ROM_CUSTOM);
export const debug = writable(false);

export const halted = writable(true);

export const quirks = writable<Quirks>({
	vyIntoVx: false,
	bxnn: false,
	changeI: false,
});
