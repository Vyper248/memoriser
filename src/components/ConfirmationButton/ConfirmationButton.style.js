import styled from "styled-components";

const StyledConfirmationButton = styled.div`
    display: inline-block;
    margin: 2px;

    & > div {
        width: 100%;
        height: auto;
    }

    & #icon > button {
        margin: 0px;
        width: 100%;
    }

    & > div > #menu {
        flex-direction: row;
    }
`;

export default StyledConfirmationButton
