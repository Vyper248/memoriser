import styled from "styled-components";

const StyledDropdown = styled.div`
    position: relative;
    padding: 0px;
    height: 35px;
    border: 1px solid #DDD;

    & > select {
        appearance: none;
        border: none;
        position: relative;
        border-radius: 5px;
        margin: 0px;
        height: 100%;
        padding-right: 25px;
        padding-left: 5px;
    }

    &::after {
        content: '';
        position: absolute;
        top: calc(50% - 2px);
        right: 8px;
        width: 6px;
        height: 6px;
        transform: translate(0px, -50%) rotate(45deg);
        border: 1px solid black;
        border-top: none;
        border-left: none;
        pointer-events: none;
    }
`;

export default StyledDropdown
