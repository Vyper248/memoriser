import { useCallback, useEffect, useState } from 'react';
import './App.css';

import type { Card, Group } from './types';

import { parseHash } from './utils/general.utils';

import MainPage from './pages/MainPage/MainPage';

const initialGroup: Group = {
	id: '1',
	name: 'Instructions',
}

const initialCards: Card[] = [
	{
		id: '1',
		groupId: '1',
		question: 'Look at a card, try to guess, then check if you got it right by clicking on it.',
		answer: 'Be truthful here, otherwise it won\'t help you.',
		points: 0,
	},
	{
		id: '2',
		groupId: '1',
		question: 'You can use the dropdown menu above to add, edit or delete a group.',
		answer: 'So start creating some cards and learning!',
		points: 0,
	}
];

function App() {
	const [groups, setGroups] = useState<Group[]>([initialGroup]);
	const [cards, setCards] = useState<Card[]>(initialCards);
	const [viewingShared, setViewingShared] = useState(false);

	//keep track of when the hash changes to refresh the page and update state
	let hashChange = useCallback(() => {
		window.location.reload();
	}, []);

	//retrieve data from local storage
	useEffect(() => {
		//if hash available,
		let dataObj = parseHash(window.location.hash);
		if (dataObj !== null) {
			if (dataObj.cards) setCards(dataObj.cards);
			if (dataObj.groups) setGroups(dataObj.groups);
			setViewingShared(true);
		} else {
			let localDataCards = localStorage.getItem('memoriser-data-cards');
			let localDataGroups = localStorage.getItem('memoriser-data-groups');
	
			if (localDataCards) setCards(JSON.parse(localDataCards));
			if (localDataGroups) setGroups(JSON.parse(localDataGroups));
			setViewingShared(false);
		}

		window.addEventListener('hashchange', hashChange);

		return () => {
			window.removeEventListener('hashchange', hashChange);
		}
	}, [hashChange]);

	const saveToLocal = (key: string, array: Card[] | Group[]) => {
		//don't overwrite local storage when viewing a shared hash
		if (viewingShared) return;

		let string = JSON.stringify(array);
		localStorage.setItem(`memoriser-data-${key}`, string);
	}

	const onSetCards = (cards: Card[]) => {
		setCards(cards);
		saveToLocal('cards', cards);
	}

	const onSetGroups = (groups: Group[]) => {
		setGroups(groups)
		saveToLocal('groups', groups);
	}

	return (
		<div className="App">
			<MainPage cards={cards} groups={groups} setCards={onSetCards} setGroups={onSetGroups} viewingShared={viewingShared}/>
		</div>
	);
}

export default App;
