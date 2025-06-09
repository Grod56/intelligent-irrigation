import { ViewInteractionInterface } from "@mvc-react/stateful";
import {
	MainRepositoryModel,
	MainRepositoryModelInteraction,
	MainRepositoryModelView,
} from "../components/main/repository/repository";
import { RepositoryInteractionType } from "../misc/repository";
import { useStatefulRepository } from "../misc/use-repository";
import { newReadonlyModel } from "@mvc-react/mvc";
import {
	SensorReadingsModel,
	SensorReadingsModelView,
} from "../components/main/content-models/content-models";

function _deserializeSensorReadings(json: any): SensorReadingsModelView {
	return {
		moisture: json.moisture,
		ph: json.ph,
		timeRecorded: new Date(json.timeRecorded),
		weather: {
			current: json.current,
			max: json.weather.max,
		},
	};
}

function _deserializeJSON(json: any): MainRepositoryModelView {
	return {
		status: json.status,
		scheduledTimes: [...json.scheduledTimes].map(
			scheduledTime => new Date(scheduledTime)
		),
		sensorReadingsModel: newReadonlyModel(
			_deserializeSensorReadings(json.sensorReadingsModel.modelView)
		),
		chartModel: newReadonlyModel({
			sensorReadings: [...json.chartModel.modelView.sensorReadings].map(
				sensorReadingRaw => _deserializeSensorReadings(sensorReadingRaw)
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
							: Promise.reject(response.ok)
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
							: Promise.reject(response.ok)
					)
					.then(json => _deserializeJSON(json));
		}
	},
};

export function useMainRepository(): MainRepositoryModel {
	return useStatefulRepository({ modelView: null, viewInteractionInterface });
}
