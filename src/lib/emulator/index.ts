import type { Unsubscriber } from 'svelte/store';
import { debug, errorMessage, halted, speed } from '$lib/stores';
import { DEFAULT_ERROR_MESSAGE } from '$lib/constants';
import { CPU } from './cpu';
import { hex } from '$lib/utils';

export class Emulator {
	private readonly cpu = new CPU();
	private readonly unsubscribers: Unsubscriber[] = [];
	private speed = 0;
	private debug = false;
	private tickFrame = -1;
	private drawFrame = -1;

	public constructor(private readonly canvas: HTMLCanvasElement) {
		this.unsubscribers = [
			speed.subscribe(s => (this.speed = s)),
			debug.subscribe(d => this.handleDebugUpdate(d)),
		];
	}

	public loadProgram(program: Uint8Array) {
		this.cpu.loadProgram(program);
	}

	public run() {
		halted.set(false);
		this.tick();
		this.draw();
	}

	public reset() {
		this.cpu.reset();

		const ctx = this.getCanvasContext();
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	}

	public halt() {
		halted.set(true);
		cancelAnimationFrame(this.tickFrame);
		cancelAnimationFrame(this.drawFrame);
	}

	public destroy() {
		this.unsubscribers.forEach(cb => cb());
		this.cpu.destroy();
	}

	private tick() {
		this.tickFrame = requestAnimationFrame(() => this.tick());

		this.timeStep();

		for (let i = 0; i < this.speed; i++) {
			this.step();
		}
	}

	public step() {
		try {
			this.cpu.step();
		} catch (err) {
			errorMessage.set(err instanceof Error ? err.message : DEFAULT_ERROR_MESSAGE);
			console.error(err);
			this.halt();
		}
	}

	public timeStep() {
		this.cpu.timeStep();
	}

	public draw(loop = true) {
		if (loop) {
			this.drawFrame = requestAnimationFrame(() => this.draw(true));
		}

		const ctx = this.getCanvasContext();

		if (this.debug) {
			this.drawDisplay(ctx);

			const fontSize = 20;
			const margin = 10;

			const { pc, i, v, stack, delayTimer, soundTimer } = this.cpu;
			ctx.font = `bold ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;
			ctx.textAlign = 'left';
			ctx.textBaseline = 'top';
			ctx.fillStyle = 'red';

			ctx.fillText(`PC: ${hex(pc, 3)}`, margin, margin);
			ctx.fillText(`I:  ${hex(i, 3)}`, margin, margin + fontSize);
			ctx.fillText(`DT: ${delayTimer}`, margin, margin + fontSize * 2);
			ctx.fillText(`ST: ${soundTimer}`, margin, margin + fontSize * 3);
			ctx.fillText(
				`Opcode: ${hex(this.cpu.currentOpcode, 4)}`,
				margin,
				margin + fontSize * 4
			);
			ctx.fillText(
				`Stack: ${
					stack.size === 0 ? '<empty>' : stack.values.map(v => hex(v, 4)).join(' -> ')
				}`,
				margin,
				ctx.canvas.height - fontSize - margin
			);

			ctx.textAlign = 'right';
			for (let i = 0; i < v.length; i++) {
				ctx.fillText(
					`V${hex(i, 0, false)}: ${hex(v[i], 2)}`,
					ctx.canvas.width - margin,
					margin + i * fontSize
				);
			}
			this.cpu.render = false;
		} else if (this.cpu.render) {
			this.drawDisplay(ctx);
			this.cpu.render = false;
		}
	}

	private drawDisplay(ctx: CanvasRenderingContext2D) {
		const { display } = this.cpu;
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		const pixelWidth = this.canvas.width / display.width;
		const pixelHeight = this.canvas.height / display.height;

		ctx.fillStyle = '#b4e5af';
		ctx.imageSmoothingEnabled = false;

		for (let x = 0; x < display.width; x++) {
			for (let y = 0; y < display.height; y++) {
				if (display.get(x, y)) {
					ctx.fillRect(x * pixelWidth, y * pixelHeight, pixelWidth, pixelHeight);
				}
			}
		}
	}

	private getCanvasContext(): CanvasRenderingContext2D {
		const ctx = this.canvas.getContext('2d');
		if (!ctx) throw new Error('Canvas missing context 2d');

		return ctx;
	}

	private handleDebugUpdate(d: boolean) {
		this.debug = d;

		if (!this.debug) {
			this.cpu.render = true;
			this.draw();
		}
	}
}
