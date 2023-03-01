import { ReactNode } from 'react';
import StyledButton from './Button.style';

type ButtonProps = {
    value: string | ReactNode;
    onClick: (e: React.SyntheticEvent)=>void;
    [x: string]: any;
}

const Button = ({value, onClick, ...rest}: ButtonProps) => {
    return (
        <StyledButton onClick={onClick} {...rest}>{value}</StyledButton>
    );
}

export default Button;