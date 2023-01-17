import styled from 'styled-components';

const StyledFlipCard = styled.div`
    position: relative;
    width: ${props => props.width};
    height: ${props => props.height};
    perspective: 1000px;
    cursor: pointer;

    & > div::after {
        content: 'Click Me!';
        position: absolute;
        bottom: 10px;
        left: 0px;
        width: 100%;
        font-size: 0.8em;
        opacity: 0.6;
    }

    & > div {
        border: 1px solid black;
        border-radius: 10px;
        background-color: white;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: scroll;
        padding: 10px;
        text-align: center;
    }

    & > div.visible {
        transform: rotateY(0deg);
        ${props => props.flipped === true ? `animation: hide ${props.speed}s linear;` : ''}
        ${props => props.flipped === false ? `animation: show ${props.speed}s linear;` : ''}
        animation-fill-mode: both;
    }

    & > div.hidden {
        position: absolute;
        top: 0px;
        left: 0px;
        transform: rotateY(90deg);
        ${props => props.flipped === true ? `animation: show ${props.speed}s linear;` : ''}
        ${props => props.flipped === false ? `animation: hide ${props.speed}s linear;` : ''}
        animation-fill-mode: both;
    }

    @keyframes show {
        0% { transform: rotateY(90deg); }
        50% { transform: rotateY(90deg); }
        100% { transform: rotateY(0deg); }
    }

    @keyframes hide {
        0% { transform: rotateY(0deg); }
        50% { transform: rotateY(-90deg); }
        100% { transform: rotateY(-90deg); }
    }
`

export default StyledFlipCard;