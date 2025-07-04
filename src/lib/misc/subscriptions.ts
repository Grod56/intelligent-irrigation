import {
	pollForChanges,
	startPolling,
	subscribeToChannel,
} from "../../../shared/lib/cloud.mjs";

export function subscribeToChanges(isRealtime: boolean, callback: () => void) {
	if (isRealtime) {
		subscribeToChannel("scheduledtimes", "INSERT", callback);
		subscribeToChannel("readings", "INSERT", callback);
		subscribeToChannel("status", "INSERT", callback);
	} else {
		pollForChanges("scheduledtimes", "INSERT", callback);
		pollForChanges("readings", "INSERT", callback);
		pollForChanges("status", "INSERT", callback);
		startPolling();
	}
	console.log("Listening for system changes");
}
