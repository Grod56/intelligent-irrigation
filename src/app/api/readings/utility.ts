import { ReadingsModelView } from "@/lib/components/main/content-models/content-models";
import supabase from "@/lib/misc/third-party/supabase.mjs";

export async function getReadings(type: string | null) {
	const { data, error } = await supabase
		.from("Readings")
		.select()
		.order("timeRecorded", { ascending: false });
	if (data == null)
		throw new Error(`Error communicating with database: ${error}`);
	const readings: ReadingsModelView[] = data.map(record => ({
		moisture: record.moisture,
		timeRecorded: new Date(record.timeRecorded),
		weather: {
			currentTemp: record.weatherCurrentTemp,
			maxTemp: record.weatherMaxTemp,
			currentCondition: record.weatherCurrentCondition,
		},
	}));
	if (type == "all") {
		return readings;
	}
	return readings[0] && [readings[0]];
}
