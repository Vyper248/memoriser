import { useCallback, useEffect } from 'react';
import './App.css';

import { parseHash } from './utils/general.utils';
import { setViewingShared, setCards, setGroups } from './redux/mainSlice';
import { useAppDispatch } from './redux/hooks';

import MainPage from './pages/MainPage/MainPage';

function App() {
	const dispatch = useAppDispatch();

	//keep track of when the hash changes to refresh the page and update state
	let hashChange = useCallback(() => {
		window.location.reload();
	}, []);

	//retrieve data from local storage
	useEffect(() => {
		//if hash available, parse and use this data as state
		let dataObj = parseHash(window.location.hash);
		if (dataObj !== null) {
			dispatch(setViewingShared(true));
			if (dataObj.cards) dispatch(setCards(dataObj.cards));
			if (dataObj.groups) dispatch(setGroups(dataObj.groups));
		} else {
			//otherwise use data from local storage if it's available
			let localDataCards = localStorage.getItem('memoriser-data-cards');
			let localDataGroups = localStorage.getItem('memoriser-data-groups');
	
			dispatch(setViewingShared(false));
			if (localDataCards) dispatch(setCards(JSON.parse(localDataCards)));
			if (localDataGroups) dispatch(setGroups(JSON.parse(localDataGroups)));
		}

		window.addEventListener('hashchange', hashChange);

		return () => {
			window.removeEventListener('hashchange', hashChange);
		}
	}, [hashChange, dispatch]);

	return (
		<div className="App">
			<MainPage/>
		</div>
	);
}

export default App;
