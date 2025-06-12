import { NextRequest } from "next/server";
import { getSensorReadingsData } from "./utility";

export async function GET(req: NextRequest) {
	const requestURL = new URL(req.url);
	const type = requestURL.searchParams.get("type");
	return new Response(JSON.stringify(await getSensorReadingsData(type)), {
		status: 201,
		headers: { "Content-Type": "application/json" },
	});
}
