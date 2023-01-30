import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useEnterListener, useClickOutside } from "./customHooks";

let mockCallback = jest.fn();

// useEnterListener =====================================================

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
    expect(mockCallback).toHaveBeenCalledTimes(1);
});

it('Hook doesnt do anything when other keys are pressed', () => {
    render(<MockComponent/>);
    const input = screen.getByRole('textbox');
    fireEvent.keyPress(input, {key: 'Space'});
    fireEvent.keyPress(input, {key: 'B'});
    fireEvent.keyPress(input, {key: '5'});
    expect(mockCallback).not.toBeCalled();
});

// onClickOutside =====================================================

const MockComponent2 = ({open}: {open: boolean}) => {
    const ref = useClickOutside<HTMLDivElement>(mockCallback, open);

    return (
        <div>
            <div ref={ref}>

            </div>
            <div role='outside'>

            </div>
        </div>
    )
}

it('Allows user to click outside and run a callback', () => {
    render(<MockComponent2 open={true}/>);
    const outside = screen.getByRole('outside');
    expect(outside).toBeInTheDocument();
    fireEvent.click(outside);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    fireEvent.click(outside);
    expect(mockCallback).toHaveBeenCalledTimes(2);
});

it('Does not do anything when menu is not open', () => {
    render(<MockComponent2 open={false}/>);
    const outside = screen.getByRole('outside');
    expect(outside).toBeInTheDocument();
    fireEvent.click(outside);
    expect(mockCallback).not.toHaveBeenCalled();
});