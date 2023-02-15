import {fireEvent, render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import Dropdown from "./Dropdown"

test("Loads element without crashing", () => {
	const onChange = jest.fn();
	render(<Dropdown value={'2'} onChange={onChange} options={[{value: '1', name: 'First'}, {value: '2', name: 'Second'}]}/>);

	let firstEl = screen.getByText('First');
	expect(firstEl).toBeInTheDocument();

	let secondEl = screen.getByText('Second');
	expect(secondEl).toBeInTheDocument();

	const select = screen.getByRole('combobox');
	fireEvent.change(select, { target: { value: '1' } });

	expect(onChange).toBeCalled();
	expect(onChange).toBeCalledWith('1');
});
