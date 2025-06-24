import supabase from "@/lib/misc/third-party/supabase.mjs";

const RELATION = "ScheduledTime";

export async function getScheduledTimes() {
	const { data } = await supabase.from(RELATION).select().order("time");
	if (data == null) throw new Error("Supabase returned null on request");
	const scheduledTimes = data.map(record => new Date(record.time));
	return scheduledTimes;
}

export async function addTime(scheduledTime: Date) {
	const { error } = await supabase
		.from(RELATION)
		.insert({ time: scheduledTime.toISOString() });
	if (error) throw error;
}
