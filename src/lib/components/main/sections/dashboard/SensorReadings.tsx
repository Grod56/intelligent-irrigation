import { ModeledVoidComponent } from "@mvc-react/components";
import { SensorReadingsModel } from "../../content-models/content-models";

const SensorReadings = function ({ model }) {
	const { weather, moisture, ph, timeRecorded } = model.modelView;
	return (
		<div className="sensor-readings">
			<span className="weather">
				Weather: <span className="current">{weather.current}</span>
				<span className="max">{weather.max}</span>
			</span>
			<span className="moisture">Moisture: {moisture}</span>
			<span className="pH">pH: {ph}</span>
			<span className="last-recorded">
				Last recorded: {timeRecorded.toLocaleTimeString()}
			</span>
		</div>
	);
} as ModeledVoidComponent<SensorReadingsModel>;

export default SensorReadings;
