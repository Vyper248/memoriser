import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import DropdownMenu from './DropdownMenu'

test('Loads element without crashing', () => {
    render(<DropdownMenu><div></div></DropdownMenu>);
});