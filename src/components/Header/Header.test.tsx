import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import Header from './Header'

it('Loads element without crashing', () => {
    render(<Header text="Memoriser"/>);

    let element = screen.getByText('Memoriser');
    expect(element).toBeInTheDocument();
});