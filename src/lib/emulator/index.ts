import { errorMessage } from '$lib/stores';
import { CPU, type CPUOptions } from './cpu';
import { DEFAULT_ERROR_MESSAGE } from '$lib/constants';
import type { Timeout } from '$lib/types';

export class Emulator {
	public speed = 10;
	private tickTimer: Timeout | null = null;
	private tickCount = 0;
	private drawFrame = -1;
	private timerFrame = -1;
	private cpu: CPU;

	public constructor(
		private readonly canvas: HTMLCanvasElement,
		options: CPUOptions = {
			fontOffset: 0x50,
			oldBehavior: false,
			stackSize: 16,
		}
	) {
		this.cpu = new CPU(options);
	}

	public stop() {
		this.cleanup();
		this.cpu.reset();

		const ctx = this.getCanvasContext();
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	}

	public run(program: Uint8Array) {
		this.cpu.setupInput();
		this.cpu.loadProgram(program);

		this.tickCount = 0;

		this.tick();
		this.timeStep();
		this.draw();
	}

	private tick() {
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

		this.tickTimer = setTimeout(() => this.tick(), 0);
	}

	private timeStep() {
		// TODO - Frameskip
		this.timerFrame = requestAnimationFrame(() => this.timeStep());
		this.cpu.timeStep();
	}

	private draw() {
		this.drawFrame = requestAnimationFrame(() => this.draw());

		if (!this.cpu.render) return;

		const ctx = this.getCanvasContext();
		const { display } = this.cpu;

		const pixelWidth = 1;
		const pixelHeight = 1;

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

	public cleanup() {
		this.cpu.cleanup();

		if (this.tickTimer !== null) clearTimeout(this.tickTimer);
		cancelAnimationFrame(this.drawFrame);
		cancelAnimationFrame(this.timerFrame);
	}

	private getCanvasContext(): CanvasRenderingContext2D {
		const ctx = this.canvas.getContext('2d');
		if (!ctx) throw new Error('Canvas missing context 2d');

		return ctx;
	}

	public setSpeed(value: number) {
		this.speed = value;
	}
}
