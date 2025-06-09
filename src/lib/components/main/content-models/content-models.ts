import { ReadonlyModel } from "@mvc-react/mvc";

interface Weather {
	current: number;
	max: number;
}

export interface SensorReadingsModelView {
	moisture: number;
	ph: number;
	weather: Weather;
	timeRecorded: Date;
}

export interface ChartModelView {
	sensorReadings: SensorReadingsModelView[];
}

export type SensorReadingsModel = ReadonlyModel<SensorReadingsModelView>;
export type ChartModel = ReadonlyModel<ChartModelView>;
