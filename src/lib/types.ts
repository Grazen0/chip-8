export interface RomInfo {
	file: string;
	label: string;
}

export interface Nibbles {
	kind: number;
	x: number;
	y: number;
	n: number;
	kk: number;
	nnn: number;
}

export interface Quirks {
	vyIntoVx: boolean;
	bxnn: boolean;
	changeI: boolean;
}

export type Runnable = () => void;

export type Timeout = ReturnType<typeof setTimeout>;
