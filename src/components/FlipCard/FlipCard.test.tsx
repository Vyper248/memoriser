import {fireEvent, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import { render, getBasicMockState } from '../../utils/test.utils';
import FlipCard from './FlipCard'
import * as redux from '../../redux/hooks';
import { deleteCard, editCard, cardCorrect, cardIncorrect } from '../../redux/mainSlice';

describe('Testing FlipCard component', () => {
    let mockCard = {id: '1', groupId: '1', question: 'Hello?', answer: 'World', points: 0};

    it('Loads card and displays question, answer and buttons', () => {
        render(<FlipCard card={mockCard}/>);
    
        let questionDiv = screen.getByText('Hello?');
        expect(questionDiv).toBeInTheDocument();
    
        let answerDiv = screen.getByText('World');
        expect(answerDiv).toBeInTheDocument();
    
        let correctButton = screen.getByText('Correct');
        expect(correctButton).toBeInTheDocument();
    
        let incorrectButton = screen.getByText('Incorrect');
        expect(incorrectButton).toBeInTheDocument();
    
        let editButton = screen.getByTitle('Edit');
        expect(editButton).toBeInTheDocument();
    });
    
    it("Displays cancel button instead of normal buttons when viewing shared link", () => {
        let mockState = getBasicMockState({viewingShared: true});
        render(<FlipCard card={mockCard}/>, mockState);
    
        let correctButton = screen.queryByText('Correct');
        expect(correctButton).toBeNull();
    
        let incorrectButton = screen.queryByText('Incorrect');
        expect(incorrectButton).toBeNull();
    
        let editButton = screen.queryByTitle('Edit');
        expect(editButton).toBeNull();
    
        let cancelButton = screen.getByText('Cancel');
        expect(cancelButton).toBeInTheDocument();
    });
    
    it('Displays number of points', () => {
        render(<FlipCard card={{...mockCard, points: 5}}/>);
    
        let points = screen.queryByText('5 points');
        expect(points).toBeTruthy();
    });
    
    it('Dont display number of points if 0', () => {
        render(<FlipCard card={mockCard}/>);
    
        let points = screen.queryByText('points');
        expect(points).toBeFalsy();
    });
    
    it('Displays time to next point', () => {
        let time = new Date().getTime();
        render(<FlipCard size='large' card={{id: '1', groupId: '1', question: 'Hello?', answer: 'World', points: 0, lastChecked: time, lastCheckingPeriod: '1 Hour'}}/>);
    
        let points = screen.queryByText('Check after 59m for another point');
        expect(points).toBeTruthy();
    });
    
    it('Doesnt display time to next point if viewing shared', () => {
        let mockState = getBasicMockState({viewingShared: true});
        render(<FlipCard size='large' card={mockCard}/>, mockState);
    
        let points = screen.queryByText('Check now for another point!');
        expect(points).toBeFalsy();
    });
    
    it('Displays text to check for another point if ready', () => {
        let time = new Date().getTime() - 3800000;
        render(<FlipCard size='large' card={{id: '1', groupId: '1', question: 'Hello?', answer: 'World', points: 0, lastChecked: time, lastCheckingPeriod: '1 Hour'}}/>);
    
        let points = screen.queryByText('Check now for another point!');
        expect(points).toBeTruthy();
    });
    
    it('Displays the edit menu when clicking the edit button', () => {    
        render(<FlipCard size='large' card={mockCard}/>);
    
        let editButton = screen.getByTitle('Edit');
        fireEvent.click(editButton);
    
        screen.getByText('Save');
        screen.getAllByText('Cancel');
        screen.getByText('Delete');
    });
});

describe('Testing redux dispatch functions', () => {
    const useDispatchSpy = jest.spyOn(redux, 'useAppDispatch'); 
    const mockDispatchFn = jest.fn()
    let mockCard = {id: '1', groupId: '1', question: 'Hello?', answer: 'World', points: 0};

    beforeEach(() => {
        useDispatchSpy.mockClear();
        useDispatchSpy.mockReturnValue(mockDispatchFn);
    });

    it('Calls the onCorrect function when clicking the Correct button', () => {
        render(<FlipCard size='large' card={mockCard}/>);
    
        let correctButton = screen.getByText('Correct');
        fireEvent.click(correctButton);

        expect(mockDispatchFn).toHaveBeenCalledWith(cardCorrect(mockCard));
    });

    it('Calls the onFail function when clicking the Incorrect button', () => {
        render(<FlipCard size='large' card={mockCard}/>);
    
        let incorrectButton = screen.getByText('Incorrect');
        fireEvent.click(incorrectButton);

        expect(mockDispatchFn).toHaveBeenCalledWith(cardIncorrect(mockCard));
    });

    it('Calls the delete function when pressing the confirm delete button', () => {    
        render(<FlipCard size='large' card={mockCard}/>);
    
        let editButton = screen.getByTitle('Edit');
        fireEvent.click(editButton);
    
        let confirmDeleteButton = screen.getByText('Confirm');
        fireEvent.click(confirmDeleteButton);

        expect(mockDispatchFn).toHaveBeenCalledWith(deleteCard(mockCard));
    });
    
    it('Calls the save function when pressing the save button', () => {    
        render(<FlipCard size='large' card={mockCard}/>);
        
        let editButton = screen.getByTitle('Edit');
        fireEvent.click(editButton);
    
        let questionInput = screen.getByRole('textbox', { name: 'question' });
        fireEvent.change(questionInput, { target: { value: 'Test' } });
    
        let saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);
    
        expect(mockDispatchFn).toHaveBeenCalledWith(editCard({...mockCard, question: 'Test'}));
    });
});