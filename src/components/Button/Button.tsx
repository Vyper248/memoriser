import React from 'react';
import StyledButton from './Button.style';

type ButtonProps = {
    value: string;
    onClick: ()=>void;
}

const Button = ({value, onClick}: ButtonProps) => {
    return (
        <StyledButton onClick={onClick}>{value}</StyledButton>
    );
}

export default Button;