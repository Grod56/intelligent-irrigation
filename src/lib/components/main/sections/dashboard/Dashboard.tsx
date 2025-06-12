import "./dashboard.scss";
import SiteSection from "@/lib/components/site-section/ui/SiteSection";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import { ChartModel, ReadingsModel } from "../../content-models/content-models";
import { ModeledVoidComponent } from "@mvc-react/components";
import { SystemStatus } from "../../repository/repository";
import Chart from "./Chart";
import Readings from "./Readings";
import SiteSubsection from "@/lib/components/site-subsection/ui/SiteSubsection";

export interface DashboardModelView {
	readingsModel: ReadingsModel;
	chartModel: ChartModel;
	status: SystemStatus;
	aiFeedback: string;
}
export type DashboardModel = ReadonlyModel<DashboardModelView>;

const Dashboard = function ({ model }) {
	const { readingsModel, chartModel, status, aiFeedback } = model.modelView;

	return (
		<div className="dashboard">
			<SiteSection
				model={newReadonlyModel({
					sectionName: "dashboard",
					sectionTitle: "Dashboard",
				})}
			>
				<SiteSubsection
					model={newReadonlyModel({
						subsectionTitle: "Readings",
					})}
				>
					<div className="monitoring-data">
						<span className="status" data-status={status}>
							{status}
						</span>
						<Readings model={readingsModel} />
						<div className="chart-container">
							<Chart model={chartModel} />
						</div>
					</div>
				</SiteSubsection>
				<SiteSubsection
					model={newReadonlyModel({
						subsectionTitle: "AI Feedback",
					})}
				>
					<p>{aiFeedback}</p>
				</SiteSubsection>
			</SiteSection>
		</div>
	);
} as ModeledVoidComponent<DashboardModel>;

export default Dashboard;
