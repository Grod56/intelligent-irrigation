import { ChartModelView } from "@/lib/components/main/content-models/content-models";
import { getSensorReadingsData } from "../sensor-readings/utility";

export function getChartData() {
	const chartModelView: ChartModelView = {
		sensorReadings: getSensorReadingsData("all"),
	};
	return chartModelView;
}
