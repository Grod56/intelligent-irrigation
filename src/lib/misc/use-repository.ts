import { ModelView } from "@mvc-react/mvc";
import {
	StatifiableModel,
	useTransformedStatefulInteractiveModel,
} from "@mvc-react/stateful";
import { useEffect } from "react";
import {
	RepositoryInteractionType,
	RepositoryModelInteraction,
} from "./repository";

export function useStatefulRepository<V extends ModelView>(
	statifiableModel: StatifiableModel<V, RepositoryModelInteraction>
) {
	const model = useTransformedStatefulInteractiveModel(statifiableModel);
	const { interact } = model;

	useEffect(() => {
		interact({ type: RepositoryInteractionType.RETRIEVE });
	}, [interact]);

	return model;
}
