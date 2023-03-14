import styled from 'styled-components';

const StyledPopupMenu = styled.div`
    display: inline-flex;
    position: relative;
    width: 40px;
    height: 35px;
    padding: 0px;

    & > #icon {
        display: flex;
        padding: 0px;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: ${props => props.iconSize};

        :hover {
            background-color: #EEE;
        }  
    }

    & > #menu {
        position: absolute;
        border: 1px solid #DDD;
        background-color: white;
        border-radius: 5px;
        padding: 5px;
        width: ${props => props.width};
        max-width: calc(100vw - 10px);
        top: calc(100% + 8px);
        left: 50%;
        display: flex;
        flex-direction: column;
        transform: translateX(-50%) translateX(${props => props.menuAdjust}px);
        scale: ${props => props.open ? '1' : '0.01' };
        opacity: ${props => props.open ? '1' : '0'};
        transition: scale 0.3s, opacity 0.3s;
        transform-origin: top left;
        z-index: 2;

        &::after {
            content: '';
            border: 1px solid #DDD;
            border-right: none;
            border-bottom: none;
            background-color: white;
            position: absolute;
            top: -5px;
            left: 50%;
            width: 8px;
            height: 8px;
            transform: translateX(-50%) translateX(${props => -props.menuAdjust}px) rotate(45deg);
        }
    }
`

export default StyledPopupMenu;