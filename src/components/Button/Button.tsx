import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import StyledButton from './Button.style';

type ButtonProps = {
    value: string | ReactNode;
    onClick: ()=>void;
    [x: string]: any;
}

const Button = ({value, onClick, ...rest}: ButtonProps) => {
    return (
        <StyledButton onClick={onClick} {...rest}>{value}</StyledButton>
    );
}

export default Button;