import styled from 'styled-components';

const StyledFlipCard = styled.div.attrs((props) => {
    let transform = 'scale(0.965)';
    if (props.size === 'medium') transform = 'scale(0.63)';
    if (props.size === 'small') transform = 'scale(0.30)';

    return {
        style: {
            transform
        }
    };
})`
    position: relative;
    width: 300px;
    height: 300px;
    transform-origin: top left;
    perspective: 1000px;
    transition: transform 0.6s;

    & #answer {
        & > div {
            margin-bottom: 10px;
        }
    }
`

export const StyledInner = styled.div.attrs((props) => {
    let borderStyle = 'solid';
    let borderColor = 'red';
    if (props.points > 0) { borderColor = 'orange'; }
    if (props.points > 4) { borderColor = 'green'; }
    if (props.disabled) { borderColor = 'grey'; }

    let borderRadius = '10px';
    let borderWidth = '1px';
    let shadowWidth = '2px';
    if (props.size === 'medium') { borderRadius = '15px'; borderWidth = '1.66px'; shadowWidth = '3px'; }
    if (props.size === 'small') { borderRadius = '20px'; borderWidth = '3px'; shadowWidth = '6px'; }

    let boxShadow = '';
    if (props.timeToPoint === 'Ready') { boxShadow = `0px 0px 0px ${shadowWidth} ${borderColor}`; }

    return {
        style: {
            borderStyle,
            borderRadius,
            borderColor,
            borderWidth,
            boxShadow
        }
    };
})`
    background-color: white;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: scroll;
    padding: 10px;
    text-align: center;
    transition: border-radius 0.6s, border-width 0.6s, box-shadow 0.3s linear, border-color 0.3s;

    &.visible {
        cursor: pointer;
        transform: rotateY(0deg);
        ${props => props.flipped === true ? `animation: hide ${props.speed}s linear;` : ''}
        ${props => props.shake ? 'animation: shake 0.3s linear;' : ''}
        animation-fill-mode: both;
    }

    &.hidden {
        position: absolute;
        top: 0px;
        left: 0px;
        transform: rotateY(90deg);
        ${props => props.flipped === true ? `animation: show ${props.speed}s linear;` : ''}
        animation-fill-mode: both;
    }

    & .flipCardEditBtn {
        position: absolute;
        top: 0px;
        right: 0px;
        background-color: white;
        border: none;
        font-size: 1.4em;
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

    @keyframes shake {
        0% { transform: translate(0px); }
        33% { transform: translate(-5px); }
        66% { transform: translate(5px); }
        100% { transform: translate(0px); }
    }
`;

export const StyledTimer = styled.div`
    position: absolute;
    bottom: 8px;
    left: 0px;
    width: 100%;
    font-size: 0.8em;
    opacity: 0.6;
    pointer-events: none;
`;

export const StyledPoints = styled(StyledTimer)`
    top: 8px;
`;

export default StyledFlipCard;