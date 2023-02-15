import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import Label from "./Label"

test("Loads element without crashing", () => {
	render(<Label value='test'/>);

	let element = screen.getByText("test");
	expect(element).toBeInTheDocument();
});
