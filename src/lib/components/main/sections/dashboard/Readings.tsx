import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadingsModel } from "../../content-models/content-models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBiohazard,
	faClock,
	faCloud,
	faWater,
} from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

const Readings = function ({ model }) {
	const { weather, moisture, timeRecorded } = model.modelView;
	return (
		<div className="readings">
			<span className="weather">
				<FontAwesomeIcon icon={faCloud} />
				<>
					Weather:{" "}
					<span>
						<span className="current-temp">
							{weather.currentTemp}
						</span>
						{" / "}
						<span className="max-temp">{weather.maxTemp}</span>
						{" | "}
						<span className="condition">
							{weather.currentCondition}
						</span>
					</span>
				</>
			</span>
			<span className="moisture">
				<FontAwesomeIcon icon={faWater} />
				<>Moisture: {moisture}</>
			</span>
			<span className="last-recorded">
				<FontAwesomeIcon icon={faClock} />
				<>Last logged: {timeRecorded.toLocaleTimeString()}</>
			</span>
		</div>
	);
} as ModeledVoidComponent<ReadingsModel>;

export default Readings;
