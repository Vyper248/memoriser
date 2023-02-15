import styled from 'styled-components';

const StyledLinkedBorders = styled.div`
    display: inline-flex;
    height: ${props => props.height};

    & > * {
        border: 1px solid #DDD;
        border-radius: 0px !important;
        border-right: none !important;
        display: flex;
        align-items: center;
        padding: 5px;
        margin: 0px;
    }

    & > *:first-child {
        border-radius: 5px 0px 0px 5px !important;
    }

    & > *:last-child {
        border-radius: 0px 5px 5px 0px !important;
        border-right: 1px solid #DDD !important;
    }


`

export default StyledLinkedBorders;