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

test('Loads element without crashing and selects correct starting value', () => {
    render(<GroupSelect groups={mockGroups} currentGroup={mockGroups[0]} onChange={()=>{}} onAdd={()=>{}}/>);

    let element = screen.getByRole('select') as HTMLSelectElement;
    expect(element).toBeInTheDocument();
    expect(element.value).toBe('1');
});

test('Includes new group button', () => {
    render(<GroupSelect groups={mockGroups} currentGroup={mockGroups[0]} onChange={()=>{}} onAdd={()=>{}}/>);

    let button = screen.getByText('New Group');
    expect(button).toBeInTheDocument();
});