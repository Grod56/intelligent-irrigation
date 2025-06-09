import { ModeledVoidComponent } from "@mvc-react/components";
import { SensorReadingsModel } from "../../content-models/content-models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBiohazard,
	faClock,
	faCloud,
	faWater,
} from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

const SensorReadings = function ({ model }) {
	const { weather, moisture, ph, timeRecorded } = model.modelView;
	return (
		<div className="sensor-readings">
			<span className="weather">
				<FontAwesomeIcon icon={faCloud} />
				<>
					Weather:{" "}
					<span>
						<span className="current">{weather.current}</span>
						{" / "}
						<span className="max">{weather.max}</span>
					</span>
				</>
			</span>
			<span className="moisture">
				<FontAwesomeIcon icon={faWater} />
				<>Moisture: {moisture}</>
			</span>
			<span className="pH">
				<FontAwesomeIcon icon={faBiohazard} />
				<>pH: {ph}</>
			</span>
			<span className="last-recorded">
				<FontAwesomeIcon icon={faClock} />
				<>Last recorded: {timeRecorded.toLocaleTimeString()}</>
			</span>
		</div>
	);
} as ModeledVoidComponent<SensorReadingsModel>;

export default SensorReadings;
