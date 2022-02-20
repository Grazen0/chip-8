export class Stack {
	private readonly data: Uint16Array;
	private pointer = -1;

	public constructor(length: number) {
		this.data = new Uint16Array(length);
	}

	public push(value: number) {
		this.pointer++;
		if (this.pointer >= this.data.length) throw new Error('Stack overflow');

		this.data[this.pointer] = value;
	}

	public pop(): number {
		if (this.pointer === -1) throw new Error('Empty stack');

		const value = this.data[this.pointer];
		this.pointer--;

		return value;
	}

	public reset() {
		this.data.fill(0);
		this.pointer = -1;
	}

	public get size() {
		return this.pointer + 1;
	}

	public get values(): ReadonlyArray<number> {
		return [...this.data.slice(0, this.pointer + 1)];
	}
}
