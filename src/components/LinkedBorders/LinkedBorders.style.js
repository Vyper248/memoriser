import styled from 'styled-components';

const StyledLinkedBorders = styled.div`
    display: inline-flex;
    height: ${props => props.height};

    & > * {
        border: 1px solid #DDD;
        border-right: none;
        display: flex;
        align-items: center;
        padding: 5px;
    }

    & > *:first-child {
        border-radius: 5px 0px 0px 5px;
    }

    & > *:last-child {
        border-radius: 0px 5px 5px 0px;
        border-right: 1px solid #DDD;
    }


`

export default StyledLinkedBorders;