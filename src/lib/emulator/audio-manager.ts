import { BEEP_FREQUENCY } from '$lib/constants';

export class AudioManager {
	private readonly context = new AudioContext();
	private readonly gain = this.context.createGain();
	private oscillator: OscillatorNode | null = null;

	public constructor() {
		this.gain.connect(this.context.destination);
	}

	public play() {
		if (this.oscillator) return;

		this.oscillator = this.context.createOscillator();
		this.oscillator.frequency.value = BEEP_FREQUENCY;
		this.oscillator.type = 'square';
		this.oscillator.connect(this.gain);
		this.oscillator.start(0);
	}

	public stop() {
		if (!this.oscillator) return;

		this.oscillator.stop(0);
		this.oscillator.disconnect(0);
		this.oscillator = null;
	}
}
