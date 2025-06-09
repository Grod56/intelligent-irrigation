import { MainRepositoryModelView } from "@/lib/components/main/repository/repository";
import { newReadonlyModel } from "@mvc-react/mvc";
import { getChartData } from "../chart/utility";
import { getScheduledTimesData } from "../scheduled-times/utility";
import { getSensorReadingsData } from "../sensor-readings/utility";

export function getMainData() {
	const sensorReadingsModelView = getSensorReadingsData(null)[0];
	const chartModelView = getChartData();
	const scheduledTimes = getScheduledTimesData();
	const status = "Active";

	const mainRepositoryModelView: MainRepositoryModelView = {
		status,
		sensorReadingsModel: newReadonlyModel({ ...sensorReadingsModelView }),
		chartModel: newReadonlyModel(chartModelView),
		scheduledTimes,
	};
	return mainRepositoryModelView;
}
