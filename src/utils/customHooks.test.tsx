import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useEnterListener } from "./customHooks";

const mockCallback = jest.fn();

const MockComponent = () => {
    useEnterListener('testId', mockCallback);

    return (
        <input type='text' id='testId' autoFocus/>
    );
}

it('Allows user to press Enter instead of clicking a button', () => {
    render(<MockComponent/>);
    const input = screen.getByRole('textbox');
    fireEvent.keyPress(input, {key: 'Enter'});
    expect(mockCallback).toBeCalled();

});

it('Hook doesnt do anything when other keys are pressed', () => {
    render(<MockComponent/>);
    const input = screen.getByRole('textbox');
    fireEvent.keyPress(input, {key: 'Space'});
    fireEvent.keyPress(input, {key: 'B'});
    fireEvent.keyPress(input, {key: '5'});
    expect(mockCallback).not.toBeCalled();
});