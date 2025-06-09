import "./dashboard.scss";
import SiteSection from "@/lib/components/site-section/ui/SiteSection";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import {
	ChartModel,
	SensorReadingsModel,
} from "../../content-models/content-models";
import { ModeledVoidComponent } from "@mvc-react/components";
import { SystemStatus } from "../../repository/repository";
import Chart from "./Chart";
import SensorReadings from "./SensorReadings";

export interface DashboardModelView {
	sensorReadingsModel: SensorReadingsModel;
	chartModel: ChartModel;
	status: SystemStatus;
}
export type DashboardModel = ReadonlyModel<DashboardModelView>;

const Dashboard = function ({ model }) {
	const { sensorReadingsModel, chartModel, status } = model.modelView;

	return (
		<div className="dashboard">
			<SiteSection
				model={newReadonlyModel({
					sectionName: "dashboard",
					sectionTitle: "Dashboard",
				})}
			>
				<div className="monitoring-data">
					<span className="status" data-status={status}>
						{status}
					</span>
					<SensorReadings model={sensorReadingsModel} />
					<div className="chart-container">
						<Chart model={chartModel} />
					</div>
				</div>
			</SiteSection>
		</div>
	);
} as ModeledVoidComponent<DashboardModel>;

export default Dashboard;
