import styled from 'styled-components';

const StyledGroupSelect = styled.nav`
    margin: 5px;

    & label {
        padding-left: 5px;
        padding-right: 5px;
        background-color: #DDD;
    }

    & select {
        padding: 4px;

        :hover {
            cursor: pointer;
        }

        :focus {
            outline: none;
        }
    }

    & > #warning {
        color: red;
        margin: 5px;
        cursor: pointer;
    }

    & p#responseMessage {
        font-size: 0.6em;
    }

    hr {
        width: 100%;
    }
`

export default StyledGroupSelect;