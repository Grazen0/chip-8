export function hex(num: number, pad = 0, prefix = true) {
	const h = num.toString(16).padStart(pad, '0').toUpperCase();
	return prefix ? `0x${h}` : h;
}

export function waitForFile() {
	return new Promise<File>((resolve, reject) => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.ch8';

		input.onchange = () => {
			console.log('change');
			resolve(input.files![0]);
		};

		input.click();
	});
}
