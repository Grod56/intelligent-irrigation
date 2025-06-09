export function getScheduledTimesData() {
	let hourOffset = 2;
	const scheduledTimes = Array(6)
		.fill(new Date(Date.now()))
		.map(currentTime =>
			new Date().setHours(currentTime.getHours() + (hourOffset += 2))
		)
		.map(rawDate => new Date(rawDate));
	return scheduledTimes;
}
