import {
	ChartModelView,
	SensorReadingsModelView,
} from "@/lib/components/main/content-models/content-models";
import { MainRepositoryModelView } from "@/lib/components/main/repository/repository";
import { newReadonlyModel } from "@mvc-react/mvc";
import { NextRequest } from "next/server";
import { getSensorReadingsData } from "../sensor-readings/route";
import { getChartData } from "../chart/route";
import { getScheduledTimesData } from "../scheduled-times/route";

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

export async function GET(_: NextRequest) {
	return new Response(JSON.stringify(getMainData()), {
		status: 201,
		headers: { "Content-Type": "application/json" },
	});
}

export async function POST(req: NextRequest) {
	//TODO:

	return new Response(JSON.stringify(getMainData()), {
		status: 201,
		headers: { "Content-Type": "application/json" },
	});
}
