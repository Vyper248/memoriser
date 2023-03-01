import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useClickOutside, useResizeListener, useScrollListener } from "./customHooks";

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