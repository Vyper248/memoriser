import styled from 'styled-components';

const StyledButton = styled.button`
    background-color: #8DF;
    border: 1px solid #8DF;
    border-radius: 5px;
    padding: 5px;

    &:hover {
        cursor: pointer;
        filter: brightness(0.9);
    }
`

export default StyledButton;