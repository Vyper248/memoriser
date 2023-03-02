import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import PopupMenu from './PopupMenu'

test('Loads element without crashing', () => {
    render(<PopupMenu icon={<div>Icon</div>}><div>Test Child</div></PopupMenu>);

    screen.getByText('Icon');
    screen.getByText('Test Child');
});