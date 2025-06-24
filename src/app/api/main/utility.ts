import { ChartModelView } from "@/lib/components/main/content-models/content-models";
import { MainRepositoryModelView } from "@/lib/components/main/repository/repository";
import supabase from "@/lib/misc/third-party/supabase.mjs";
import { newReadonlyModel } from "@mvc-react/mvc";
import { getScheduledTimes } from "../scheduled-times/utility";
import { getReadings } from "../readings/utility";
import { getAIFeedback } from "../ai-feedback/utility";
import { getConfig } from "../config/utility";
import { getWaterConsumption } from "../water-consumption/utility";

async function getStatus() {
	const { data } = await supabase
		.from("Status")
		.select()
		.order("timeRecorded", { ascending: false });
	if (data == null) throw new Error("Supabase returned null on request");
	const status = data[0];
	return status;
}

export async function getMainData() {
	const readingsModelViews = await getReadings("all");
	const status = await getStatus();
	const sensorReadingsModelView = readingsModelViews[0];
	const chartModelView: ChartModelView = {
		readings: readingsModelViews,
	};
	const scheduledTimes = await getScheduledTimes();
	const aiFeedback = await getAIFeedback();
	const config = await getConfig();
	const waterConsumption = await getWaterConsumption();

	const mainRepositoryModelView: MainRepositoryModelView = {
		status,
		readingsModel: newReadonlyModel({ ...sensorReadingsModelView }),
		chartModel: newReadonlyModel(chartModelView),
		scheduledTimes,
		aiFeedback,
		isPendingChanges: false,
		config,
		waterConsumption,
	};
	return mainRepositoryModelView;
}

export async function toggleIrrigation(ison: boolean) {
	const { error } = await supabase.rpc("toggleirrigation", {
		ison,
	});
	if (error)
		throw new Error(`Error communicating with database: ${error.message}`);
}

export async function requestReadings() {
	const { error } = await supabase.rpc("requestreadings");
	if (error)
		throw new Error(`Error communicating with database: ${error.message}`);
}

export async function toggleSystem() {
	const { error } = await supabase.rpc("togglesystem");
	if (error)
		throw new Error(`Error communicating with database: ${error.message}`);
}
