import { ModeledVoidComponent } from "@mvc-react/components";
import {
	ChartModel,
	ReadingsModelView,
} from "../../content-models/content-models";
import React from "react";
import { Chart as CustomChart, AxisOptions } from "react-charts";
import Placeholder from "@/lib/components/placeholder/Placeholder";

const Chart = function ({ model }) {
	const { readings: sensorReadings } = model.modelView;

	const data = React.useMemo(
		() => [{ label: "Moisture", data: sensorReadings }],
		[]
	);

	const primaryAxis = React.useMemo(
		(): AxisOptions<ReadingsModelView> => ({
			getValue: datum => datum.timeRecorded,
		}),
		[]
	);

	const secondaryAxes = React.useMemo(
		(): AxisOptions<ReadingsModelView>[] => [
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
