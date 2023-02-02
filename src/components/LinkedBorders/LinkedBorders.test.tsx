import React from 'react';
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import LinkedBorders from './LinkedBorders'

test('Loads element without crashing', () => {
    render(<LinkedBorders><div>Hello</div></LinkedBorders>);

    let element = screen.getByText('Hello');
    expect(element).toBeInTheDocument();
});