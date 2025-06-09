import { SensorReadingsModelView } from "@/lib/components/main/content-models/content-models";

export function getSensorReadingsData(type: string | null) {
	const currentDate = new Date(Date.now());
	const sensorReadingsModelView: SensorReadingsModelView = {
		moisture: 56,
		ph: 5,
		weather: {
			current: 26,
			max: 30,
		},
		timeRecorded: currentDate,
	};
	if (type == "all") {
		const sensorReadingModelViews: SensorReadingsModelView[] = [
			sensorReadingsModelView,
			{
				moisture: 48,
				ph: 4.9,
				weather: {
					current: 23,
					max: 30,
				},
				timeRecorded: new Date(
					new Date().setHours(currentDate.getHours() - 2)
				),
			},
			{
				moisture: 43,
				ph: 4.8,
				weather: {
					current: 21,
					max: 30,
				},
				timeRecorded: new Date(
					new Date().setHours(currentDate.getHours() - 4)
				),
			},
			{
				moisture: 52,
				ph: 5.1,
				weather: {
					current: 18,
					max: 31,
				},
				timeRecorded: new Date(
					new Date().setHours(currentDate.getHours() - 6)
				),
			},
		];
		return sensorReadingModelViews;
	}
	return [sensorReadingsModelView];
}
