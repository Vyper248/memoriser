import * as redux from '../../redux/hooks';
import {fireEvent, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import FilterMenu from "./FilterMenu"

import { render } from "../../utils/test.utils";
import { setFilter } from '../../redux/mainSlice';

test("Loads element without crashing", () => {
	render(<FilterMenu/>);

	screen.getByRole('button', { name: 'Clear Filter'});
	screen.getByRole('button', { name: 'Show Orange'});
	screen.getByRole('button', { name: 'Show Red'});
	screen.getByRole('button', { name: 'Show Green'});
});

describe('Testing dispatch functions', () => {
	const useDispatchSpy = jest.spyOn(redux, 'useAppDispatch'); 
    const mockDispatchFn = jest.fn();

	beforeEach(() => {
        useDispatchSpy.mockClear();
        useDispatchSpy.mockReturnValue(mockDispatchFn);
    });

	it('Calls setFilter correctly when clicking buttons', () => {
		render(<FilterMenu/>);

		let orangeButton = screen.getByRole('button', { name: 'Show Orange' });
		fireEvent.click(orangeButton);
		expect(mockDispatchFn).toBeCalledWith(setFilter({type: 'color', color: 'orange'}));

		let redButton = screen.getByRole('button', { name: 'Show Red' });
		fireEvent.click(redButton);
		expect(mockDispatchFn).toBeCalledWith(setFilter({type: 'color', color: 'red'}));

		let green = screen.getByRole('button', { name: 'Show Green' });
		fireEvent.click(green);
		expect(mockDispatchFn).toBeCalledWith(setFilter({type: 'color', color: 'green'}));

		let clearButton = screen.getByRole('button', { name: 'Clear Filter' });
		fireEvent.click(clearButton);
		expect(mockDispatchFn).toBeCalledWith(setFilter({type: 'none'}));
	});
});