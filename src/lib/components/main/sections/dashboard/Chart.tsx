import { ModeledVoidComponent } from "@mvc-react/components";
import {
	ChartModel,
	SensorReadingsModelView,
} from "../../content-models/content-models";
import React from "react";
import { Chart as CustomChart, AxisOptions } from "react-charts";
import Placeholder from "@/lib/components/placeholder/Placeholder";

const Chart = function ({ model }) {
	const { sensorReadings } = model.modelView;

	const data = React.useMemo(
		() => [{ label: "Moisture", data: sensorReadings }],
		[]
	);

	const primaryAxis = React.useMemo(
		(): AxisOptions<SensorReadingsModelView> => ({
			getValue: datum => datum.timeRecorded,
		}),
		[]
	);

	const secondaryAxes = React.useMemo(
		(): AxisOptions<SensorReadingsModelView>[] => [
			{
				getValue: datum => datum.moisture,
			},
		],
		[]
	);

	return (
		// <Placeholder />
		<CustomChart
			options={{
				data,
				primaryAxis,
				secondaryAxes,
			}}
		/>
	);
} as ModeledVoidComponent<ChartModel>;

export default Chart;
