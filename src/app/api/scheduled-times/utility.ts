import supabase from "@/lib/misc/third-party/supabase";

const RELATION = "ScheduledTime";

export async function getScheduledTimes() {
	const { data } = await supabase.from(RELATION).select().order("time");
	if (data == null) throw new Error("Supabase returned null on request");
	const scheduledTimes = data.map(record => new Date(record.time));
	return scheduledTimes;
}

export async function addTime(hours: number, minutes: number) {
	const scheduledTime = new Date(Date.now());
	scheduledTime.setHours(hours);
	scheduledTime.setMinutes(minutes);
	const { error } = await supabase
		.from(RELATION)
		.insert({ time: scheduledTime.toISOString() });
	if (error) throw error;
}
