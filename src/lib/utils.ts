export function hex(num: number, pad = 0, prefix = true) {
	const h = num.toString(16).padStart(pad, '0').toUpperCase();
	return prefix ? `0x${h}` : h;
}
