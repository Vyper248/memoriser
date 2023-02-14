import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import ImportMenu from "./ImportMenu"

import type { Card, Group } from '../../types';

beforeEach(() => {
	localStorage.removeItem('memoriser-data-groups');
	localStorage.removeItem('memoriser-data-cards');
});

it("Loads element without crashing", () => {
	const mockCards = [{id: '1', groupId: '2'}] as Card[];
	const mockGroups = [{id: '1'}] as Group[];
	const currentGroup = mockGroups[0];

	render(<ImportMenu cards={mockCards} groups={mockGroups} currentGroup={currentGroup}/>);
});

it('Shows correct elements', () => {
	localStorage.setItem('memoriser-data-groups', JSON.stringify([{id: '2', name: 'test group'}]));
	localStorage.setItem('memoriser-data-cards', JSON.stringify([{id: '1', groupId: '2', question: 'test card'}]));

	const mockCards = [{id: '1', groupId: '2'}] as Card[];
	const mockGroups = [{id: '1'}] as Group[];
	const currentGroup = mockGroups[0];

	render(<ImportMenu cards={mockCards} groups={mockGroups} currentGroup={currentGroup}/>);

	let backBtn = screen.getByText("Back to your groups");
	expect(backBtn).toBeInTheDocument();

	let addBtn = screen.getByText("Add All");
	expect(addBtn).toBeInTheDocument();

	let mergeBtn = screen.getByText("Merge All");
	expect(mergeBtn).toBeInTheDocument();

	let mergeGroupLabel = screen.getByText("Merge Selected Group With");
	expect(mergeGroupLabel).toBeInTheDocument();

	let goBtn = screen.getByText("Go");
	expect(goBtn).toBeInTheDocument();

	let localGroupSelect = screen.getByText('test group');
	expect(localGroupSelect).toBeInTheDocument();
});

it('Doesnt show merge elements if no local groups', () => {
	const mockCards = [{id: '1', groupId: '2'}] as Card[];
	const mockGroups = [{id: '1'}] as Group[];
	const currentGroup = mockGroups[0];

	render(<ImportMenu cards={mockCards} groups={mockGroups} currentGroup={currentGroup}/>);

	let backBtn = screen.getByText("Back to your groups");
	expect(backBtn).toBeInTheDocument();

	let addBtn = screen.getByText("Add All");
	expect(addBtn).toBeInTheDocument();

	let mergeBtn = screen.queryByText("Merge All");
	expect(mergeBtn).not.toBeInTheDocument();

	let mergeGroupLabel = screen.queryByText("Merge Selected Group With");
	expect(mergeGroupLabel).not.toBeInTheDocument();

	let goBtn = screen.queryByText("Go");
	expect(goBtn).not.toBeInTheDocument();
});

it('Shows local groups if there are any', () => {
	localStorage.setItem('memoriser-data-groups', JSON.stringify([{id: '2', name: 'test group'}, {id: '3', name: 'other group'}]));
	localStorage.setItem('memoriser-data-cards', JSON.stringify([{id: '1', groupId: '2', question: 'test card'}]));

	const mockCards = [{id: '1', groupId: '2'}] as Card[];
	const mockGroups = [{id: '1'}] as Group[];
	const currentGroup = mockGroups[0];

	render(<ImportMenu cards={mockCards} groups={mockGroups} currentGroup={currentGroup}/>);

	let localGroupSelect = screen.getByText('test group');
	expect(localGroupSelect).toBeInTheDocument();

	let localGroupSelect2 = screen.getByText('other group');
	expect(localGroupSelect2).toBeInTheDocument();
});