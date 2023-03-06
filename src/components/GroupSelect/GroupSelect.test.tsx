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

let mockState = getBasicMockState({selectedGroup: mockGroups[0]});

describe('The component shows the correct elements', () => {
    it('Loads element without crashing and selects correct starting value', () => {
        render(<GroupSelect groups={mockGroups} cards={[]} onChange={()=>{}} onAdd={()=>{}} onEdit={()=>{}} onDelete={()=>{}}/>, mockState);
    
        let element = screen.getByRole('option', {name: 'Group1'}) as HTMLSelectElement;
        expect(element).toBeInTheDocument();
        expect(element.value).toBe('1');
    });
    
    it('Displays the correct number of options in the input', () => {
        render(<GroupSelect groups={mockGroups} cards={[]} onChange={()=>{}} onAdd={()=>{}} onEdit={()=>{}} onDelete={()=>{}}/>, mockState);
        expect(screen.getAllByRole('option').length).toBe(2);
    });
    
    it('Includes new/edit/delete buttons', () => {
        render(<GroupSelect groups={mockGroups} cards={[]} onChange={()=>{}} onAdd={()=>{}} onEdit={()=>{}} onDelete={()=>{}}/>, mockState);
    
        let button = screen.getByText('New Group');
        expect(button).toBeInTheDocument();
    
        let button2 = screen.getByText('Edit Group');
        expect(button2).toBeInTheDocument();
    
        let button3 = screen.getByText('Delete Group');
        expect(button3).toBeInTheDocument();
    });

    it("Doesn't include option buttons when viewing shared link", () => {
        let mockState = getBasicMockState({viewingShared: true, selectedGroup: mockGroups[0]});
        render(<GroupSelect groups={mockGroups} cards={[]} onChange={()=>{}} onAdd={()=>{}} onEdit={()=>{}} onDelete={()=>{}}/>, mockState);
    
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
        let mockSetGroups = jest.fn();
        render(<GroupSelect groups={mockGroups} cards={[]} onChange={()=>{}} onAdd={mockSetGroups} onEdit={()=>{}} onDelete={()=>{}}/>, mockState);
    
        let newGroupButton = screen.getByText('New Group');
        fireEvent.click(newGroupButton);

        let newGroupInput = screen.getByRole('textbox');
        fireEvent.change(newGroupInput, {target: {value: 'test'}});
        fireEvent.submit(newGroupInput);

        expect(mockSetGroups).toBeCalledWith(expect.objectContaining({name: 'test'}));
    });

    it('Deletes a group when clicking Delete Group button and confirming', () => {
        let mockDeleteGroups = jest.fn();
        render(<GroupSelect groups={mockGroups} cards={[]} onChange={()=>{}} onAdd={()=>{}} onEdit={()=>{}} onDelete={mockDeleteGroups}/>, mockState);

        let deletePopupConfirm = screen.getByText('Confirm');
        expect(deletePopupConfirm).toBeInTheDocument();

        fireEvent.click(deletePopupConfirm);
        expect(mockDeleteGroups).toBeCalledWith({id: '1', name: 'Group1'});
    });

    it('Doesnt delete a group when clicking Delete Group button and cancelling', () => {
        let mockDeleteGroups = jest.fn();
        render(<GroupSelect groups={mockGroups} cards={[]} onChange={()=>{}} onAdd={()=>{}} onEdit={()=>{}} onDelete={mockDeleteGroups}/>, mockState);
    
        let deleteButtonCancel = screen.getByText('Cancel');
        expect(deleteButtonCancel).toBeInTheDocument();

        fireEvent.click(deleteButtonCancel);
        expect(mockDeleteGroups).not.toBeCalled();
    });

    it('Edits a group when clicking Edit Group button', async () => {
        let mockEditGroup = jest.fn();
        render(<GroupSelect groups={mockGroups} cards={[]} onChange={()=>{}} onAdd={()=>{}} onEdit={mockEditGroup} onDelete={()=>{}}/>, mockState);
    
        let editGroupButton = screen.getByText('Edit Group');
        fireEvent.click(editGroupButton);

        let editGroupInput = screen.getByRole('textbox');
        fireEvent.change(editGroupInput, {target: {value: 'edit'}});
        fireEvent.submit(editGroupInput);

        expect(mockEditGroup).toBeCalledWith({id: '1', name: 'edit'});
    });
});