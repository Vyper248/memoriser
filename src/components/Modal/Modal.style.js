import styled from 'styled-components';

const StyledModal = styled.div`
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    ${props => props.open ? '' : 'pointer-events: none;'}

    & > #darken {
        position: absolute;
        top: 0px;
        left: 0px;
        background-color: black;
        width: 100vw;
        height: 100vh;
        transition: 0.3s;
        ${props => props.open ? 'opacity: 0.4' : 'opacity: 0.0'};
    }

    & > #content {
        background-color: white;
        border: 1px solid gray;
        padding: 10px;
        border-radius: 10px;
        z-index: 3;
        transition: 0.3s;
        ${props => props.open ? 'transform: scale(1);' : 'transform: scale(0);'};
    }
`

export default StyledModal;