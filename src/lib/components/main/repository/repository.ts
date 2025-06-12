import {
	RepositoryModel,
	RepositoryModelInteraction,
} from "@/lib/misc/repository";
import { InputModelInteraction, ModelInteraction } from "@mvc-react/mvc";
import { ChartModel, ReadingsModel } from "../content-models/content-models";

export type SystemStatus = "Active" | "Idle" | "Inactive";

export interface MainRepositoryModelView {
	status: SystemStatus;
	readingsModel: ReadingsModel;
	chartModel: ChartModel;
	scheduledTimes: Date[];
	aiFeedback: string;
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
