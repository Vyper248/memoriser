import {fireEvent, render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import ConfirmationButton from "./ConfirmationButton"

it("Loads element without crashing and includes required buttons", () => {
	render(<ConfirmationButton value={'Button Text'} onClick={()=>{}}/>);

	screen.getByText('Button Text');
	screen.getByText('Confirm');
	screen.getByText('Cancel');
});

it("Only runs the callback function when clicking the Confirm button", () => {
	const mockFn = jest.fn();
	render(<ConfirmationButton value={'Button Text'} onClick={mockFn}/>);

	const deleteBtn = screen.getByText('Button Text');
	const confirmBtn = screen.getByText('Confirm');
	const cancelBtn = screen.getByText('Cancel');

	fireEvent.click(deleteBtn);
	expect(mockFn).not.toBeCalled();
	
	fireEvent.click(cancelBtn);
	expect(mockFn).not.toBeCalled();

	fireEvent.click(confirmBtn);
	expect(mockFn).toBeCalled();
});
