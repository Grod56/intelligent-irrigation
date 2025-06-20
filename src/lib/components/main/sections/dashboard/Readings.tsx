import {
	ConditionalComponent,
	ModeledVoidComponent,
} from "@mvc-react/components";
import { ReadingsModel } from "../../content-models/content-models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCloud,
	faCloudSun,
	faDroplet,
	faMoon,
	faSmog,
	faSun,
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { newReadonlyModel } from "@mvc-react/mvc";

const Readings = function ({ model }) {
	const { weather, moisture, timeRecorded } = model.modelView;
	return (
		<div className="readings">
			<span className="weather">
				<ConditionalComponent
					model={newReadonlyModel({
						condition: weather.currentCondition,
						components: new Map([
							[
								"Clear",
								() => (
									<FontAwesomeIcon
										className="icon"
										icon={faMoon}
										color={"purple"}
									/>
								),
							],
							[
								"Sunny",
								() => (
									<FontAwesomeIcon
										className="icon"
										icon={faSun}
										color={"orange"}
									/>
								),
							],
							[
								"Partly cloudy",
								() => (
									<FontAwesomeIcon
										className="icon"
										icon={faCloudSun}
									/>
								),
							],
							[
								"Cloudy",
								() => (
									<FontAwesomeIcon
										className="icon"
										icon={faCloud}
										color={"grey"}
									/>
								),
							],
							[
								"Overcast",
								() => (
									<FontAwesomeIcon
										className="icon"
										icon={faCloud}
										color={"grey"}
									/>
								),
							],
							[
								"Mist",
								() => (
									<FontAwesomeIcon
										className="icon"
										icon={faSmog}
										color={"grey"}
									/>
								),
							],
						]),
						FallBackComponent: () => (
							<FontAwesomeIcon
								className="icon"
								icon={faCloud}
								color={"grey"}
							/>
						),
					})}
				/>
				<span className="reading-text">
					Weather{" "}
					<span>
						<span className="temp">{weather.currentTemp}</span>
						{" | "}
						<span className="temp">{weather.maxTemp}</span>
					</span>
				</span>
			</span>
			<span className="moisture">
				<FontAwesomeIcon className="icon" icon={faDroplet} />
				<span className="reading-text">
					Soil Moisture <span className="value">{moisture}</span>
				</span>
			</span>
			<span className="last-recorded">
				<FontAwesomeIcon className="icon" icon={faClock} />
				<span className="reading-text">
					Last logged <span>{timeRecorded.toLocaleTimeString()}</span>
				</span>
			</span>
		</div>
	);
} as ModeledVoidComponent<ReadingsModel>;

export default Readings;
