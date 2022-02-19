import type { Unsubscriber } from 'svelte/store';
import type { EmulatorOptions } from '$lib/types';
import { errorMessage, speed } from '$lib/stores';
import { DEFAULT_ERROR_MESSAGE } from '$lib/constants';
import { CPU } from './cpu';

export class Emulator {
	private readonly unsubscribe: Unsubscriber;
	private speed = 0;
	private tickCount = 0;
	private tickFrame = -1;
	private drawFrame = -1;
	private cpu: CPU;

	public constructor(private readonly canvas: HTMLCanvasElement) {
		this.cpu = new CPU({ oldBehavior: false });
		this.unsubscribe = speed.subscribe(s => (this.speed = s));
	}

	public run(program: Uint8Array) {
		this.cpu.loadProgram(program);
		this.tickCount = 0;

		this.tick();
		this.draw();
	}

	public stop() {
		this.cancelFrames();
		this.cpu.reset();

		const ctx = this.getCanvasContext();
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	}

	public destroy() {
		this.unsubscribe();
		this.cpu.destroy();
	}

	private tick() {
		this.cpu.timeStep();

		const end = this.tickCount + this.speed;

		for (; this.tickCount < end; this.tickCount++) {
			try {
				this.cpu.step();
			} catch (err) {
				errorMessage.set(err instanceof Error ? err.message : DEFAULT_ERROR_MESSAGE);
				console.error(err);

				this.stop();
			}
		}

		this.tickFrame = requestAnimationFrame(() => this.tick());
	}

	private draw() {
		this.drawFrame = requestAnimationFrame(() => this.draw());

		if (!this.cpu.render) return;

		const ctx = this.getCanvasContext();
		const { display } = this.cpu;

		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		ctx.fillStyle = '#b4e5af';

		for (let x = 0; x < display.width; x++) {
			for (let y = 0; y < display.height; y++) {
				if (display.get(x, y)) {
					ctx.fillRect(x, y, 1, 1);
				}
			}
		}

		this.cpu.render = false;
	}

	private cancelFrames() {
		cancelAnimationFrame(this.tickFrame);
		cancelAnimationFrame(this.drawFrame);
	}

	private getCanvasContext(): CanvasRenderingContext2D {
		const ctx = this.canvas.getContext('2d');
		if (!ctx) throw new Error('Canvas missing context 2d');

		return ctx;
	}
}
