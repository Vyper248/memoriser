import {render, screen} from '@testing-library/react'
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