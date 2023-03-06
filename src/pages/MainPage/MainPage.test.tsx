import {fireEvent, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import MainPage from './MainPage'
import { getBasicMockState, render } from '../../utils/test.utils';

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

const mockState = getBasicMockState({cards: mockCards});

it('Loads element without crashing', () => {
    render(<MainPage groups={mockGroups} setGroups={mockSetGroups}/>, mockState);
});

it('Shows the heading', () => {
    render(<MainPage groups={mockGroups} setGroups={mockSetGroups}/>, mockState);

    let heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Learn with Cards');
});

it('Shows the GroupSelect component', () => {
    render(<MainPage groups={mockGroups} setGroups={mockSetGroups}/>, mockState);

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
    render(<MainPage groups={mockGroups} setGroups={mockSetGroups}/>, mockState);

    let newCardButton = screen.getByText('New Card');
    expect(newCardButton).toBeInTheDocument();
});

it('Shows the cards', () => {
    render(<MainPage groups={mockGroups} setGroups={mockSetGroups}/>, mockState);

    let card1 = screen.getByText('Question');
    expect(card1).toBeInTheDocument();

    let card2 = screen.getByText('Second Question');
    expect(card2).toBeInTheDocument();
});

it('Creates a new card when clicking the New Card button', () => {
    const mockState = getBasicMockState({cards: []});
    render(<MainPage groups={mockGroups} setGroups={mockSetGroups}/>, mockState);

    let newCardButton = screen.getByText('New Card');
    fireEvent.click(newCardButton);

    const newCardQuestion = screen.getByRole('textbox', { name: 'question' });
    const newCardAnswer = screen.getByRole('textbox', { name: 'answer' });

    expect(newCardQuestion).toBeInTheDocument();
    expect(newCardAnswer).toBeInTheDocument();
});