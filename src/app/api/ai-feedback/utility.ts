import supabase from "@/lib/misc/third-party/supabase";

export async function getAIFeedback() {
	const { data, error } = await supabase.from("AIFeedback").select();
	if (error) throw error;
	return data[0].feedback;
}
