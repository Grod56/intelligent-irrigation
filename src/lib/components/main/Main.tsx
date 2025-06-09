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
							case "FORCE_IRRIGATE":
								repositoryModel.interact({
									type: "FORCE_IRRIGATE",
								});
							case "TOGGLE_SYSTEM":
								repositoryModel.interact({
									type: "TOGGLE_SYSTEM",
								});
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
		<div className="main">
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
		</div>
	);
};

export default Main;
