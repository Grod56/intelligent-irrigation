import { ReadonlyModel } from "@mvc-react/mvc";

export type SiteSubsectionModel = ReadonlyModel<SiteSubsectionModelView>;

export interface SiteSubsectionModelView extends ContentComponentModelView {
	readonly subsectionTitle: string;
}
