import React, { ReactNode } from 'react';
import StyledModal from './Modal.style';

type ModalProps = {
    children: ReactNode;
    open: boolean;
}

const Modal = ({ children, open }: ModalProps) => {
    return (
        <StyledModal open={open}>
            <div id='darken'></div>
            <div id='content'>{ children }</div>
        </StyledModal>
    );
}

export default Modal;