import supabase from "@/lib/misc/third-party/supabase.mjs";

export async function getConfig() {
	const { data, error } = await supabase.from("Configuration").select();
	if (error) throw error;
	return data[0];
}
