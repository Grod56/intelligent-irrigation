import { ChartModelView } from "@/lib/components/main/content-models/content-models";
import { getSensorReadingsData } from "../sensor-readings/utility";

export async function getChartData() {
	const chartModelView: ChartModelView = {
		sensorReadings: await getSensorReadingsData("all"),
	};
	return chartModelView;
}
