import styled from 'styled-components';

const StyledGroupSelect = styled.div`
    margin: 5px;

    & > label {
        display: inline-flex;
        align-items: center;
        padding-left: 5px;
        padding-right: 5px;
        border: 1px solid #DDD;
        border-right: none;
        height: 30px;
        vertical-align: bottom;
        border-radius: 5px 0px 0px 5px;
        background-color: #DDD;
    }

    & > select {
        height: 30px;
        border: 1px solid #DDD;
        padding: 4px;
        border-radius: 0px 5px 5px 0px;    

        :hover {
            cursor: pointer;
        }

        :focus {
            outline: none;
        }
    }
`

export default StyledGroupSelect;