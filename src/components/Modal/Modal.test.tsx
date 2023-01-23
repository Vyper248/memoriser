import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import Modal from './Modal'

it('Loads element without crashing', () => {
    render(<Modal open={true}>
        <h1>Heading</h1>
    </Modal>);

    let heading = screen.getByText('Heading');
    expect(heading).toBeInTheDocument();
});