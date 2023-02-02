import React, { ReactNode } from 'react';
import StyledLinkedBorders from './LinkedBorders.style';

type LinkedBordersProps = {
    children: ReactNode;
    height?: string;
}

const LinkedBorders = ({children, height='auto'}: LinkedBordersProps) => {
    return (
        <StyledLinkedBorders height={height}>
            { children }
        </StyledLinkedBorders>
    );
}

export default LinkedBorders;