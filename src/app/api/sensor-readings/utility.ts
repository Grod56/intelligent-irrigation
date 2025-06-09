import { SensorReadingsModelView } from "@/lib/components/main/content-models/content-models";
import supabase from "@/lib/misc/third-party/supabase";

export async function getSensorReadingsData(type: string | null) {
	const { data, error } = await supabase
		.from("SensorReadings")
		.select()
		.order("timeRecorded", { ascending: false });
	if (data == null)
		throw new Error(`Error communicating with database: ${error}`);
	const sensorReadings: SensorReadingsModelView[] = data.map(record => ({
		moisture: record.moisture,
		ph: record.pH,
		timeRecorded: new Date(record.timeRecorded),
		weather: {
			current: record.currentWeather,
			max: record.maxWeather,
		},
	}));
	if (type == "all") {
		return sensorReadings;
	}
	return sensorReadings[0] && [sensorReadings[0]];
}
