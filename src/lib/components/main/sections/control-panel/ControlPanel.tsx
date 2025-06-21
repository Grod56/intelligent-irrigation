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
	| ModelInteraction<"STOP_IRRIGATING">;

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
							Refresh Data
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
