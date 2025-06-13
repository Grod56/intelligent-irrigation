import Placeholder from "@/lib/components/placeholder/Placeholder";
import SiteSection from "@/lib/components/site-section/ui/SiteSection";
import {
	ConditionalComponent,
	ModeledVoidComponent,
} from "@mvc-react/components";
import {
	InputModelInteraction,
	InteractiveModel,
	ModelInteraction,
	newReadonlyModel,
} from "@mvc-react/mvc";
import "./control-panel.scss";
import { SystemStatus } from "../../repository/repository";

export interface ControlPanelModelView {
	status: SystemStatus;
	scheduledTimes: Array<Date>;
}
export type ControlPanelModelInteraction =
	| ModelInteraction<"REFRESH_DATA">
	| ModelInteraction<"FORCE_IRRIGATE">
	| ModelInteraction<"STOP_IRRIGATING">
	| InputModelInteraction<"ADD_TIME", { time: Date }>;

export type ControlPanelModel = InteractiveModel<
	ControlPanelModelView,
	ControlPanelModelInteraction
>;

const ControlPanel = function ({ model }) {
	const { modelView, interact } = model;
	const { status, scheduledTimes } = modelView!;

	return (
		<div className="control-panel">
			<SiteSection
				model={newReadonlyModel({
					sectionName: "control-panel",
					sectionTitle: "Control Panel",
				})}
			>
				<div className="control-panel-content">
					<div className="scheduled-times">
						<div className="scheduled-times-content">
							<span className="label">Scheduled Times: </span>
							<div className="times">
								{scheduledTimes.map((scheduledTime, index) => (
									<span key={index} className="time">
										{scheduledTime.toLocaleTimeString()}
									</span>
								))}
							</div>
						</div>
					</div>
					<div className="controls">
						<button
							className="refresh-data"
							onClick={() => interact({ type: "REFRESH_DATA" })}
						>
							Refresh Data
						</button>
						<button
							className="add-time"
							onClick={() => {
								const timeString = prompt(
									"Please enter the time (HH:mm)"
								);
								try {
									if (timeString) {
										const parsedString =
											timeString.split(":");
										const scheduledTime = new Date(
											Date.now()
										);
										scheduledTime.setHours(
											Number(parsedString[0])
										);
										scheduledTime.setMinutes(
											Number(parsedString[1])
										);
										interact({
											type: "ADD_TIME",
											input: { time: scheduledTime },
										});
									}
								} catch (error) {
									alert(error);
									console.error(error);
								}
							}}
							disabled={status == "Inactive"}
						>
							Add Time
						</button>
						<button
							className="force-irrigate"
							onClick={() => interact({ type: "FORCE_IRRIGATE" })}
							disabled={status != "Idle"}
						>
							Force Irrigate
						</button>
						<button
							className="stop-irrigating"
							onClick={() =>
								interact({ type: "STOP_IRRIGATING" })
							}
							disabled={status != "Active"}
						>
							Stop Irrigating
						</button>
					</div>
					<div className="information-container">
						<p>
							Note that some controls are unavailable due to the
							current system status
						</p>
					</div>
				</div>
			</SiteSection>
		</div>
	);
} as ModeledVoidComponent<ControlPanelModel>;

export default ControlPanel;
