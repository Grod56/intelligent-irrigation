import supabase from "@/lib/misc/third-party/supabase";

export async function getWaterConsumption() {
	const { data: statusHistory, error: statusError } = await supabase
		.from("Status")
		.select();
	if (statusError) throw statusError;
	const { data: configData, error: configError } = await supabase
		.from("Configuration")
		.select("rate,emitters,duration");
	if (configError) throw configError;

	const config = configData[0];
	const totalHourlyRate = config.emitters * config.rate;
	const uniqueDates = new Map();

	statusHistory.forEach(entry =>
		uniqueDates.set(new Date(entry.timeRecorded).toLocaleDateString(), 0)
	);
	const waterConsumption = uniqueDates
		.keys()
		.map(dateString => {
			let totalTimeIrrigated = 0;
			const dateStatusHistoryEntries = statusHistory
				.filter(
					entry =>
						new Date(entry.timeRecorded).toLocaleDateString() ==
						dateString
				)
				.sort(
					(a, b) =>
						Date.parse(a.timeRecorded) - Date.parse(b.timeRecorded)
				);
			dateStatusHistoryEntries.forEach((entry, index) => {
				if (index == 0) return;
				const previousEntry = dateStatusHistoryEntries[index - 1];
				if (
					// On the assumption that there can be no 2 consecutive Actives ofc
					previousEntry.status == "Active" &&
					entry.status != previousEntry.status
				) {
					totalTimeIrrigated +=
						(Date.parse(entry.timeRecorded) -
							Date.parse(previousEntry.timeRecorded)) /
						(1000 * 3600);
				}
			});
			return {
				date: new Date(dateString),
				totalTimeIrrigated,
			};
		})
		.map(dailyIrrigationTime => ({
			date: dailyIrrigationTime.date,
			waterConsumed: Number(
				(
					dailyIrrigationTime.totalTimeIrrigated * totalHourlyRate
				).toFixed(2)
			),
		}))
		.toArray();
	const dailyAverage = Number(
		(
			waterConsumption
				.map(entry => entry.waterConsumed)
				.reduce(
					(previousReading, currentReading) =>
						previousReading + currentReading
				) / waterConsumption.length
		).toFixed(2)
	);
	return {
		entries: [...waterConsumption],
		dailyAverage,
		rating: config.rate,
		emitters: config.emitters,
		duration: Math.round(config.duration / 60),
	};
}
