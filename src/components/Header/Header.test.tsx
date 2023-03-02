import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import Header from './Header'

it('Loads element without crashing and displays text', () => {
    render(<Header text="Header Text"/>);

    let element = screen.getByText('Header Text');
    expect(element).toBeInTheDocument();
});