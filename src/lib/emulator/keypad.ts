import { KEYS } from '$lib/constants';

export class Keypad {
	private readonly keys = Array(16).fill(false);

	public constructor() {
		document.addEventListener('keydown', this.handleKeyDown);
		document.addEventListener('keyup', this.handleKeyUp);
	}

	public destroy() {
		document.removeEventListener('keydown', this.handleKeyDown);
		document.removeEventListener('keyup', this.handleKeyUp);
	}

	private handleKeyDown = (e: KeyboardEvent) => {
		const key = KEYS.indexOf(e.key);
		if (key === -1) return;

		this.keys[key] = true;
	};

	private handleKeyUp = (e: KeyboardEvent) => {
		const key = KEYS.indexOf(e.key);
		if (key !== -1) this.keys[key] = false;
	};

	public isKeyPressed(key: number) {
		if (key >= this.keys.length) throw new Error(`Key out of bounds: ${key}`);

		return this.keys[key];
	}

	public anyKeyPressed(): number | null {
		const key = this.keys.indexOf(true);

		if (key !== -1) {
			this.keys.fill(false);
			return key;
		}

		return null;
	}
}
