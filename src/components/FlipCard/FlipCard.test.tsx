import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import FlipCard from './FlipCard'

test('Loads card and displays question, answer and buttons', () => {
    render(<FlipCard card={{id: '1', groupId: '1', question: 'Hello?', answer: 'World', points: 0}} 
                                onCorrect={()=>{}} onFail={()=>{}}
                                onEdit={()=>{}} onDelete={()=>{}}/>);

    let questionDiv = screen.getByText('Hello?');
    expect(questionDiv).toBeInTheDocument();

    let answerDiv = screen.getByText('World');
    expect(answerDiv).toBeInTheDocument();

    let correctButton = screen.getByText('Correct');
    expect(correctButton).toBeInTheDocument();

    let incorrectButton = screen.getByText('Incorrect');
    expect(incorrectButton).toBeInTheDocument();
});