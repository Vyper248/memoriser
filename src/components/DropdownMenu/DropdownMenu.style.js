import styled from 'styled-components';

const StyledDropdownMenu = styled.div`
    display: inline-block;
    position: relative;
    /* margin: 5px; */

    & > #icon {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 1.5em;

        svg {
            :hover {
                background-color: #EEE;
            }  
        }
    }

    & > #menu {
        position: absolute;
        border: 1px solid #DDD;
        background-color: white;
        border-radius: 5px;
        padding: 5px;
        width: ${props => props.width};
        top: calc(100% + 8px);
        left: 50%;
        display: flex;
        flex-direction: column;
        transform: translateX(-50%);
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
            transform: translateX(-50%) rotate(45deg);
        }
    }
`

export default StyledDropdownMenu;