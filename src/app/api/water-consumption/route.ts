import { NextRequest } from "next/server";
import { getWaterConsumption } from "./utility";

export async function GET(_: NextRequest) {
	return new Response(JSON.stringify(await getWaterConsumption()), {
		status: 201,
		headers: { "Content-Type": "application/json" },
	});
}
