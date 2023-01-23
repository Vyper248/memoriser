import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import GroupSelect from './GroupSelect'

const mockGroups = [
    {
        id: '1',
        name: 'Group1',
        cards: []
    },
    {
        id: '2',
        name: 'Group2',
        cards: []
    }
];

it('Loads element without crashing and selects correct starting value', () => {
    render(<GroupSelect groups={mockGroups} currentGroup={mockGroups[0]} onChange={()=>{}} onAdd={()=>{}} onEdit={()=>{}} onDelete={()=>{}}/>);

    let element = screen.getByRole('option', {name: 'Group1'}) as HTMLSelectElement;
    expect(element).toBeInTheDocument();
    expect(element.value).toBe('1');
});

it('Displays the correct number of options in the input', () => {
    render(<GroupSelect groups={mockGroups} currentGroup={mockGroups[0]} onChange={()=>{}} onAdd={()=>{}} onEdit={()=>{}} onDelete={()=>{}}/>);
    expect(screen.getAllByRole('option').length).toBe(2);
});

it('Includes new/edit/delete buttons', () => {
    render(<GroupSelect groups={mockGroups} currentGroup={mockGroups[0]} onChange={()=>{}} onAdd={()=>{}} onEdit={()=>{}} onDelete={()=>{}}/>);

    let button = screen.getByText('New Group');
    expect(button).toBeInTheDocument();

    let button2 = screen.getByText('Edit Group');
    expect(button2).toBeInTheDocument();

    let button3 = screen.getByText('Delete Group');
    expect(button3).toBeInTheDocument();
});