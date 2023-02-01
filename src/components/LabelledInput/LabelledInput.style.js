import styled from 'styled-components';

const StyledLabelledInput = styled.div`
    margin-bottom: 5px;

    & > label {
        background-color: #DDD;
        display: inline-flex;
        width: ${props => props.labelWidth};
        padding-right: 5px;
        padding-left: 5px;
        height: 30px;
        vertical-align: bottom;
        align-items: center;
        justify-content: right;
        border-radius: 5px 0px 0px 5px;
        font-size: 0.9em;
    }

    & > input {
        height: 30px;
        border-radius: 0px 5px 5px 0px;
        border: 1px solid #DDD;
        border-left: none;
        padding-left: 5px;

        :focus {
            outline: none;
            border: 1px solid #8DF;
        }
    }
`

export default StyledLabelledInput;