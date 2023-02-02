import styled from 'styled-components';

const StyledDropdownMenu = styled.div`
    display: inline-block;
    position: relative;
    margin: 5px;

    & > #icon {
        cursor: pointer;
        font-size: 1.5em;

        svg {
            margin-bottom: -7px;
            margin-top: -7px;

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
        top: 100%;
        left: 50%;
        display: flex;
        flex-direction: column;
        transform: translateX(-50%);
        scale: ${props => props.open ? '1' : '0.01' };
        opacity: ${props => props.open ? '1' : '0'};
        transition: scale 0.3s, opacity 0.3s;
        transform-origin: top left;
        z-index: 2;

        * {
            margin: 2px;
        }
    }
`

export default StyledDropdownMenu;