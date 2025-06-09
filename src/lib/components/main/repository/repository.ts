import {
	RepositoryModel,
	RepositoryModelInteraction,
} from "@/lib/misc/repository";
import { InputModelInteraction, ModelInteraction } from "@mvc-react/mvc";
import {
	ChartModel,
	SensorReadingsModel,
} from "../content-models/content-models";

export type SystemStatus = "Active" | "Idle" | "Inactive";

export interface MainRepositoryModelView {
	status: SystemStatus;
	sensorReadingsModel: SensorReadingsModel;
	chartModel: ChartModel;
	scheduledTimes: Date[];
}

export type MainRepositoryModelInteraction =
	| RepositoryModelInteraction
	| InputModelInteraction<"ADD_TIME", { time: Date }>
	| ModelInteraction<"FORCE_IRRIGATE">
	| ModelInteraction<"TOGGLE_SYSTEM">;

export type MainRepositoryModel = RepositoryModel<
	MainRepositoryModelView,
	MainRepositoryModelInteraction
>;
