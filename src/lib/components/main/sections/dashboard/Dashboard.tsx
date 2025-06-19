import Card from "@/lib/components/card/Card";
import { faPowerOff, faSeedling } from "@fortawesome/free-solid-svg-icons";
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
import {
	AIFeedback,
	Configuration,
	SystemStatus,
	WaterConsumption,
} from "../../repository/repository";
import { AxisOptions, Chart as CustomChart } from "react-charts";
import Chart from "./Chart";
import "./dashboard.scss";
import Readings from "./Readings";
import React from "react";

export interface DashboardModelView {
	readingsModel: ReadingsModel;
	chartModel: ChartModel;
	status: SystemStatus;
	aiFeedback: AIFeedback;
	scheduledTimes: Array<Date>;
	config: Configuration;
	waterConsumption: WaterConsumption;
}

export type DashboardModelInteraction =
	| ModelInteraction<"REQUEST_NEW_READINGS">
	| InputModelInteraction<"ADD_TIME", { time: Date }>;

export type DashboardModel = InteractiveModel<
	DashboardModelView,
	DashboardModelInteraction
>;

const GenerationInfo = function ({
	generation,
	timeRecorded,
	model,
}: {
	generation: string;
	timeRecorded: string;
	model: string;
}) {
	return (
		<div className="generation-info">
			<p className="generation">{generation}</p>
			<hr />
			<div className="generation-meta">
				<span className="model">
					Feedback by: <span className="model-text">{model}</span>
				</span>
				<span className="time-recorded">
					<span className="time-recorded-text">{timeRecorded}</span>
				</span>
			</div>
		</div>
	);
};

const WaterChart = function ({
	entries,
}: {
	entries: { date: Date; waterConsumed: Number }[];
}) {
	const data = React.useMemo(
		() => [{ label: "Water Consumed", data: entries }],
		[]
	);

	const primaryAxis = React.useMemo(
		(): AxisOptions<{ date: Date; waterConsumed: Number }> => ({
			getValue: datum => datum.date,
		}),
		[]
	);

	const secondaryAxes = React.useMemo(
		(): AxisOptions<{ date: Date; waterConsumed: Number }>[] => [
			{
				getValue: datum => datum.waterConsumed,
			},
		],
		[]
	);
	return (
		<div className="chart-container">
			<CustomChart
				options={{
					data,
					primaryAxis,
					secondaryAxes,
				}}
			/>
		</div>
	);
};

const Dashboard = function ({ model }) {
	const { interact } = model;
	const {
		readingsModel,
		chartModel,
		status,
		aiFeedback,
		scheduledTimes,
		config,
		waterConsumption,
	} = model.modelView!;
	const {
		timeRecorded,
		model: aIModel,
		feedback,
		cropAssessment,
	} = aiFeedback;
	const { dailyAverage, emitters, rating, entries, duration } =
		waterConsumption;
	const timeRecordedString = timeRecorded.toLocaleString("en-US", {
		dateStyle: "full",
	});
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
													data-status={status}
												/>
											),
										],
									]),
									FallBackComponent: () => (
										<Spinner
											className="status-icon"
											animation="grow"
											data-status={status}
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
							<GenerationInfo
								model={aIModel}
								generation={feedback}
								timeRecorded={timeRecordedString}
							/>
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
				<Card title="Crop Assessment">
					<div className="symbols">
						<div className="crop-symbol">
							<FontAwesomeIcon
								className="icon"
								color={"green"}
								icon={faSeedling}
							/>
							<span className="text">{config.crop}</span>
						</div>
						<div className="soil-type-symbol">
							<img className="icon" src={"/soil.png"} />
							<span className="text">{config.soil}</span>
						</div>
						<hr />
					</div>
					<div className="planted-details">
						<span className="text">
							Planted on{" "}
							{config.planted.toLocaleString("en-us", {
								dateStyle: "long",
							})}
						</span>
					</div>
					<GenerationInfo
						model={aIModel}
						generation={cropAssessment}
						timeRecorded={timeRecordedString}
					/>
					<hr />
				</Card>
			</div>
			<div className="water-consumption-panel">
				<Card title="Water Consumption">
					<div className="metrics">
						<div className="daily-avg">
							<span className="avg-text">Daily Average </span>
							<span className="avg-number">{dailyAverage}</span>
						</div>
						<span className="rating">Drip Rating: {rating}</span>
						<span className="emitters">Emitters: {emitters}</span>
						<span className="duration">
							Irrigation Session Duration: {duration}
						</span>
					</div>
					<hr />
					<div className="water-consumption-series">
						<span className="title">Water Consumption Series</span>
						<WaterChart entries={entries} />
					</div>
				</Card>
			</div>
		</div>
	);
} as ModeledVoidComponent<DashboardModel>;

export default Dashboard;
