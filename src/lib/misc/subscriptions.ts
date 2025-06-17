import supabase from "./third-party/supabase";

export function subscribeToChanges(callback: () => void) {
	supabase
		.channel("topic:scheduledtimes", {
			config: { private: true },
		})
		.on("broadcast", { event: "INSERT" }, callback)
		.subscribe();
	supabase
		.channel("topic:readings", {
			config: { private: true },
		})
		.on("broadcast", { event: "INSERT" }, callback)
		.subscribe();
	supabase
		.channel("topic:status", {
			config: { private: true },
		})
		.on("broadcast", { event: "INSERT" }, () => {
			callback();
		})
		.subscribe();

	console.log("Listening for system changes");
}
