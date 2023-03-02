import { useState } from 'react';
import { MdIosShare } from 'react-icons/md';

import StyledHeader from './Header.style';

import { generateHash } from '../../utils/general.utils';

import PopupMenu from '../PopupMenu/PopupMenu';
import Button from '../Button/Button';
import { Card, Group } from '../../types';

type HeaderProps = {
    text: string;
    cards: Card[];
    groups: Group[];
    currentGroup: Group | undefined;
    viewingShared: boolean;
}

const Header = ({ text, cards, groups, currentGroup, viewingShared }: HeaderProps) => {
    const [copyText, setCopyText] = useState('');

    const generateURL = (hash: string) => {
        let href = window.location.href;
        //have to check whether url already includes a hash
		let url = href.includes('#') ? href + hash : href + '#' + hash;
		navigator.clipboard.writeText(url);

        //set message for user for 2 seconds
        setCopyText('Copied link to clipboard!');
        setTimeout(() => {
            setCopyText('');
        }, 2000);
    }

    const shareAll = () => {
		let hash = generateHash(cards, groups);
		generateURL(hash);
	}

    const shareSelectedGroup = () => {
        if (!currentGroup) return;

        let filteredCards = cards.filter(card => card.groupId === currentGroup.id);
        let hash = generateHash(filteredCards, [currentGroup]);
        generateURL(hash);
    }

    const onClearHash = () => {
		window.location.hash = '';
	}

    let invalidShareLink = window.location.hash.length > 0 && !viewingShared;

    return (
        <StyledHeader>
            <h1>{text}</h1>
            { viewingShared ? null : (<PopupMenu width='180px' icon={<MdIosShare/>}>
				<Button value='Share All' onClick={shareAll}/>
                { currentGroup ? <Button value='Share Selected Group' onClick={shareSelectedGroup}/> : null }
                { copyText.length > 0 ? <p id='copyText'>{copyText}</p> : null }
			</PopupMenu>) }
            { invalidShareLink ? <p id='warning' onClick={onClearHash}>Warning: Shared link is invalid, click here to clear.</p> : null }
        </StyledHeader>
    );
}

export default Header;