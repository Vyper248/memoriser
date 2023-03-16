import { useEffect, useRef, useState } from "react";

import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { importBackup } from "../../redux/mainSlice";
import { Card, Group } from "../../types";

import { generateURL } from "../../utils/general.utils";
import { removeExtraCardProperties } from "../../utils/array.utils";
import { importFromBackup } from "../../utils/importing.utils";

import Button from "../Button/Button";

type ImportData = {
	cards: Card[],
	groups: Group[]
}

const ShareMenu = () => {
	const dispatch = useAppDispatch();
	const [copyText, setCopyText] = useState('');
	const [importMessage, setImportMessage] = useState('');
	const fileInputRef = useRef(null);
	const selectedGroup = useAppSelector(state => state.main.selectedGroup);
	const cards = useAppSelector(state => state.main.cards);
	const groups = useAppSelector(state => state.main.groups);

	const setCopiedText = () => {
        //set message for user for 2 seconds
        setCopyText('Copied link to clipboard!');
        setTimeout(() => {
            setCopyText('');
        }, 2000);
    }

	useEffect(() => {
		if (importMessage.length > 0) {
			let timeout = setTimeout(() => {
				setImportMessage('');
			}, 2000);

			return () => clearTimeout(timeout);
		}
	}, [importMessage]);

    const onClickShareAll = () => {
        generateURL(cards, groups);
        setCopiedText();
	}

    const onClickShareSelected = () => {
        if (!selectedGroup) return;

        let filteredCards = cards.filter(card => card.groupId === selectedGroup.id);
        generateURL(filteredCards, [selectedGroup]);
        setCopiedText();
    }

	const onClickBackup = () => {
		let cardArr = removeExtraCardProperties(cards);

		let backupObj = {cards: cardArr, groups};

		const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));

        const link = document.createElement("a");
        link.setAttribute("href", dataStr);
        link.setAttribute("download", `Learn with Cards Backup - ${new Date().toLocaleDateString()}.json`);
        link.click();
	}

	const onFileChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
		const files = e.currentTarget.files;
		if (files === null) return; 

        const file = files[0];
        if (file === undefined) return;

		importFromBackup(file, onImportBackup);

		e.currentTarget.value = '';
    }

    const onImportBackup = (importObj: ImportData | null) => {
		if (importObj === null) {
			setImportMessage('Incorrect File');
		} else {
			dispatch(importBackup(importObj));
			setImportMessage('Data Imported');
		}
    }

	const onClickImport = () => {
		if (fileInputRef && fileInputRef.current) {
			let el = fileInputRef.current as HTMLInputElement;
			el.click();
		}
	}

	return (
		<>
			<Button value='Share All' onClick={onClickShareAll}/>
			{ selectedGroup ? <Button value='Share Selected Group' onClick={onClickShareSelected}/> : null }
			{ copyText.length > 0 ? <p id='responseMessage'>{copyText}</p> : null }
			<hr/>
			<Button value='Download Backup' onClick={onClickBackup}/>
			<input type='file' onChange={onFileChange} ref={fileInputRef} style={{display: 'none'}}/>
			<Button value='Import Backup' onClick={onClickImport}/>
			{ importMessage.length > 0 ? <p id='responseMessage'>{importMessage}</p> : null }
		</>
	);
}

export default ShareMenu;
