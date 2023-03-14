import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import Instructions from "./Instructions"

it("Loads element without crashing and displays instructions", () => {
	render(<Instructions visible={true}/>);

	screen.getByRole('heading', {level: 2});
	screen.getByText('Groups');
	screen.getByText('Cards');
	screen.getByText('Sharing');
	screen.getByText('Filters');
	screen.getByText('Timer');
	screen.getByText('Points');
	screen.getByText('0 Points (Red)');
	screen.getByText('1-4 Points (Orange)');
	screen.getByText('5+ Points (Green)');
});
