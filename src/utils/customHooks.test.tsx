import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useClickOutside, useResizeListener, useScrollListener, useKeyboardControls } from "./customHooks";
import { Card } from '../types';

let mockCallback = jest.fn();

describe('Testing useClickOutside hook', () => {
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
});

describe('Testing useResizeListener hook', () => {
    let mockFn = jest.fn();
    jest.useFakeTimers();

    const MockComponent = () => {
        useResizeListener(mockFn, 300);
        return <div></div>
    }

    it('Calls the function when window resizes', () => {
        render(<MockComponent/>);
        global.dispatchEvent(new Event('resize'));

        //function not called early
        expect(mockFn).not.toBeCalled();

        //fast-forward timer
        jest.runAllTimers();

        //function called after timer
        expect(mockFn).toBeCalled();
    });
});

describe('Testing useScrollListener hook', () => {
    let mockFn = jest.fn();

    const MockComponent = () => {
        useScrollListener(mockFn);
        return <div>Div</div>
    }

    it('Calls the function when scrolling', () => {
        render(<MockComponent/>);

        fireEvent.scroll(document, {target: { scrollY: 400 }});

        expect(mockFn).toBeCalled();
    });
});

describe('Testing useKeyboardControls hook', () => {
    const mockFlip = jest.fn();
    const mockCorrect = jest.fn();
    const mockIncorrect = jest.fn();

    it('Flips when first card and nothing else is flipped', () => {
        const MockComponent = () => {
            useKeyboardControls(true, null, false, false, mockFlip, mockCorrect, mockIncorrect);
            return <div>Component</div>;
        }
    
        render(<MockComponent/>);
    
        let component = screen.getByText('Component');
    
        fireEvent.keyPress(component, { key: 'Enter' });
        expect(mockFlip).toBeCalled();

        //Other keys shouldn't work
        fireEvent.keyPress(component, { key: 'A' });
        expect(mockFlip).toBeCalledTimes(1);
    });

    it('Doesnt flip when another card is already flipped', () => {
        const MockComponent = () => {
            useKeyboardControls(true, {id: '1'} as Card, false, false, mockFlip, mockCorrect, mockIncorrect);
            return <div>Component</div>;
        }
    
        render(<MockComponent/>);
    
        let component = screen.getByText('Component');
    
        fireEvent.keyPress(component, { key: 'Enter' });
        expect(mockFlip).not.toBeCalled();
    });

    it('Allows user to press Enter, y or c to mark as correct if card is flipped', () => {
        const MockComponent = () => {
            useKeyboardControls(true, {id: '1'} as Card, true, false, mockFlip, mockCorrect, mockIncorrect);
            return <div>Component</div>;
        }
    
        render(<MockComponent/>);
    
        let component = screen.getByText('Component');
    
        fireEvent.keyPress(component, { key: 'Enter' });
        expect(mockCorrect).toBeCalledTimes(1);

        fireEvent.keyPress(component, { key: 'y' });
        expect(mockCorrect).toBeCalledTimes(2);

        fireEvent.keyPress(component, { key: 'c' });
        expect(mockCorrect).toBeCalledTimes(3);

        fireEvent.keyPress(component, { key: 't' });
        expect(mockCorrect).toBeCalledTimes(3);

        expect(mockIncorrect).not.toBeCalled();
        expect(mockFlip).not.toBeCalled();
    });

    it('Allows user to press n or i to mark as incorrect if card is flipped', () => {
        const MockComponent = () => {
            useKeyboardControls(true, {id: '1'} as Card, true, false, mockFlip, mockCorrect, mockIncorrect);
            return <div>Component</div>;
        }
    
        render(<MockComponent/>);
    
        let component = screen.getByText('Component');
    
        fireEvent.keyPress(component, { key: 'n' });
        expect(mockIncorrect).toBeCalledTimes(1);

        fireEvent.keyPress(component, { key: 'i' });
        expect(mockIncorrect).toBeCalledTimes(2);

        fireEvent.keyPress(component, { key: 'b' });
        expect(mockIncorrect).toBeCalledTimes(2);

        expect(mockCorrect).not.toBeCalled();
        expect(mockFlip).not.toBeCalled();
    });

    it('Keys dont work if card is in edit mode', () => {
        const MockComponent = () => {
            useKeyboardControls(true, {id: '1'} as Card, true, true, mockFlip, mockCorrect, mockIncorrect);
            return <div>Component</div>;
        }
    
        render(<MockComponent/>);
    
        let component = screen.getByText('Component');
    
        fireEvent.keyPress(component, { key: 'n' });
        expect(mockIncorrect).not.toBeCalled();

        fireEvent.keyPress(component, { key: 'i' });
        expect(mockIncorrect).not.toBeCalled();

        fireEvent.keyPress(component, { key: 'b' });
        expect(mockIncorrect).not.toBeCalled();

        fireEvent.keyPress(component, { key: 'n' });
        expect(mockCorrect).not.toBeCalled();

        fireEvent.keyPress(component, { key: 'i' });
        expect(mockCorrect).not.toBeCalled();

        fireEvent.keyPress(component, { key: 'b' });
        expect(mockCorrect).not.toBeCalled();
    });
});