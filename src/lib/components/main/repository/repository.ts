import {
	RepositoryModel,
	RepositoryModelInteraction,
	RepositoryModelView,
} from "@/lib/misc/repository";
import { InputModelInteraction, ModelInteraction } from "@mvc-react/mvc";
import { ChartModel, ReadingsModel } from "../content-models/content-models";

export type SystemStatus = "Active" | "Idle" | "Inactive";

export interface MainRepositoryModelView extends RepositoryModelView {
	status: SystemStatus;
	readingsModel: ReadingsModel;
	chartModel: ChartModel;
	scheduledTimes: Date[];
	aiFeedback: string;
}

export type MainRepositoryModelInteraction =
	| RepositoryModelInteraction<MainRepositoryModelView>
	| InputModelInteraction<"ADD_TIME", { time: Date }>
	| ModelInteraction<"FORCE_IRRIGATE">
	| ModelInteraction<"STOP_IRRIGATING">
	| ModelInteraction<"REQUEST_NEW_READINGS">;

export type MainRepositoryModel = RepositoryModel<
	MainRepositoryModelView,
	MainRepositoryModelInteraction
>;
