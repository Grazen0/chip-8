import type { Nibbles } from '$lib/types';
import { FONT, FONT_OFFSET, PROGRAM_OFFSET } from '$lib/constants';
import { Display } from './display';
import { Stack } from './stack';
import { Keypad } from './keypad';
import { hex } from '$lib/utils';

export interface CPUOptions {
	oldBehavior: boolean;
}

export class CPU {
	public readonly display = new Display(64, 32);
	public readonly stack = new Stack(16);
	public readonly v = new Uint8Array(16);
	public pc = PROGRAM_OFFSET;
	public i = 0;
	public delayTimer = 0;
	public soundTimer = 0;
	public render = true;

	private readonly keypad = new Keypad();
	private readonly memory = new Uint8Array(4096);

	public constructor(public readonly options: CPUOptions) {
		this.reset();
	}

	public timeStep() {
		if (this.delayTimer > 0) this.delayTimer--;
		if (this.soundTimer > 0) this.soundTimer--;
	}

	public loadProgram(program: Uint8Array) {
		for (let i = 0; i < program.length; i++) {
			this.memory[PROGRAM_OFFSET + i] = program[i];
		}
	}

	public destroy() {
		this.keypad.destroy();
	}

	public reset() {
		this.display.clear();
		this.stack.reset();
		this.memory.fill(0);
		this.v.fill(0);
		this.pc = PROGRAM_OFFSET;
		this.i = 0;
		this.delayTimer = 0;
		this.soundTimer = 0;
		this.render = true;

		for (let i = 0; i < FONT.length; i++) {
			this.memory[FONT_OFFSET + i] = FONT[i];
		}
	}

	public step() {
		const opcode = this.fetch();
		const nibbles = this.decode(opcode);
		this.execute(nibbles);
	}

	private fetch(): number {
		const opcode = (this.memory[this.pc] << 8) | this.memory[this.pc + 1];
		this.pc += 2;

		return opcode;
	}

	private decode(opcode: number): Nibbles {
		// prettier-ignore
		return {
			kind: (opcode & 0xf000) >> 12,
			x:    (opcode & 0x0f00) >> 8,
			y:    (opcode & 0x00f0) >> 4,
			n:     opcode & 0x000f,
			kk:    opcode & 0x00ff,
			nnn:   opcode & 0x0fff,
		};
	}

	private execute(nibbles: Nibbles) {
		const { kind, x, y, n, kk, nnn } = nibbles;

		switch (kind) {
			case 0x0:
				if (nnn === 0x0e0) {
					this.display.clear();
					this.render = true;
				} else if (nnn === 0x0ee) {
					this.pc = this.stack.pop();
				}
				break;
			case 0x1:
				this.pc = nnn;
				break;
			case 0x2:
				this.stack.push(this.pc);
				this.pc = nnn;
				break;
			case 0x3:
				if (this.v[x] === kk) this.pc += 2;
				break;
			case 0x4:
				if (this.v[x] !== kk) this.pc += 2;
				break;
			case 0x5:
				if (this.v[x] === this.v[y]) this.pc += 2;
				break;
			case 0x6:
				this.v[x] = kk;
				break;
			case 0x7:
				this.v[x] += kk;
				break;
			case 0x8:
				switch (n) {
					case 0x0:
						this.v[x] = this.v[y];
						break;
					case 0x1:
						this.v[x] |= this.v[y];
						break;
					case 0x2:
						this.v[x] &= this.v[y];
						break;
					case 0x3:
						this.v[x] ^= this.v[y];
						break;
					case 0x4: {
						const sum = this.v[x] + this.v[y];
						this.carry = +(sum > 255);
						this.v[x] = sum;
						break;
					}
					case 0x5:
						this.carry = +(this.v[x] >= this.v[y]);
						this.v[x] = this.v[x] - this.v[y];
						break;
					case 0x6:
						if (this.options.oldBehavior) this.v[x] = this.v[y];

						this.carry = this.v[x] & 1;
						this.v[x] >>>= 1;
						break;
					case 0x7:
						this.carry = +(this.v[y] >= this.v[x]);
						this.v[x] = this.v[y] - this.v[x];
						break;
					case 0xe:
						if (this.options.oldBehavior) this.v[x] = this.v[y];

						this.carry = (this.v[x] & 0b1000_0000) >> 7;
						this.v[x] <<= 1;
						break;
				}
				break;
			case 0x9:
				if (this.v[x] != this.v[y]) this.pc += 2;
				break;
			case 0xa:
				this.i = nnn;
				break;
			case 0xb:
				if (this.options.oldBehavior) {
					this.pc = nnn + this.v[0];
				} else {
					this.pc = kk + this.v[x];
				}
				break;
			case 0xc:
				this.v[x] = Math.floor(Math.random() * 256) & kk;
				break;
			case 0xd: {
				const { width, height } = this.display;

				const posX = this.v[x] % width;
				const posY = this.v[y] % height;

				const bytes = this.memory.slice(this.i, this.i + n);

				this.carry = 0;

				for (let b = 0; b < bytes.length; b++) {
					const y = Math.min(posY + b, height - 1);

					for (let i = 0; i < 8; i++) {
						let x = Math.min(posX + i, width - 1);
						const mask = 0b1000_0000 >> i;

						if (bytes[b] & mask) {
							const value = this.display.toggle(x, y);
							this.carry |= +!value;
						}
					}
				}

				this.render = true;
				break;
			}
			case 0xe:
				switch (kk) {
					case 0x9e:
						if (this.keypad.isKeyPressed(this.v[x])) this.pc += 2;
						break;
					case 0xa1:
						if (!this.keypad.isKeyPressed(this.v[x])) this.pc += 2;
						break;
					default:
						throw new Error(`Invalid kk value on opcode 0xE: ${hex(kk, 2)}`);
				}
				break;
			case 0xf:
				switch (kk) {
					case 0x07:
						this.v[x] = this.delayTimer;
						break;
					case 0x0a:
						const pressedKey = this.keypad.anyKeyPressed();
						if (pressedKey === null) {
							this.pc -= 2;
						} else {
							this.v[x] = pressedKey;
						}
						break;
					case 0x15:
						this.delayTimer = this.v[x];
						break;
					case 0x18:
						this.soundTimer = this.v[x];
						break;
					case 0x1e:
						this.i += this.v[x];
						break;
					case 0x29:
						let char = this.v[x];
						if (this.options.oldBehavior) char &= 0xf;

						this.i = FONT_OFFSET + char * 5;
						break;
					case 0x33:
						this.memory[this.i + 0] = this.v[x] / 100;
						this.memory[this.i + 1] = (this.v[x] / 10) % 10;
						this.memory[this.i + 2] = this.v[x] % 10;
						break;
					case 0x55:
						for (let i = 0; i <= x; i++) {
							this.memory[this.i + i] = this.v[i];
						}

						if (this.options.oldBehavior) {
							this.i += x + 1;
						}
						break;
					case 0x65:
						for (let i = 0; i <= x; i++) {
							this.v[i] = this.memory[this.i + i];
						}

						if (this.options.oldBehavior) {
							this.i += x + 1;
						}
						break;
					default:
						throw new Error(`Invalid kk value on opcode 0xF: ${hex(kk, 2)}`);
				}
				break;
			default:
				throw new Error(`Invalid opcode kind: ${hex(kind)}`);
		}
	}

	private get carry() {
		return this.v[0xf];
	}

	private set carry(value) {
		this.v[0xf] = value;
	}
}
