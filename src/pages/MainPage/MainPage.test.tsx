import {fireEvent, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import MainPage from './MainPage'
import { render } from '../../utils/test.utils';

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

const mockSetGroups = jest.fn();
const mockSetCards = jest.fn();

it('Loads element without crashing', () => {
    render(<MainPage cards={mockCards} groups={mockGroups} setCards={mockSetCards} setGroups={mockSetGroups}/>);
});

it('Shows the heading', () => {
    render(<MainPage cards={mockCards} groups={mockGroups} setCards={mockSetCards} setGroups={mockSetGroups}/>);

    let heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Learn with Cards');
});

it('Shows the GroupSelect component', () => {
    render(<MainPage cards={mockCards} groups={mockGroups} setCards={mockSetCards} setGroups={mockSetGroups}/>);

    let element = screen.getByRole('option', {name: 'Group 1'}) as HTMLSelectElement;
    expect(element).toBeInTheDocument();
    expect(element.value).toBe('1');

    let newGroupButton = screen.getByText('New Group');
    expect(newGroupButton).toBeInTheDocument();

    let editGroupButton = screen.getByText('Edit Group');
    expect(editGroupButton).toBeInTheDocument();

    let deleteGroupButton = screen.getByText('Delete Group');
    expect(deleteGroupButton).toBeInTheDocument();
});

it('Shows the New Card button', () => {
    render(<MainPage cards={mockCards} groups={mockGroups} setCards={mockSetCards} setGroups={mockSetGroups}/>);

    let newCardButton = screen.getByText('New Card');
    expect(newCardButton).toBeInTheDocument();
});

it('Shows the cards', () => {
    render(<MainPage cards={mockCards} groups={mockGroups} setCards={mockSetCards} setGroups={mockSetGroups}/>);

    let card1 = screen.getByText('Question');
    expect(card1).toBeInTheDocument();

    let card2 = screen.getByText('Second Question');
    expect(card2).toBeInTheDocument();
});

it('Creates a new card when clicking the New Card button', () => {
    render(<MainPage cards={mockCards} groups={mockGroups} setCards={mockSetCards} setGroups={mockSetGroups}/>);

    let newCardButton = screen.getByText('New Card');
    fireEvent.click(newCardButton);
    expect(mockSetCards).toBeCalled();
});