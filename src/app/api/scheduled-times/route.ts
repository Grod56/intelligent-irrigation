import { NextRequest } from "next/server";
import { getScheduledTimes } from "./utility";

export async function GET(_: NextRequest) {
	return new Response(JSON.stringify(await getScheduledTimes()), {
		status: 201,
		headers: { "Content-Type": "application/json" },
	});
}
