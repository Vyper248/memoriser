import {fireEvent, screen, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";
import ShareMenu from "./ShareMenu"

import * as redux from '../../redux/hooks';
import { importBackup } from "../../redux/mainSlice";

import { getBasicMockState, render } from "../../utils/test.utils";
import { ImportData } from "../../types";
import * as general from '../../utils/general.utils';

it("Loads element without crashing", () => {
	render(<ShareMenu/>);
});

Object.assign(navigator, {
    clipboard: {
      	writeText: () => {},
    },
});

let mockCards = [
	{id: '1', groupId: '1', question: 'hello', answer: 'world'},
	{id: '2', groupId: '2', question: 'second', answer: 'group'}
];

let mockGroups = [
	{id: '1', name: 'test'},
	{id: '2', name: 'test2'}
];

let mockState = getBasicMockState({
	cards: mockCards,
	groups: mockGroups,
	selectedGroup: mockGroups[0]
});

it('Calls the generateURL functions when clicking the Share All button', () => {
	let mockFn = jest.spyOn(general, 'generateURL');

	render(<ShareMenu/>, mockState);

	let shareAllBtn = screen.getByRole('button', { name: 'Share All' });
	fireEvent.click(shareAllBtn);

	expect(mockFn).toBeCalledWith(mockCards, mockGroups);
});

it('Calls the generateURL functions when clicking the Share Selected Groups button', () => {
	let mockFn = jest.spyOn(general, 'generateURL');

	render(<ShareMenu/>, mockState);

	let shareAllBtn = screen.getByRole('button', { name: 'Share Selected Group' });
	fireEvent.click(shareAllBtn);

	expect(mockFn).toBeCalledWith([mockCards[0]], [mockGroups[0]]);
});

describe('Testing dispatch functions', () => {
	const mockUseDispatch = jest.spyOn(redux, 'useAppDispatch');
	const mockDispatch = jest.fn();

	beforeEach(() => {
		mockUseDispatch.mockClear();
		mockUseDispatch.mockReturnValue(mockDispatch);
	});

	it('Dispatches the import data when importing from a backup', async () => {
		render(<ShareMenu/>);

		let mockBackupObj = {
			cards: [{id: '1', groupId: '1'}],
			groups: [{id: '1'}],
		} as ImportData;

		const file = new File([JSON.stringify(mockBackupObj)], "test.json", { type: "application/json" });

		const fileInput = document.querySelector('input[type=file]') as HTMLInputElement;
		expect(fileInput).toBeInTheDocument();
		
		fireEvent.change(fileInput, { target: { files: [file] } });

		expect(fileInput.files).toHaveLength(1);
		expect(fileInput.files![0]).toBe(file);

		await waitFor(() => {
			expect(mockDispatch).toBeCalledWith(importBackup(mockBackupObj));
		});
	});
});