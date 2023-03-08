import { useEffect } from 'react';
import StyledMainPage from './MainPage.style';

import type { Card } from '../../types';

import { filterArrayByGroupId } from '../../utils/array.utils';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setSelectedGroup, addCard } from '../../redux/mainSlice';

import Button from '../../components/Button/Button';
import GroupSelect from '../../components/GroupSelect/GroupSelect';
import Header from '../../components/Header/Header';
import GridSorter from '../../components/GridSorter/GridSorter';
import ImportMenu from '../../components/ImportMenu/ImportMenu';

const MainPage = () => {
	const dispatch = useAppDispatch();
	const viewingShared = useAppSelector(state => state.main.viewingShared);
	const selectedGroup = useAppSelector(state => state.main.selectedGroup);
	const cards = useAppSelector(state => state.main.cards);
	const groups = useAppSelector(state => state.main.groups);
	const filter = useAppSelector(state => state.main.filter);

    //make sure current group is correct after loading data from local storage
    useEffect(() => {
        let groupCheck = groups.find(group => group.id === selectedGroup?.id);
        if (!groupCheck) dispatch(setSelectedGroup(groups[0]));
    }, [groups, selectedGroup, dispatch]);

	const onClickAddCard = () => {
		dispatch(addCard());
	}

	let filteredCards = [] as Card[];
	if (selectedGroup) {
		filteredCards = filterArrayByGroupId(selectedGroup.id, cards);
	}

	if (filter.type === 'color') {
		let color = filter.color;
		if (color === 'red') filteredCards = filteredCards.filter(card => card.points === 0 || card.points === undefined);
		if (color === 'green') filteredCards = filteredCards.filter(card => card.points && card.points > 4);
		if (color === 'orange') filteredCards = filteredCards.filter(card => card.points && card.points > 0 && card.points <= 4);
	}

	return (
		<StyledMainPage>
			<Header text='Learn with Cards'/>
			{ viewingShared ? <ImportMenu/> : null }
			<GroupSelect/>
			{ viewingShared ? null : <Button value='New Card' onClick={onClickAddCard}/> }
			<GridSorter cards={filteredCards}/>
		</StyledMainPage>
	);
}

export default MainPage;