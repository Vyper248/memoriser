import {fireEvent, render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import Button from './Button'

it('Loads element without crashing', () => {
    render(<Button value='test' onClick={()=>{}}/>);

    let element = screen.getByText('test');
    expect(element).toBeInTheDocument();
});

it('Calls the onClick function when clicking', () => {
    const mockFn = jest.fn();
    render(<Button value='test' onClick={mockFn}/>);

    let element = screen.getByText('test');
    expect(element).toBeInTheDocument();

    fireEvent.click(element);
    expect(mockFn).toBeCalled();
});