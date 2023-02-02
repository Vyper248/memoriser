import styled from 'styled-components';

const StyledGroupSelect = styled.div`
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
`

export default StyledGroupSelect;