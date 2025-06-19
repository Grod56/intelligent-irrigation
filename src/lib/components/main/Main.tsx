"use client";
import { RepositoryInteractionType } from "@/lib/misc/repository";
import { ConditionalComponent } from "@mvc-react/components";
import { newReadonlyModel } from "@mvc-react/mvc";
import { useMainRepository } from "../../default-implementations/main-repository";
import Placeholder from "../placeholder/Placeholder";
import LoadingBar from "../progress-bar/LoadingBar";
import "./main.scss";
import { MainRepositoryModel } from "./repository/repository";
import ControlPanel, {
	ControlPanelModelInteraction,
} from "./sections/control-panel/ControlPanel";
import Dashboard, {
	DashboardModelInteraction,
} from "./sections/dashboard/Dashboard";
import { MainRepositoryModelViewContext } from "./repository/repository";
import { useContext, useEffect } from "react";

const Main = function () {
	const { setCurrentValue } = useContext(MainRepositoryModelViewContext);
	const { modelView: repositoryModelView, interact }: MainRepositoryModel =
		useMainRepository();
	const dashBoardModel = repositoryModelView && {
		modelView: {
			status: repositoryModelView.status,
			config: repositoryModelView.config,
			readingsModel: repositoryModelView.readingsModel,
			chartModel: repositoryModelView.chartModel,
			aiFeedback: repositoryModelView.aiFeedback,
			scheduledTimes: repositoryModelView.scheduledTimes,
		},
		interact: function (interaction: DashboardModelInteraction) {
			switch (interaction.type) {
				case "ADD_TIME":
					const { input } = interaction;
					if (input.time.getTime() < Date.now()) {
						const message =
							"Scheduled time cannot be earlier than current time";
						throw new Error(message);
					}
					interact(interaction);
					break;
				default:
					interact(interaction);
			}
		},
	};
	const controlPanelModel = repositoryModelView && {
		modelView: {
			scheduledTimes: repositoryModelView.scheduledTimes,
			status: repositoryModelView.status,
		},
		interact: function (interaction: ControlPanelModelInteraction) {
			switch (interaction.type) {
				case "REFRESH_DATA":
					interact({
						type: RepositoryInteractionType.RETRIEVE,
					});
					break;
				default:
					interact(interaction);
			}
		},
	};

	useEffect(() => {
		setCurrentValue(repositoryModelView);
	}, [repositoryModelView]);

	return (
		<>
			<div className="loading-bar-container">
				<ConditionalComponent
					model={newReadonlyModel({
						condition: repositoryModelView?.isPendingChanges,
						components: new Map([[true, () => <LoadingBar />]]),
						FallBackComponent: () => <></>,
					})}
				/>
			</div>
			<main className="main">
				<ConditionalComponent
					model={newReadonlyModel({
						condition: repositoryModelView,
						components: new Map([
							[
								null,
								() => (
									<div className="placeholder-container">
										<Placeholder />
									</div>
								),
							],
						]),
						FallBackComponent: () => (
							<>
								<Dashboard model={dashBoardModel!} />
								<ControlPanel model={controlPanelModel!} />
							</>
						),
					})}
				/>
			</main>
		</>
	);
};

export default Main;
