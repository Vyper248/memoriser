import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import SquareGrid from './SquareGrid'

test('Loads and displays div elements within grid', () => {
    render(<SquareGrid><div>Hello</div></SquareGrid>);

    let helloDiv = screen.getByText('Hello');
    expect(helloDiv).toBeInTheDocument();
});