import StyledHeader from './Header.style';
import { FaQuestionCircle } from 'react-icons/fa';

import Instructions from '../Instructions/Instructions';
import PopupMenu from '../PopupMenu/PopupMenu';

type HeaderProps = {
    text: string;
}

const Header = ({ text }: HeaderProps) => {
    return (
        <StyledHeader>
            <h1>{text}</h1>
            <PopupMenu width='700px' icon={<FaQuestionCircle/>} iconSize='1.2em'>
                <Instructions visible={true}/>
            </PopupMenu>
        </StyledHeader>
    );
}

export default Header;