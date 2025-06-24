import supabase from "../../src/lib/misc/third-party/supabase.mjs";
import { sleep } from "./utilities.mjs";

const polledChannelCallbacks = new Map();
let isPolling = false;
let lastProcessed;

export function subscribeToChannel(topic, event, callback) {
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

export function pollForChanges(topic, event, callback) {
	polledChannelCallbacks.set(
		JSON.stringify({ topic: `topic:${topic}`, event }),
		callback
	);
	console.log(`Polling channel: '${topic}'`);
}

export async function startPolling() {
	if (isPolling) throw new Error("The system is already polling");
	const { data: latestEntry, error } = await supabase
		.from("messages")
		.select()
		.order("inserted_at", { ascending: false })
		.limit(1)
		.single();
	if (error) {
		console.error(error.message);
		throw error;
	}
	lastProcessed = latestEntry;
	isPolling = true;
	console.log("Channel polling started");
	while (isPolling) {
		const { data: newEntries, error } = await supabase
			.from("messages")
			.select()
			.order("inserted_at", { ascending: true })
			.filter("inserted_at", "gte", lastProcessed.inserted_at)
			.filter("id", "not.eq", lastProcessed.id);
		if (error) {
			console.error(error.message);
		} else {
			[...newEntries].forEach(newEntry => {
				const { topic, event, payload } = newEntry;
				const callback = polledChannelCallbacks.get(
					JSON.stringify({ topic, event })
				);
				if (callback) callback(payload);
				lastProcessed = newEntry;
			});
		}
		await sleep(2);
	}
	console.log("Channel polling ended");
}

export async function shutdown() {
	isPolling = false;
	supabase.realtime.disconnect();
}
