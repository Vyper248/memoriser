import styled from 'styled-components';

const StyledGridSorter = styled.main`
    position: relative;
    top: 300px;
    height: ${props => (props.y+3) * props.gridSize}px;
`

export const StyledGridSquare = styled.div.attrs((props) => {
    let size = props.size+'px';
    return {
        style: {
            width: size,
            height: size
        }
    }
})`
    position: absolute;
    transition: 0.6s;
    padding: 5px;
    left: 0px;
    top: 0px;
`;
    
export default StyledGridSorter;