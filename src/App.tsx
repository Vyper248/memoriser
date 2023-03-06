import { useCallback, useEffect, useState } from 'react';
import './App.css';

import type { Card, Group } from './types';

import { parseHash } from './utils/general.utils';
import { setViewingShared, setCards } from './redux/mainSlice';
import { useAppSelector, useAppDispatch } from './redux/hooks';

import MainPage from './pages/MainPage/MainPage';

const initialGroup: Group = {
	id: '1',
	name: 'Instructions',
}

function App() {
	const [groups, setGroups] = useState<Group[]>([initialGroup]);
	const viewingShared = useAppSelector(state => state.main.viewingShared);
	const dispatch = useAppDispatch();

	//keep track of when the hash changes to refresh the page and update state
	let hashChange = useCallback(() => {
		window.location.reload();
	}, []);

	//retrieve data from local storage
	useEffect(() => {
		//if hash available,
		let dataObj = parseHash(window.location.hash);
		if (dataObj !== null) {
			dispatch(setViewingShared(true));
			if (dataObj.cards) dispatch(setCards(dataObj.cards));
			if (dataObj.groups) setGroups(dataObj.groups);
		} else {
			let localDataCards = localStorage.getItem('memoriser-data-cards');
			let localDataGroups = localStorage.getItem('memoriser-data-groups');
	
			dispatch(setViewingShared(false));
			if (localDataCards) dispatch(setCards(JSON.parse(localDataCards)));
			if (localDataGroups) setGroups(JSON.parse(localDataGroups));
		}

		window.addEventListener('hashchange', hashChange);

		return () => {
			window.removeEventListener('hashchange', hashChange);
		}
	}, [hashChange, dispatch]);

	const saveToLocal = (key: string, array: Card[] | Group[]) => {
		//don't overwrite local storage when viewing a shared hash
		if (viewingShared) return;

		let string = JSON.stringify(array);
		localStorage.setItem(`memoriser-data-${key}`, string);
	}

	const onSetGroups = (groups: Group[]) => {
		setGroups(groups)
		saveToLocal('groups', groups);
	}

	return (
		<div className="App">
			<MainPage groups={groups} setGroups={onSetGroups}/>
		</div>
	);
}

export default App;
