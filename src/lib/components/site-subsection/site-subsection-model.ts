import { ReadonlyModel } from "@mvc-react/mvc";

export type SiteSubsectionModel = ReadonlyModel<SiteSubsectionModelView>;

export interface SiteSubsectionModelView {
	readonly subsectionTitle: string;
}
