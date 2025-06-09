import { ChartModelView } from "@/lib/components/main/content-models/content-models";
import { MainRepositoryModelView } from "@/lib/components/main/repository/repository";
import supabase from "@/lib/misc/third-party/supabase";
import { newReadonlyModel } from "@mvc-react/mvc";
import { getScheduledTimesData } from "../scheduled-times/utility";
import { getSensorReadingsData } from "../sensor-readings/utility";

async function getStatus() {
	const { data } = await supabase
		.from("Status")
		.select()
		.order("timeRecorded", { ascending: false });
	if (data == null) throw new Error("Supabase returned null on request");
	const status = data[0].status;
	return status;
}

export async function getMainData() {
	const sensorReadingsModelViews = await getSensorReadingsData("all");
	const status = await getStatus();
	const sensorReadingsModelView = sensorReadingsModelViews[0];
	const chartModelView: ChartModelView = {
		sensorReadings: sensorReadingsModelViews,
	};
	const scheduledTimes = await getScheduledTimesData();

	const mainRepositoryModelView: MainRepositoryModelView = {
		status,
		sensorReadingsModel: newReadonlyModel({ ...sensorReadingsModelView }),
		chartModel: newReadonlyModel(chartModelView),
		scheduledTimes,
	};
	return mainRepositoryModelView;
}

export async function toggleStatus() {
	const { error } = await supabase.rpc("togglestatus");
	if (error) throw new Error(`Error communicating with database: ${error}`);
}
