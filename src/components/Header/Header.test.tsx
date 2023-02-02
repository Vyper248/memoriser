import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import Header from './Header'

import type { Group, Card } from '../../types';

const mockGroups: Group[] = [{
    id: '1',
    name: 'Group 1',
}]

const mockCards: Card[] = [
    {
        id: '1',
        groupId: '1',
        question: 'Question',
        answer: 'Answer',
        points: 0,
    },
    {
        id: '2',
        groupId: '1',
        question: 'Second Question',
        answer: 'Second Answer',
        points: 0,
    }
];

it('Loads element without crashing and displays text', () => {
    render(<Header text="Memoriser" cards={mockCards} groups={mockGroups} currentGroup={mockGroups[0]} viewingShared={false}/>);

    let element = screen.getByText('Memoriser');
    expect(element).toBeInTheDocument();
});

it('Shows share buttons', () => {
    render(<Header text="Memoriser" cards={mockCards} groups={mockGroups} currentGroup={mockGroups[0]} viewingShared={false}/>);

    let shareAllBtn = screen.getByText('Share All');
    expect(shareAllBtn).toBeInTheDocument();
    
    let shareSelectedBtn = screen.getByText('Share Selected Group');
    expect(shareSelectedBtn).toBeInTheDocument();
});

it('Doesn\'t show share buttons when viewing shared link', () => {
    render(<Header text="Memoriser" cards={mockCards} groups={mockGroups} currentGroup={mockGroups[0]} viewingShared={true}/>);

    let shareAllBtn = screen.queryByText('Share All');
    expect(shareAllBtn).toBeNull();
    
    let shareSelectedBtn = screen.queryByText('Share Selected Group');
    expect(shareSelectedBtn).toBeNull();
});