import supabase from "@/lib/misc/third-party/supabase";

export async function getConfig() {
	const { data, error } = await supabase.from("Configuration").select();
	if (error) throw error;
	return data[0];
}
