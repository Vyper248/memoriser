import StyledHeader from './Header.style';

type HeaderProps = {
    text: string;
}

const Header = ({ text }: HeaderProps) => {
    return (
        <StyledHeader>{text}</StyledHeader>
    );
}

export default Header;