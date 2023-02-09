import styled from 'styled-components';

const StyledGridSorter = styled.div`
    position: relative;
    top: 300px;
`

export default StyledGridSorter;

export const StyledGridSquare = styled.div`
    position: absolute;
    transition: 0.3s;
    width: ${props => props.size}px;
    height: ${props => props.size}px;
    padding: 5px;
`;