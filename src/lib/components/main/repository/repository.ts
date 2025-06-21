import {
	RepositoryModel,
	RepositoryModelInteraction,
	RepositoryModelView,
} from "@/lib/misc/repository";
import { InputModelInteraction, ModelInteraction } from "@mvc-react/mvc";
import { ChartModel, ReadingsModel } from "../content-models/content-models";
import { createContext } from "react";

export type SystemStatus = {
	status: "Active" | "Idle" | "Inactive";
	timeRecorded: Date;
};

export type AIFeedback = {
	feedback: string;
	cropAssessment: string;
	model: string;
	timeRecorded: Date;
};

export type Configuration = {
	crop: string;
	soil: string;
	location: string;
	planted: Date;
};

export type WaterConsumption = {
	entries: {
		date: Date;
		waterConsumed: number;
	}[];
	dailyAverage: number;
	rating: number;
	emitters: number;
	duration: number;
};

export interface MainRepositoryModelView extends RepositoryModelView {
	status: SystemStatus;
	readingsModel: ReadingsModel;
	chartModel: ChartModel;
	scheduledTimes: Date[];
	aiFeedback: AIFeedback;
	config: Configuration;
	waterConsumption: WaterConsumption;
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
export const MainRepositoryModelViewContext = createContext<{
	currentValue: MainRepositoryModelView | null;
	setCurrentValue: (
		repositoryModelView: MainRepositoryModelView | null
	) => void;
}>({
	currentValue: null,
	setCurrentValue: (_: MainRepositoryModelView | null) => {},
});
