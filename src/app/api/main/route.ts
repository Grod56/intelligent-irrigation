import {
	ChartModelView,
	SensorReadingsModelView,
} from "@/lib/components/main/content-models/content-models";
import { MainRepositoryModelView } from "@/lib/components/main/repository/repository";
import { newReadonlyModel } from "@mvc-react/mvc";
import { NextRequest } from "next/server";
import { getSensorReadingsData } from "../sensor-readings/utility";
import { getChartData } from "../chart/utility";
import { getScheduledTimesData } from "../scheduled-times/utility";
import { getMainData } from "./utility";

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
