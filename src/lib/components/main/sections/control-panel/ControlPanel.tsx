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

export interface ControlPanelModelView {
	scheduledTimes: Array<Date>;
}
export type ControlPanelModelInteraction =
	| ModelInteraction<"REFRESH_DATA">
	| ModelInteraction<"FORCE_IRRIGATE">
	| ModelInteraction<"TOGGLE_SYSTEM">
	| InputModelInteraction<"ADD_TIME", { time: Date }>;

export type ControlPanelModel = InteractiveModel<
	ControlPanelModelView,
	ControlPanelModelInteraction
>;

const ControlPanel = function ({ model }) {
	const { modelView, interact } = model;
	return (
		<div className="control-panel">
			<SiteSection
				model={newReadonlyModel({
					sectionName: "control-panel",
					sectionTitle: "Control Panel",
				})}
			>
				<div className="control-panel-content">
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
										if (
											scheduledTime.getTime() < Date.now()
										) {
											const message =
												"Scheduled time cannot be earlier than current time";
											alert(message);
											console.error(message);
										}
										interact({
											type: "ADD_TIME",
											input: { time: scheduledTime },
										});
									}
								} catch (error) {
									alert(error);
								}
							}}
						>
							Add Time
						</button>
						<button
							className="force-irrigate"
							onClick={() => interact({ type: "FORCE_IRRIGATE" })}
						>
							Force Irrigate
						</button>
						<button
							className="deactivate"
							onClick={() => interact({ type: "TOGGLE_SYSTEM" })}
						>
							Toggle System
						</button>
					</div>
					<div className="scheduled-times">
						<div className="scheduled-times-content">
							<span className="label">Scheduled Times: </span>
							<ConditionalComponent
								model={newReadonlyModel({
									condition: modelView,
									components: new Map([[null, Placeholder]]),
									FallBackComponent: () => (
										<div className="times">
											{modelView!.scheduledTimes.map(
												(scheduledTime, index) => (
													<span
														key={index}
														className="time"
													>
														{scheduledTime.toLocaleTimeString()}
													</span>
												)
											)}
										</div>
									),
								})}
							/>
						</div>
					</div>
				</div>
			</SiteSection>
		</div>
	);
} as ModeledVoidComponent<ControlPanelModel>;

export default ControlPanel;
