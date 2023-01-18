import React, { ReactNode } from 'react';
import StyledSquareGrid from './SquareGrid.style';

type SquareGridProps = {
    children: ReactNode;
    width?: string;
    size?: number;
    fillGaps?: boolean;
}

const SquareGrid = ({children, width='100%', size=100, fillGaps=true}: SquareGridProps) => {
    return (
        <StyledSquareGrid width={width} size={size} fillGaps={fillGaps}>
            { children }
        </StyledSquareGrid>
    );
}

export default SquareGrid;