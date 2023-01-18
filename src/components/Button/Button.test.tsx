import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import Button from './Button'

test('Loads element without crashing', () => {
    render(<Button value='test' onClick={()=>{}}/>);

    let element = screen.getByText('test');
    expect(element).toBeInTheDocument();
});