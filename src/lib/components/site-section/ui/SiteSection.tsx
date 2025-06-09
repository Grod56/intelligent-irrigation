import { ModeledContainerComponent } from "@mvc-react/components";
import { SiteSectionModel } from "../site-section-model";
import "./site-section.scss";

const SiteSection = function ({ model, children }) {
	const { sectionName, sectionTitle } = model.modelView;

	return (
		<section className="site-section" data-sectionname={sectionName}>
			<div className="background-layer">
				<div className="content-layer">
					<h3 className="title">{sectionTitle}</h3>
					<hr />
					{children}
				</div>
			</div>
		</section>
	);
} as ModeledContainerComponent<SiteSectionModel>;

export default SiteSection;
