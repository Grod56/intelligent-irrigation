import { NextRequest } from "next/server";
import { getScheduledTimesData } from "./utility";

export async function GET(_: NextRequest) {
	return new Response(JSON.stringify(getScheduledTimesData()), {
		status: 201,
		headers: { "Content-Type": "application/json" },
	});
}
