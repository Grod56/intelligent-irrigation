import {
	pollForChanges,
	shutdown,
	startPolling,
	subscribeToChannel,
} from "../../shared/lib/cloud.mjs";
import supabase from "../supabase-client.js";

export function listenForChanges(
	isRealtime,
	irrigationCallback,
	scheduledTimeCallback,
	readingsRequestCallback,
	statusChangeCallback
) {
	if (isRealtime) {
		subscribeToChannel("irrigation", "toggle", irrigationCallback);
		subscribeToChannel("scheduledtimes", "INSERT", scheduledTimeCallback);
		subscribeToChannel("readings", "request", readingsRequestCallback);
		subscribeToChannel("status", "INSERT", statusChangeCallback);
	} else {
		pollForChanges("irrigation", "toggle", irrigationCallback);
		pollForChanges("scheduledtimes", "INSERT", scheduledTimeCallback);
		pollForChanges("readings", "request", readingsRequestCallback);
		pollForChanges("status", "INSERT", statusChangeCallback);
		startPolling();
	}
}

export async function retrieveConfig() {
	const { data, error } = await supabase.from("Configuration").select();
	if (error) throw error;
	return data[0];
}

export async function scheduleTime(scheduledTime) {
	const { error } = await supabase
		.from("ScheduledTime")
		.upsert({ time: scheduledTime.toISOString() });
	if (error) throw error;
}
export async function retrieveScheduledTimes() {
	const { data, error } = await supabase.from("ScheduledTime").select();
	if (error) throw error;
	return [...data].map(record => new Date(record.time));
}
export async function retrieveSensorReadingHistory() {
	const { data, error } = await supabase
		.from("Readings")
		.select("timeRecorded,moisture");
	if (error) throw error;
	return data;
}
export async function recordReadings(
	moisture,
	weathercurrenttemp,
	weathermaxtemp,
	weathercurrentcondition
) {
	const { error } = await supabase.rpc("newreadings", {
		moisture,
		weathercurrenttemp,
		weathermaxtemp,
		weathercurrentcondition,
	});
	if (error) throw error;
}
export async function clearPastScheduledTimes() {
	const { error } = await supabase.rpc("clearpastscheduledtimes");
	if (error) throw error;
}
export async function clearAllScheduledTimes() {
	const { error } = await supabase.rpc("clearallscheduledtimes");
	if (error) throw error;
}
export async function setStatus(status) {
	const { error } = await supabase.from("Status").insert({ status });
	if (error) throw error;
}
export async function setAIFeedback(feedback) {
	const { error } = await supabase.from("AIFeedback").insert({
		feedback: feedback.explanation,
		cropAssessment: feedback.cropAssessment,
		model: feedback.model,
	});
	if (error) throw error;
}

export async function shutdownCloud() {
	await shutdown();
}
