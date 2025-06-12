import { ModeledContainerComponent } from "@mvc-react/components";
import { SiteSubsectionModel } from "../site-subsection-model";
import "./site-subsection.scss";

export const ELEMENT_NAME = "site-subsection";

const SiteSubsection = function ({ model, children }) {
	const { subsectionTitle } = model.modelView;

	return (
		<section className={ELEMENT_NAME}>
			<h4 className="title">{subsectionTitle}</h4>
			{children}
		</section>
	);
} as ModeledContainerComponent<SiteSubsectionModel>;

export default SiteSubsection;
