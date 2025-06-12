import { render, screen } from "@testing-library/react";
import SiteSubsection, { ELEMENT_NAME } from "../SiteSubsection";
import { testModel } from "./data";

describe("SiteSubsection", () => {
	const { id, subsectionTitle } = testModel.modelView;
	let componentElement: HTMLElement;

	beforeEach(() => {
		render(
			<SiteSubsection model={testModel}>
				<></>
			</SiteSubsection>,
		);
		componentElement = screen.getByTestId(ELEMENT_NAME);
	});

	it("maps id property to corresponding node", () => {
		expect(componentElement).toHaveAttribute("id", id);
	});
	it("maps subsectionTitle property to corresponding node", () => {
		const subsectionTitleElement = screen.getByText(subsectionTitle);
		expect(subsectionTitleElement).toBeInTheDocument();
	});
});
