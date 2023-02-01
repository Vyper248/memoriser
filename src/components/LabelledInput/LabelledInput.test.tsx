import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import LabelledInput from './LabelledInput'

it('Loads element without crashing', () => {
    render(<LabelledInput label='test' value='val' onChange={()=>{}}/>);
});

it('Shows the input and label', () => {
    render(<LabelledInput label='test' value='val' onChange={()=>{}}/>);

    let input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('val');

    let label = screen.getByText('test');
    expect(label).toBeInTheDocument();
});

it('Calls the onChange function when input is changed', () => {
    let mockChange = jest.fn();
    render(<LabelledInput label='test' value='val' onChange={mockChange}/>);

    let input = screen.getByRole('textbox');
    fireEvent.change(input, {target: {value: 'hello'}});
    expect(mockChange).toBeCalled();
});