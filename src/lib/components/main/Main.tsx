"use client";
import { RepositoryInteractionType } from "@/lib/misc/repository";
import { ConditionalComponent } from "@mvc-react/components";
import { InputModelInteraction, newReadonlyModel } from "@mvc-react/mvc";
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

const Main = function () {
	const { modelView: repositoryModelView, interact }: MainRepositoryModel =
		useMainRepository();
	const dashBoardModel = repositoryModelView && {
		modelView: {
			status: repositoryModelView.status,
			readingsModel: repositoryModelView.readingsModel,
			chartModel: repositoryModelView.chartModel,
			aiFeedback: repositoryModelView.aiFeedback,
			scheduledTimes: repositoryModelView.scheduledTimes,
		},
		interact: function (interaction: DashboardModelInteraction) {
			switch (interaction.type) {
				case "REQUEST_NEW_READINGS":
					interact({
						type: "REQUEST_NEW_READINGS",
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
					interact({
						type,
						input,
					});
					break;
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
				case "FORCE_IRRIGATE":
					interact({
						type: "FORCE_IRRIGATE",
					});
					break;
				case "STOP_IRRIGATING":
					interact({
						type: "STOP_IRRIGATING",
					});
					break;
			}
		},
	};

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
