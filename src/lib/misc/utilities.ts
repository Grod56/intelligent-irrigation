export function toISOSeconds(time: number) {
	return Math.round(time / 1000);
}

export async function sleep(delaySeconds: number) {
	await new Promise(r => setInterval(r, delaySeconds * 1000));
}
