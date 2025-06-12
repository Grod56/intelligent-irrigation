import { ReadonlyModel } from "@mvc-react/mvc";

interface Weather {
	currentTemp: number;
	maxTemp: number;
	currentCondition: string;
}

export interface ReadingsModelView {
	timeRecorded: Date;
	moisture: number;
	weather: Weather;
}

export interface ChartModelView {
	readings: ReadingsModelView[];
}

export type ReadingsModel = ReadonlyModel<ReadingsModelView>;
export type ChartModel = ReadonlyModel<ChartModelView>;
