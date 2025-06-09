import { ChartModelView } from "@/lib/components/main/content-models/content-models";
import { NextRequest } from "next/server";
import { getSensorReadingsData } from "../sensor-readings/route";

export function getChartData() {
	const chartModelView: ChartModelView = {
		sensorReadings: getSensorReadingsData("all"),
	};
	return chartModelView;
}

export async function GET(_: NextRequest) {
	return new Response(JSON.stringify(getChartData()), {
		status: 201,
		headers: { "Content-Type": "application/json" },
	});
}
