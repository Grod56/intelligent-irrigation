import { ViewInteractionInterface } from "@mvc-react/stateful";
import {
	MainRepositoryModel,
	MainRepositoryModelInteraction,
	MainRepositoryModelView,
} from "../components/main/repository/repository";
import { RepositoryInteractionType } from "../misc/repository";
import { useStatefulRepository } from "../misc/use-repository";
import { newReadonlyModel } from "@mvc-react/mvc";
import { ReadingsModelView } from "../components/main/content-models/content-models";

function _deserializeReadings(json: any): ReadingsModelView {
	return {
		moisture: json.moisture,
		timeRecorded: new Date(json.timeRecorded),
		weather: {
			currentTemp: json.weather.currentTemp,
			maxTemp: json.weather.maxTemp,
			currentCondition: json.weather.currentCondition,
		},
	};
}

function _deserializeJSON(json: any): MainRepositoryModelView {
	return {
		status: json.status,
		aiFeedback: json.aiFeedback,
		scheduledTimes: [...json.scheduledTimes].map(
			scheduledTime => new Date(scheduledTime)
		),
		readingsModel: newReadonlyModel(
			_deserializeReadings(json.readingsModel.modelView)
		),
		chartModel: newReadonlyModel({
			readings: [...json.chartModel.modelView.readings].map(readingRaw =>
				_deserializeReadings(readingRaw)
			),
		}),
	};
}

const viewInteractionInterface: ViewInteractionInterface<
	MainRepositoryModelView,
	MainRepositoryModelInteraction
> = {
	produceModelView: async function (
		interaction: MainRepositoryModelInteraction
	): Promise<MainRepositoryModelView> {
		switch (interaction.type) {
			case RepositoryInteractionType.RETRIEVE:
				return await fetch("/api/main")
					.then(response =>
						response.ok
							? response.json()
							: Promise.reject(response.statusText)
					)
					.then(json => _deserializeJSON(json));
			default:
				return await fetch("/api/main", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(interaction),
				})
					.then(response =>
						response.ok
							? response.json()
							: Promise.reject(response.statusText)
					)
					.then(json => _deserializeJSON(json));
		}
	},
};

export function useMainRepository(): MainRepositoryModel {
	return useStatefulRepository({ modelView: null, viewInteractionInterface });
}
