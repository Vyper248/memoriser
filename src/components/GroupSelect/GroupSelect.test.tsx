import {fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { render, getBasicMockState } from '../../utils/test.utils';
import GroupSelect from './GroupSelect'

const mockGroups = [
    {
        id: '1',
        name: 'Group1',
    },
    {
        id: '2',
        name: 'Group2',
    }
];

let mockState = getBasicMockState({selectedGroup: mockGroups[0], groups: mockGroups, cards: []});

describe('The component shows the correct elements', () => {
    it('Loads element without crashing and selects correct starting value', () => {
        render(<GroupSelect/>, mockState);
    
        let element = screen.getByRole('option', {name: 'Group1'}) as HTMLSelectElement;
        expect(element).toBeInTheDocument();
        expect(element.value).toBe('1');
    });
    
    it('Displays the correct number of options in the input', () => {
        render(<GroupSelect/>, mockState);
        expect(screen.getAllByRole('option').length).toBe(2);
    });

    it('Changes group when selecting a different group', () => {
        render(<GroupSelect/>, mockState);

        let optionsBefore = screen.getAllByRole('option') as HTMLOptionElement[];
        expect(optionsBefore[0].selected).toBeTruthy();
        expect(optionsBefore[1].selected).toBeFalsy();

        let groupSelect = screen.getByRole('combobox');
        fireEvent.change(groupSelect, { target: { value: '2' } });

        let options = screen.getAllByRole('option') as HTMLOptionElement[];
        expect(options[0].selected).toBeFalsy();
        expect(options[1].selected).toBeTruthy();
    });
    
    it('Includes new/edit/delete buttons', () => {
        render(<GroupSelect/>, mockState);
    
        let button = screen.getByText('New Group');
        expect(button).toBeInTheDocument();
    
        let button2 = screen.getByText('Edit Group');
        expect(button2).toBeInTheDocument();
    
        let button3 = screen.getByText('Delete Group');
        expect(button3).toBeInTheDocument();
    });

    it("Doesn't include option buttons when viewing shared link", () => {
        let mockState = getBasicMockState({viewingShared: true});
        render(<GroupSelect/>, mockState);
    
        let button = screen.queryByText('New Group');
        expect(button).toBeNull();
    
        let button2 = screen.queryByText('Edit Group');
        expect(button2).toBeNull();
    
        let button3 = screen.queryByText('Delete Group');
        expect(button3).toBeNull();
    });
});

describe('The component menu buttons work as expected', () => {
    it('Creates a new group when clicking the New Group button', () => {
        render(<GroupSelect/>, mockState);
    
        let newGroupButton = screen.getByText('New Group');
        fireEvent.click(newGroupButton);

        let newGroupInput = screen.getByRole('textbox');
        fireEvent.change(newGroupInput, {target: {value: 'test'}});
        fireEvent.submit(newGroupInput);

        screen.getByRole('option', { name: 'test' });
    });

    it('Deletes a group when clicking Delete Group button and confirming', () => {
        render(<GroupSelect/>, mockState);

        let deletePopupConfirm = screen.getByText('Confirm');
        expect(deletePopupConfirm).toBeInTheDocument();

        fireEvent.click(deletePopupConfirm);

        let groupOption = screen.queryByRole('option', { name: 'Group1' });
        expect(groupOption).toBeFalsy();
    });

    it('Doesnt delete a group when clicking Delete Group button and cancelling', () => {
        render(<GroupSelect/>, mockState);
    
        let deleteButtonCancel = screen.getByText('Cancel');
        expect(deleteButtonCancel).toBeInTheDocument();

        fireEvent.click(deleteButtonCancel);
        let groupOption = screen.queryByRole('option', { name: 'Group1' });
        expect(groupOption).toBeTruthy();
    });

    it('Edits a group when clicking Edit Group button', async () => {
        render(<GroupSelect/>, mockState);
    
        let editGroupButton = screen.getByText('Edit Group');
        fireEvent.click(editGroupButton);

        let editGroupInput = screen.getByRole('textbox');
        fireEvent.change(editGroupInput, {target: {value: 'edit'}});
        fireEvent.submit(editGroupInput);

        screen.getByRole('option', { name: 'edit' });
        let oldGroup = screen.queryByRole('option', { name: 'Group1' });
        expect(oldGroup).toBeFalsy();
    });
});