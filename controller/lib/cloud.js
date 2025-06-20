import supabase from "../supabase-client.js";
import { sleep } from "./utilities.js";

function _subscribeToChannel(topic, event, callback) {
	const channelName = `topic:${topic}`;
	function _resubscribeToChannel() {
		supabase
			.channel(channelName)
			.unsubscribe()
			.then(status => {
				if (status == "ok") {
					_subscribeToChannel(topic, event, callback);
				} else {
					return Promise.reject(status);
				}
			})
			.catch(error => {
				console.error(`Reconnection error: '${error}'`);
				sleep(10).then(_resubscribeToChannel());
			});
	}
	supabase
		.channel(channelName, {
			config: { private: true, broadcast: { self: true } },
		})
		.on("broadcast", { event }, message => {
			const payload = message.payload;
			callback(payload);
		})
		.subscribe(status => {
			if (status == "CHANNEL_ERROR") {
				console.log(`Reconnecting to '${topic}'`);
				_resubscribeToChannel();
			} else {
				console.log(`Channel status '${topic}': ${status}`);
			}
		});
}

export function listenForChanges(
	irrigationCallback,
	scheduledTimeCallback,
	readingsRequestCallback
) {
	_subscribeToChannel("irrigation", "toggle", irrigationCallback);
	_subscribeToChannel("scheduledtimes", "INSERT", scheduledTimeCallback);
	_subscribeToChannel("readings", "request", readingsRequestCallback);
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
