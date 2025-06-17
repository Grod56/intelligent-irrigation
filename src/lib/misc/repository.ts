import {
	InputModelInteraction,
	InteractiveModel,
	ModelInteraction,
} from "@mvc-react/mvc";

export enum RepositoryInteractionType {
	RETRIEVE,
}

export interface RepositoryModelView {
	isPendingChanges: boolean;
}
export type RepositoryModelInteraction<T extends RepositoryModelView> =
	| ModelInteraction<RepositoryInteractionType>
	| InputModelInteraction<
			"PREPARE_FOR_CHANGES",
			{ currentModelView: T | null }
	  >;

export type RepositoryModel<
	V extends RepositoryModelView,
	I extends RepositoryModelInteraction<V> | ModelInteraction<unknown>
> = InteractiveModel<V, I>;
