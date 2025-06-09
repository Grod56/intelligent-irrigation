import { MainRepositoryModelInteraction } from "@/lib/components/main/repository/repository";
import { InputModelInteraction } from "@mvc-react/mvc";
import { NextRequest } from "next/server";
import { addTime } from "../scheduled-times/utility";
import { getMainData, toggleStatus } from "./utility";

export async function GET(_: NextRequest) {
	return new Response(JSON.stringify(await getMainData()), {
		status: 201,
		headers: { "Content-Type": "application/json" },
	});
}

export async function POST(req: NextRequest) {
	const interaction = (await req.json()) as MainRepositoryModelInteraction;

	switch (interaction.type) {
		case "ADD_TIME":
			const { input } = interaction as InputModelInteraction<
				"ADD_TIME",
				{ time: Date }
			>;
			const time = new Date(input.time);
			await addTime(time.getHours(), time.getMinutes());
			break;
		case "FORCE_IRRIGATE":
			const now = new Date(Date.now());
			await addTime(now.getHours(), now.getMinutes());
			break;
		case "TOGGLE_SYSTEM":
			await toggleStatus();
			break;
	}
	return new Response(JSON.stringify(await getMainData()), {
		status: 201,
		headers: { "Content-Type": "application/json" },
	});
}
