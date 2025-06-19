import { newReadonlyModel } from "@mvc-react/mvc";
import { ViewInteractionInterface } from "@mvc-react/stateful";
import { useCallback, useContext, useEffect } from "react";
import { ReadingsModelView } from "../components/main/content-models/content-models";
import {
	MainRepositoryModel,
	MainRepositoryModelInteraction,
	MainRepositoryModelView,
} from "../components/main/repository/repository";
import { RepositoryInteractionType } from "../misc/repository";
import { subscribeToChanges } from "../misc/subscriptions";
import { useStatefulRepository } from "../misc/use-repository";
import { MainRepositoryModelViewContext } from "../components/main/repository/repository";

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
		config: { ...json.config, planted: new Date(json.config.planted) },
		aiFeedback: {
			...json.aiFeedback,
			timeRecorded: new Date(json.aiFeedback.timeRecorded),
		},
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
		waterConsumption: {
			...json.waterConsumption,
			entries: [...json.waterConsumption.entries].map(entry => ({
				...entry,
				date: new Date(entry.date),
			})),
		},
		isPendingChanges: false,
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
			case "PREPARE_FOR_CHANGES":
				return interaction.input.currentModelView
					? {
							...interaction.input.currentModelView,
							isPendingChanges: true,
					  }
					: interaction.input.currentModelView!; // TODO: Nasty solution
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
	const context = useContext(MainRepositoryModelViewContext);
	const { modelView, interact } = useStatefulRepository({
		modelView: context.currentValue,
		viewInteractionInterface,
	});

	const changesCallback = useCallback(() => {
		subscribeToChanges(() => {
			interact({
				type: RepositoryInteractionType.RETRIEVE,
			});
		});
	}, [interact]);

	useEffect(() => {
		changesCallback();
	}, []);

	return { modelView, interact };
}
