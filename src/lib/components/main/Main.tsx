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
						readingsModel: repositoryModel.modelView.readingsModel,
						chartModel: repositoryModel.modelView.chartModel,
						aiFeedback: repositoryModel.modelView.aiFeedback,
					},
			  }
			: undefined;
	const controlPanelModel: PlaceholderedComponentModel<ControlPanelModel> =
		repositoryModel.modelView
			? {
					modelView: {
						scheduledTimes:
							repositoryModel.modelView.scheduledTimes,
						status: repositoryModel.modelView.status,
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
								repositoryModel.interact({
									type: "FORCE_IRRIGATE",
								});
								break;
							case "ADD_TIME":
								const { type, input } =
									interaction as InputModelInteraction<
										"ADD_TIME",
										{ time: Date }
									>;
								if (input.time.getTime() < Date.now()) {
									const message =
										"Scheduled time cannot be earlier than current time";
									throw new Error(message);
								}
								repositoryModel.interact({
									type,
									input,
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
