import styled from 'styled-components';

const StyledSquareGrid = styled.div`
    display: grid;
    width: ${props => props.width};
    grid-template-columns: repeat(auto-fill, ${props => props.size}px);
    grid-template-rows: repeat(auto-fill, ${props => props.size}px);
    padding: 10px;
    ${props => props.fillGaps ? 'grid-auto-flow: dense;' : ''}

    & > div {
        padding: 5px;
        border: 1px solid black;
        min-width: ${props => props.size}px;
        min-height: ${props => props.size}px;
    }

    & > .large {
        grid-column: span 3;
        grid-row: span 3;
        width: ${props => props.size*3}px;
        height: ${props => props.size*3}px;
    }

    & > .medium {
        grid-column: span 2;
        grid-row: span 2;
        width: ${props => props.size*2}px;
        height: ${props => props.size*2}px;
    }

    & > .small {
        grid-column: span 1;
        grid-row: span 1;
        width: ${props => props.size}px;
        height: ${props => props.size}px;
    }
`

export default StyledSquareGrid;