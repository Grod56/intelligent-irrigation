import {
	StatifiableModel,
	useTransformedStatefulInteractiveModel,
} from "@mvc-react/stateful";
import { useCallback, useEffect } from "react";
import {
	RepositoryInteractionType,
	RepositoryModelInteraction,
	RepositoryModelView,
} from "./repository";

export function useStatefulRepository<V extends RepositoryModelView>(
	statifiableModel: StatifiableModel<V, RepositoryModelInteraction<V>>
) {
	const { modelView, interact } =
		useTransformedStatefulInteractiveModel(statifiableModel);
	const modifiedInteract = useCallback(
		(interaction: RepositoryModelInteraction<V>) => {
			interact({
				type: "PREPARE_FOR_CHANGES",
				input: {
					currentModelView: modelView,
				},
			});
			interact(interaction);
		},
		[interact, modelView]
	);

	useEffect(() => {
		if (!modelView)
			modifiedInteract({ type: RepositoryInteractionType.RETRIEVE });
	}, [modifiedInteract, modelView]);

	return {
		modelView,
		interact: modifiedInteract,
	};
}
