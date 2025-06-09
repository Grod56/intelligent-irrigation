import { NextRequest } from "next/server";

export function getScheduledTimesData() {
	let hourOffset = 2;
	const scheduledTimes = Array(6)
		.fill(new Date(Date.now()))
		.map(currentTime =>
			new Date().setHours(currentTime.getHours() + (hourOffset += 2))
		)
		.map(rawDate => new Date(rawDate));
	return scheduledTimes;
}

export async function GET(_: NextRequest) {
	return new Response(JSON.stringify(getScheduledTimesData()), {
		status: 201,
		headers: { "Content-Type": "application/json" },
	});
}
