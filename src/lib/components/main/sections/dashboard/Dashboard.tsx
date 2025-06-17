import Card from "@/lib/components/card/Card";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import Spinner from "react-bootstrap/Spinner";
import { ChartModel, ReadingsModel } from "../../content-models/content-models";
import { SystemStatus } from "../../repository/repository";
import Chart from "./Chart";
import "./dashboard.scss";
import Readings from "./Readings";

export interface DashboardModelView {
	readingsModel: ReadingsModel;
	chartModel: ChartModel;
	status: SystemStatus;
	aiFeedback: string;
	scheduledTimes: Array<Date>;
}

export type DashboardModelInteraction =
	| ModelInteraction<"REQUEST_NEW_READINGS">
	| InputModelInteraction<"ADD_TIME", { time: Date }>;

export type DashboardModel = InteractiveModel<
	DashboardModelView,
	DashboardModelInteraction
>;

const Dashboard = function ({ model }) {
	const { interact } = model;
	const { readingsModel, chartModel, status, aiFeedback, scheduledTimes } =
		model.modelView!;
	return (
		<div className="dashboard" aria-disabled={status == "Inactive"}>
			<div className="main-panel">
				<Card>
					{/* To avoid dropshadow bleed*/}
					<div className="main-panel-content">
						<div className="status-panel">
							<ConditionalComponent
								model={newReadonlyModel({
									condition: status,
									components: new Map([
										[
											"Inactive",
											() => (
												<FontAwesomeIcon
													className="status-icon"
													icon={faPowerOff}
												/>
											),
										],
									]),
									FallBackComponent: () => (
										<Spinner
											className="status-icon"
											animation="grow"
											variant="success"
										/>
									),
								})}
							/>
							<span className="status-text" data-status={status}>
								{status}
							</span>
						</div>
						<hr />
						<div className="ai-feedback-panel">
							<h4 className="title">AI Feedback</h4>
							<p className="feedback">{aiFeedback}</p>
						</div>
						<div className="chart-panel">
							<h4 className="title">Soil Moisture Series</h4>
							<div className="chart-container">
								<Chart model={chartModel} />
							</div>
						</div>
					</div>
				</Card>
			</div>
			<div className="readings-panel">
				<Card title="Latest Readings">
					<Readings model={readingsModel} />
					<button
						className="request-readings"
						onClick={() =>
							interact({ type: "REQUEST_NEW_READINGS" })
						}
						disabled={status == "Inactive"}
					>
						Get Latest Readings
					</button>
				</Card>
			</div>
			<div className="scheduled-times-panel">
				<Card title="Irrigation Schedule">
					<div className="scheduled-times-content">
						<div className="times">
							{scheduledTimes.map((scheduledTime, index) => (
								<span key={index} className="time">
									{scheduledTime.toLocaleTimeString()}
								</span>
							))}
						</div>
					</div>
					<button
						className="add-time"
						onClick={() => {
							const timeString = prompt(
								"Please enter the time (HH:mm)"
							);
							try {
								if (timeString) {
									const parsedString = timeString.split(":");
									const scheduledTime = new Date(Date.now());
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
				</Card>
			</div>
			<div className="crop-information-panel">
				<Card title="Crop Information">
					<div className="symbols">
						<div className="crop-symbol">
							<img className="icon" src={"/corn-icon.svg"} />
							<span className="text">Crop — Maize</span>
						</div>
						<div className="soil-type-symbol">
							<img className="icon" src={"/soil-icon.svg"} />
							<span className="text">Soil type — Sand</span>
						</div>
					</div>
					<hr />
					<p className="information">{aiFeedback}</p>
				</Card>
			</div>
		</div>
	);
} as ModeledVoidComponent<DashboardModel>;

export default Dashboard;
