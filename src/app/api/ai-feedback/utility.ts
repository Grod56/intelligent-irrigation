import supabase from "@/lib/misc/third-party/supabase.mjs";

export async function getAIFeedback() {
	const { data, error } = await supabase
		.from("AIFeedback")
		.select("*")
		.order("timeRecorded", { ascending: false });
	if (error) throw error;
	return data[0];
}
