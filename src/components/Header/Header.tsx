import StyledHeader from './Header.style';

type HeaderProps = {
    text: string;
}

const Header = ({ text }: HeaderProps) => {
    return (
        <StyledHeader>
            <h1>{text}</h1>
        </StyledHeader>
    );
}

export default Header;