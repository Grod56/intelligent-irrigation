import { NextRequest } from "next/server";
import { getChartData } from "./utility";

export async function GET(_: NextRequest) {
	return new Response(JSON.stringify(getChartData()), {
		status: 201,
		headers: { "Content-Type": "application/json" },
	});
}
