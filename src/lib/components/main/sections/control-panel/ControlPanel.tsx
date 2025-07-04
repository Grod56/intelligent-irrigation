import SiteSection from "@/lib/components/site-section/ui/SiteSection";
import { ModeledVoidComponent } from "@mvc-react/components";
import {
	InteractiveModel,
	ModelInteraction,
	newReadonlyModel,
} from "@mvc-react/mvc";
import { SystemStatus } from "../../repository/repository";
import "./control-panel.scss";

export interface ControlPanelModelView {
	status: SystemStatus;
	scheduledTimes: Array<Date>;
}
export type ControlPanelModelInteraction =
	| ModelInteraction<"REFRESH_DATA">
	| ModelInteraction<"FORCE_IRRIGATE">
	| ModelInteraction<"STOP_IRRIGATING">
	| ModelInteraction<"TOGGLE_SYSTEM">;

export type ControlPanelModel = InteractiveModel<
	ControlPanelModelView,
	ControlPanelModelInteraction
>;

const ControlPanel = function ({ model }) {
	const { modelView, interact } = model;
	const { status: currentStatus } = modelView!;

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
							Refresh
						</button>
						<button
							className="force-irrigate"
							onClick={() => interact({ type: "FORCE_IRRIGATE" })}
							disabled={currentStatus.status != "Idle"}
						>
							Irrigate Now
						</button>
						<button
							className="stop-irrigating"
							onClick={() =>
								interact({ type: "STOP_IRRIGATING" })
							}
							disabled={currentStatus.status != "Active"}
						>
							Stop Irrigating
						</button>
						<button
							className="toggle-system"
							onClick={() => interact({ type: "TOGGLE_SYSTEM" })}
							disabled={currentStatus.status == "Inactive"}
						>
							{currentStatus.status == "Disabled"
								? "Enable System"
								: "Disable System"}
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
