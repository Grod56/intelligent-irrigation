import supabase from "./third-party/supabase";

export function subscribeToChanges(callback: () => void) {
	supabase
		.channel("topic:scheduledtimes", {
			// Self broadcast to fix no broadcasts sent due to perceived identical client maybe?
			config: { private: true, broadcast: { self: true } },
		})
		.on("broadcast", { event: "INSERT" }, callback)
		.subscribe();
	supabase
		.channel("topic:readings", {
			config: { private: true, broadcast: { self: true } },
		})
		.on("broadcast", { event: "INSERT" }, callback)
		.subscribe();
	supabase
		.channel("topic:status", {
			config: { private: true, broadcast: { self: true } },
		})
		.on("broadcast", { event: "INSERT" }, callback)
		.subscribe();

	console.log("Listening for system changes");
}
