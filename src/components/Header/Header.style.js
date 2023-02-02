import styled from 'styled-components';

const StyledHeader = styled.div`
    h1 {
        display: inline-block;
        margin-right: 10px;
        margin-bottom: 10px;
    }

    & > #warning {
        color: red;
        margin: 0px;
        cursor: pointer;
    }

    & > div {
        position: relative;
        top: -5px;
        font-size: 1.2em;
    }

    & p#copyText {
        font-size: 0.6em;
    }
`

export default StyledHeader;