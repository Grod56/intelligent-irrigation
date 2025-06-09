"use client";
import { InputModelInteraction, newReadonlyModel } from "@mvc-react/mvc";
import "./main.scss";
import ControlPanel, {
	ControlPanelModel,
	ControlPanelModelInteraction,
} from "./sections/control-panel/ControlPanel";
import Dashboard, { DashboardModel } from "./sections/dashboard/Dashboard";
import { useMainRepository } from "../../default-implementations/main-repository";
import {
	ComponentPlaceholder,
	GeneralComponent,
	PlaceholderedComponentModel,
} from "@mvc-react/components";
import { MainRepositoryModel } from "./repository/repository";
import Placeholder from "../placeholder/Placeholder";
import { RepositoryInteractionType } from "@/lib/misc/repository";

const Main = function () {
	const repositoryModel: MainRepositoryModel = useMainRepository();
	const dashBoardModel: PlaceholderedComponentModel<DashboardModel> =
		repositoryModel.modelView
			? {
					modelView: {
						status: repositoryModel.modelView.status,
						sensorReadingsModel:
							repositoryModel.modelView.sensorReadingsModel,
						chartModel: repositoryModel.modelView.chartModel,
					},
			  }
			: undefined;
	const controlPanelModel: PlaceholderedComponentModel<ControlPanelModel> =
		repositoryModel.modelView
			? {
					modelView: {
						scheduledTimes:
							repositoryModel.modelView.scheduledTimes,
					},
					interact: function (
						interaction: ControlPanelModelInteraction
					) {
						switch (interaction.type) {
							case "REFRESH_DATA":
								repositoryModel.interact({
									type: RepositoryInteractionType.RETRIEVE,
								});
								break;
							case "FORCE_IRRIGATE":
								if (
									repositoryModel.modelView?.status !=
									"Active"
								) {
									const message =
										"Cannot irrigate when system is inactive. Please activate system first.";
									alert(message);
									console.error(message);
								}
								repositoryModel.interact({
									type: "FORCE_IRRIGATE",
								});
								break;
							case "TOGGLE_SYSTEM":
								repositoryModel.interact({
									type: "TOGGLE_SYSTEM",
								});
								break;
							case "ADD_TIME":
								const addTimeInteraction =
									interaction as InputModelInteraction<
										"ADD_TIME",
										{ time: Date }
									>;
								repositoryModel.interact({
									type: "ADD_TIME",
									input: addTimeInteraction.input,
								});
								break;
						}
					},
			  }
			: undefined;
	const DashBoardPlaceholder: GeneralComponent = () => (
		<div className="dashboard-placeholder">
			<Placeholder />
		</div>
	);
	const ControlPanelPlaceholder: GeneralComponent = () => (
		<div className="control-panel-placeholder">
			<Placeholder />
		</div>
	);

	return (
		<main className="main">
			<ComponentPlaceholder
				model={newReadonlyModel({
					PlaceholderedComponent: Dashboard,
					placeholderedComponentModel: dashBoardModel,
					PlaceholderComponent: DashBoardPlaceholder,
				})}
			/>
			<ComponentPlaceholder
				model={newReadonlyModel({
					PlaceholderedComponent: ControlPanel,
					placeholderedComponentModel: controlPanelModel,
					PlaceholderComponent: ControlPanelPlaceholder,
				})}
			/>
		</main>
	);
};

export default Main;
