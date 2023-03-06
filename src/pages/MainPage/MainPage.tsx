import { useEffect } from 'react';
import StyledMainPage from './MainPage.style';

import type { Card } from '../../types';

import { editInArray, filterArrayByGroupId } from '../../utils/array.utils';
import { correctCardAdjustment } from '../../utils/general.utils';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setSelectedCard, setSelectedGroup, setCards, setAddingCard, addCard } from '../../redux/mainSlice';

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

    //make sure current group is correct after loading data from local storage
    useEffect(() => {
        let groupCheck = groups.find(group => group.id === selectedGroup?.id);
        if (!groupCheck) dispatch(setSelectedGroup(groups[0]));
    }, [groups, selectedGroup, dispatch]);

	const onClickAddCard = () => {
		dispatch(addCard());
	}

	const onCorrectAnswer = (card: Card) => {
		dispatch(setSelectedCard(null));
		dispatch(setAddingCard(false));
		const setCardsFunction = (cards: Card[]) => dispatch(setCards(cards));
		correctCardAdjustment(card, cards, setCardsFunction);		
	}

	const onIncorrectAnswer = (card: Card) => {
		let lastChecked = new Date().getTime()
		let newCards = editInArray({...card, points: 0, lastChecked, lastCheckingPeriod: '1 Hour'}, cards);
		dispatch(setCards(newCards));
		dispatch(setSelectedCard(null));
		dispatch(setAddingCard(false));
	}

	let filteredCards = [] as Card[];
	if (selectedGroup) {
		filteredCards = filterArrayByGroupId(selectedGroup.id, cards);
	}

	const cardFunctions = {
		onCorrect: onCorrectAnswer,
		onFail: onIncorrectAnswer,
	}

	return (
		<StyledMainPage>
			<Header text='Learn with Cards'/>
			{ viewingShared ? <ImportMenu/> : null }
			<GroupSelect/>
			{ viewingShared ? null : <Button value='New Card' onClick={onClickAddCard}/> }
			<GridSorter cards={filteredCards} cardFunctions={cardFunctions}/>
		</StyledMainPage>
	);
}

export default MainPage;