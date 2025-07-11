import {
	clearAllScheduledTimes,
	clearPastScheduledTimes,
	recordReadings,
	retrieveScheduledTimes,
	setStatus,
	scheduleTime,
	setAIFeedback,
	retrieveSensorReadingHistory,
	retrieveConfig,
	listenForChanges,
	shutdownCloud,
} from "./lib/cloud.js";
import { Hardware } from "./lib/hardware.js";
import { WeatherAPI } from "./lib/weather-api.js";
import { makeAIComputations } from "./lib/ai.js";
import consoleStamp from "console-stamp";
import { sleep } from "../shared/lib/utilities.mjs";

// Config ------------------------------------------------------
consoleStamp(console);

console.log("System initializing");

const config = await retrieveConfig();

const hardware = new Hardware(
	process.env.SERIAL_PATH,
	Number(process.env.BAUD_RATE)
);
const weatherApi = new WeatherAPI(config.location, process.env.WEATHER_API_KEY);
const crop = config.crop;
const soilType = config.soil;
const irrigationDuration = config.duration;
const geminiModel = process.env.GEMINI_MODEL;

const readingLogFrequency = Number(process.env.DEFAULT_READING_LOG_FREQ);
let irrigationToggle = false;
let scheduledTimes = [];
let nextEvaluationTime;
let isShutdown = false;
let status;

async function getCurrentReadings() {
	const { currentTemp, maxTemp, currentCondition } =
		await weatherApi.getCurrentWeather();
	const response = await hardware.sense();
	const { moisture } = response;
	return { moisture, currentTemp, maxTemp, currentCondition };
}

async function collectReadings() {
	while (!isShutdown) {
		const { moisture, currentTemp, maxTemp, currentCondition } =
			await getCurrentReadings();
		await recordReadings(moisture, currentTemp, maxTemp, currentCondition)
			.then(() => {
				console.log(
					`Weather: %d / %d, %s; Sensors: Moisture: %d`,
					currentTemp,
					maxTemp,
					currentCondition,
					moisture
				);
			})
			.then(() => sleep(readingLogFrequency));
	}
}

async function processIrrigation(toggle) {
	if (status != "Disabled") {
		if (irrigationToggle == toggle) return;
		irrigationToggle = toggle;
		if (irrigationToggle) {
			await hardware
				.irrigate()
				.then(() => setStatus("Active"))
				.then(() => sleep(irrigationDuration))
				.then(() => hardware.stopIrrigating())
				.then(() => (irrigationToggle = false));
		} else {
			await hardware.stopIrrigating();
		}
		if (status != "Disabled") await setStatus("Idle");
	}
}

async function monitorScheduledTimes() {
	while (!isShutdown) {
		if (status != "Disabled") {
			if (
				scheduledTimes.filter(
					scheduledTime => scheduledTime <= Date.now()
				).length > 0
			) {
				processIrrigation(true);
				await clearPastScheduledTimes()
					.then(retrieveScheduledTimes)
					// Too lazy to just remove locally;
					.then(retrievedTimes => (scheduledTimes = retrievedTimes));
			}
		}
		await sleep(1);
	}
}

async function monitorEvaluationTimes() {
	while (!isShutdown) {
		if (nextEvaluationTime <= Date.now()) {
			await performEvaluation();
			const newEvaluationTime = new Date();
			const currentHour = new Date(Date.now()).getHours();
			if (6 - currentHour > 3) {
				newEvaluationTime.setHours(6, 0, 0, 0);
			} else if (12 - currentHour > 3) {
				newEvaluationTime.setHours(12, 0, 0, 0);
			} else {
				newEvaluationTime.setDate(new Date(Date.now()).getDate() + 1);
				newEvaluationTime.setHours(6, 0, 0, 0);
			}
			nextEvaluationTime = newEvaluationTime;
			console.log(
				`Next evaluation at: ${nextEvaluationTime.toLocaleString()}`
			);
		}
		await sleep(1);
	}
}

async function performEvaluation() {
	const feedback = await makeAIComputations(
		geminiModel,
		irrigationDuration,
		crop,
		soilType,
		await getCurrentReadings(),
		await retrieveSensorReadingHistory(),
		weatherApi,
		config.planted
	);
	await setAIFeedback({ ...feedback, model: geminiModel });
	await clearAllScheduledTimes();
	scheduledTimes = [];
	[...feedback.scheduledTimes].forEach(scheduledTime =>
		scheduleTime(new Date(scheduledTime)).catch(error => {
			console.error(error.message);
			Promise.reject(error);
		})
	);
	console.log("AI Evaluation completed successully");
}

async function shutdown() {
	console.log("Shutting down");
	isShutdown = true;
	await setStatus("Inactive")
		.then(() => shutdownCloud())
		.then(() => hardware.shutdown())
		.then(() => console.log("Shut down"))
		.then(process.exit);
}

// Execution ----------------------------------------------------
async function main() {
	await clearAllScheduledTimes();
	await setStatus("Idle");
	monitorScheduledTimes();
	listenForChanges(
		false,
		({ toggle }) => {
			processIrrigation(toggle);
		},
		({ record }) => {
			const scheduledTime = new Date(record.time);
			scheduledTimes = [...scheduledTimes, scheduledTime];
			console.log(
				`Irrigation scheduled for ${scheduledTime.toTimeString()}`
			);
		},
		() => {
			getCurrentReadings().then(
				({ moisture, currentTemp, maxTemp, currentCondition }) => {
					console.log(
						`Weather: %d / %d, %s; Sensors: Moisture: %d`,
						currentTemp,
						maxTemp,
						currentCondition,
						moisture
					);
					return recordReadings(
						moisture,
						currentTemp,
						maxTemp,
						currentCondition
					);
				}
			);
		},
		async ({ record }) => {
			if (status == "Disabled") {
				await hardware.stopIrrigating();
				irrigationToggle = false;
			}
			status = record.status;
			console.log(`System is ${status}`);
		}
	);
	collectReadings();
	nextEvaluationTime = new Date(Date.now());
	monitorEvaluationTimes();

	// --------------------------------------------------------------
	console.log("System activation complete.");
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", () => process.exit(1));
process.on("unhandledRejection", async reason => {
	console.error(reason.message ? reason.message : reason);
	await shutdown();
});

main().catch(error => {
	console.error(error.message ? error.message : error);
	shutdown();
});
