import {fireEvent, render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import FlipCard from './FlipCard'

it('Loads card and displays question, answer and buttons', () => {
    render(<FlipCard card={{id: '1', groupId: '1', question: 'Hello?', answer: 'World', points: 0}} 
                                viewingShared={false} onCorrect={()=>{}} onFail={()=>{}}
                                onEdit={()=>{}} onDelete={()=>{}} onSelect={()=>{}}/>);

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
    render(<FlipCard card={{id: '1', groupId: '1', question: 'Hello?', answer: 'World', points: 0}} 
                                viewingShared={true} onCorrect={()=>{}} onFail={()=>{}}
                                onEdit={()=>{}} onDelete={()=>{}} onSelect={()=>{}}/>);

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
    render(<FlipCard card={{id: '1', groupId: '1', question: 'Hello?', answer: 'World', points: 5}} 
                                viewingShared={true} onCorrect={()=>{}} onFail={()=>{}}
                                onEdit={()=>{}} onDelete={()=>{}} onSelect={()=>{}}/>);

    let points = screen.queryByText('5 points');
    expect(points).toBeTruthy();
});

it('Dont display number of points if 0', () => {
    render(<FlipCard card={{id: '1', groupId: '1', question: 'Hello?', answer: 'World', points: 0}} 
                                viewingShared={true} onCorrect={()=>{}} onFail={()=>{}}
                                onEdit={()=>{}} onDelete={()=>{}} onSelect={()=>{}}/>);

    let points = screen.queryByText('points');
    expect(points).toBeFalsy();
});

it('Displays time to next point', () => {
    let time = new Date().getTime();
    render(<FlipCard size='large' card={{id: '1', groupId: '1', question: 'Hello?', answer: 'World', points: 0, lastChecked: time, lastCheckingPeriod: '1 Hour'}} 
                                viewingShared={true} onCorrect={()=>{}} onFail={()=>{}}
                                onEdit={()=>{}} onDelete={()=>{}} onSelect={()=>{}}/>);

    let points = screen.queryByText('Check after 59m for another point');
    expect(points).toBeTruthy();
});

it('Displays text to check for another point if ready', () => {
    let time = new Date().getTime() - 3800000;
    render(<FlipCard size='large' card={{id: '1', groupId: '1', question: 'Hello?', answer: 'World', points: 0, lastChecked: time, lastCheckingPeriod: '1 Hour'}} 
                                viewingShared={true} onCorrect={()=>{}} onFail={()=>{}}
                                onEdit={()=>{}} onDelete={()=>{}} onSelect={()=>{}}/>);

    let points = screen.queryByText('Check now for another point!');
    expect(points).toBeTruthy();
});

it('Displays the edit menu when clicking the edit button', () => {
    let mockDelete = jest.fn();

    render(<FlipCard size='large' card={{id: '1', groupId: '1', question: 'Hello?', answer: 'World', points: 0}} 
                                viewingShared={false} onCorrect={()=>{}} onFail={()=>{}}
                                onEdit={()=>{}} onDelete={mockDelete} onSelect={()=>{}}/>);

    let editButton = screen.getByTitle('Edit');
    fireEvent.click(editButton);

    screen.getByText('Save');
    screen.getAllByText('Cancel');
    screen.getByText('Delete');
});

it('Calls the delete function when pressing the confirm delete button', () => {
    let mockDelete = jest.fn();

    render(<FlipCard size='large' card={{id: '1', groupId: '1', question: 'Hello?', answer: 'World', points: 0}} 
                                viewingShared={false} onCorrect={()=>{}} onFail={()=>{}}
                                onEdit={()=>{}} onDelete={mockDelete} onSelect={()=>{}}/>);

    let editButton = screen.getByTitle('Edit');
    fireEvent.click(editButton);

    let confirmDeleteButton = screen.getByText('Confirm');
    fireEvent.click(confirmDeleteButton);
    expect(mockDelete).toBeCalled();
});

it('Calls the save function when pressing the confirm delete button', () => {
    let mockEdit = jest.fn();

    render(<FlipCard size='large' card={{id: '1', groupId: '1', question: 'Hello?', answer: 'World', points: 0}} 
                                viewingShared={false} onCorrect={()=>{}} onFail={()=>{}}
                                onEdit={mockEdit} onDelete={()=>{}} onSelect={()=>{}}/>);

    let editButton = screen.getByTitle('Edit');
    fireEvent.click(editButton);

    let saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    expect(mockEdit).toBeCalled();
});

it('Calls the onCorrect function when clicking the Correct button', () => {
    let mockCorrect = jest.fn();

    render(<FlipCard size='large' card={{id: '1', groupId: '1', question: 'Hello?', answer: 'World', points: 0}} 
                                viewingShared={false} onCorrect={mockCorrect} onFail={()=>{}}
                                onEdit={()=>{}} onDelete={()=>{}} onSelect={()=>{}}/>);

    let correctButton = screen.getByText('Correct');
    fireEvent.click(correctButton);
    expect(mockCorrect).toBeCalled();
});

it('Calls the onFail function when clicking the Incorrect button', () => {
    let mockFail = jest.fn();

    render(<FlipCard size='large' card={{id: '1', groupId: '1', question: 'Hello?', answer: 'World', points: 0}} 
                                viewingShared={false} onCorrect={()=>{}} onFail={mockFail}
                                onEdit={()=>{}} onDelete={()=>{}} onSelect={()=>{}}/>);

    let incorrectButton = screen.getByText('Incorrect');
    fireEvent.click(incorrectButton);
    expect(mockFail).toBeCalled();
});