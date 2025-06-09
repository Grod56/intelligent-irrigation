import { InteractiveModel, ModelInteraction } from "@mvc-react/mvc";
import { ModelView } from "@mvc-react/mvc";

export enum RepositoryInteractionType {
	RETRIEVE,
}

export type RepositoryModelInteraction =
	ModelInteraction<RepositoryInteractionType>;

export type RepositoryModel<
	V extends ModelView,
	I extends RepositoryModelInteraction | ModelInteraction<unknown>
> = InteractiveModel<V, I>;
