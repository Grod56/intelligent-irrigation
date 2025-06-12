import { ChartModelView } from "@/lib/components/main/content-models/content-models";
import { getReadings } from "../readings/utility";

export async function getChartData() {
	const chartModelView: ChartModelView = {
		readings: await getReadings("all"),
	};
	return chartModelView;
}
