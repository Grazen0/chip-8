export class Display {
	private readonly data: boolean[][];

	public constructor(public readonly width: number, public readonly height: number) {
		this.data = [...Array(width)].map(() => Array(height).fill(false));
	}

	private checkCoordinates(x: number, y: number) {
		if (x >= this.width) throw new Error(`X coordinate out of bounds: ${x}`);
		if (y >= this.height) throw new Error(`Y coordinate out of bounds: ${y}`);
	}

	public get(x: number, y: number) {
		this.checkCoordinates(x, y);
		return this.data[x][y];
	}

	public toggle(x: number, y: number): boolean {
		this.checkCoordinates(x, y);

		this.data[x][y] = !this.data[x][y];
		return this.data[x][y];
	}

	public clear() {
		for (const column of this.data) {
			column.fill(false);
		}
	}
}
