import { ReadonlyModel } from "@mvc-react/mvc";

export type SiteSectionModel = ReadonlyModel<SiteSectionModelView>;

export interface SiteSectionModelView {
	readonly sectionName: string;
	readonly sectionTitle: string;
}
