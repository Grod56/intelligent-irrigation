import ai from "../ai-client.js";

export async function makeAIComputations(
	geminiModel,
	irrigationDuration,
	crop,
	soilType,
	currentReadings,
	historicalReadings,
	weatherAPI,
	datePlanted
) {
	const forecast = await weatherAPI.getWeatherForecast(1);
	const generation = await ai.models
		.generateContent({
			model: geminiModel,
			contents: getPrompt(
				forecast,
				currentReadings,
				irrigationDuration,
				crop,
				soilType,
				historicalReadings,
				datePlanted
			),
		})
		.catch(error => {
			console.error(error);
			throw error;
		});
	return extractJson(generation.text);
}

function getPrompt(
	forecast,
	currentReadings,
	irrigationDuration,
	crop,
	soilType,
	historicalReadings,
	datePlanted
) {
	const irrigationMinutes = irrigationDuration / 60;
	const prompt =
		"Generate scheduled irrigation times for my automated system " +
		"for the rest of today based on the following parameters to be provided: " +
		"the crop, soil type, irrigation session duration, weatherapi forecast and location JSON, " +
		"date of planting, and current soil moisture % value. " +
		"Also factor in historical soil moisture data which will be provided as well. " +
		"Respond in JSON only please. " +
		"The generated JSON should have exactly three keys: 'scheduledTimes' " +
		"which maps to an array of timestamps with timezones representing the scheduled times; " +
		"'explanation' which maps to brief text explaining the rationale for generating the given times; " +
		"'cropAssessment' which maps to brief text assessing the " +
		"crop within the context of the provided parameters and offering general recommendations " +
		"on how to improve the crop's health beyond just irrigation. Note that the soil moisture " +
		"ranges from 0% to 100%, with 0 signifying complete absence of water and 100 indicating " +
		"complete saturation of the soil. The system uses drip irrigation. " +
		`Irrigation session duration: ${irrigationMinutes} minutes; ` +
		`Crop: '${crop}'; Soil type: '${soilType}'; ` +
		`Current soil moisture % value: ${currentReadings.moisture}; ` +
		`Date of planting: ${new Date(datePlanted).toLocaleString("en-us", {
			dateStyle: "long",
		})};` +
		`Forecast and location JSON: ${JSON.stringify(forecast)}` +
		`Historical soil moisture logs: ${JSON.stringify(historicalReadings)}`;
	return prompt;
}

function extractJson(text) {
	const responseJsonString = text.replace(/```(json)?/gm, "");
	return JSON.parse(responseJsonString);
}
