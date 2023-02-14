import styled from 'styled-components';

const StyledFlipCard = styled.div`
    position: relative;
    width: ${props => props.width};
    height: ${props => props.height};
    width: 300px;
    height: 300px;
    transform: scale(0.965);
    ${props => props.size === 'medium' ? 'transform: scale(0.63);' : ''}
    ${props => props.size === 'small' ? 'transform: scale(0.30);' : ''}
    transform-origin: top left;
    perspective: 1000px;
    transition: transform 0.6s;

    & > div.visible::after {
        content: ${props => props.size !== 'large' ? '' : '\'Click Me!\''};
        position: absolute;
        bottom: 10px;
        left: 0px;
        width: 100%;
        font-size: 0.8em;
        opacity: 0.6;
    }

    & > div {
        border: 1px solid red;
        ${props => props.points > 0 ? 'border: 1px solid orange;' : ''}
        ${props => props.points > 4 ? 'border: 1px solid green;' : ''}
        border-radius: 10px;
        ${props => props.size === 'medium' ? 'border-radius: 15px; border-width: 1.66px;' : ''}
        ${props => props.size === 'small' ? 'border-radius: 20px; border-width: 3px;' : ''}
        background-color: white;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: scroll;
        padding: 10px;
        text-align: center;
        transition: border-radius 0.6s, border-width 0.6s;
    }

    & > div.visible {
        cursor: pointer;
        transform: rotateY(0deg);
        ${props => props.flipped === true ? `animation: hide ${props.speed}s linear;` : ''}
        /* ${props => props.flipped === false ? `animation: show ${props.speed}s linear;` : ''} */
        animation-fill-mode: both;
    }

    & > div.hidden {
        position: absolute;
        top: 0px;
        left: 0px;
        transform: rotateY(90deg);
        ${props => props.flipped === true ? `animation: show ${props.speed}s linear;` : ''}
        /* ${props => props.flipped === false ? `animation: hide ${props.speed}s linear;` : ''} */
        animation-fill-mode: both;
    }

    & #answer {
        & > div {
            margin-bottom: 10px;
        }
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