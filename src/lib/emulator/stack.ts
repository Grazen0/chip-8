export class Stack {
	private readonly data: number[] = [];
	private pointer = -1;

	public constructor(length: number) {
		this.reset();
	}

	public push(value: number) {
		this.data.push(value);
	}

	public pop(): number {
		const value = this.data.pop();
		if (value === undefined) throw new Error('Empty stack');

		return value;
	}

	public reset() {
		this.data.fill(0);
		this.pointer = -1;
	}
}
