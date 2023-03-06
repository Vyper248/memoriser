import { useEffect, useState } from 'react';
import StyledMainPage from './MainPage.style';

import type { Group, Card } from '../../types';

import { addToArray, removeFromArray, editInArray, filterArrayByGroupId } from '../../utils/array.utils';
import { correctCardAdjustment, createNewCard } from '../../utils/general.utils';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setSelectedCard, setSelectedGroup, setCards, setGroups, setAddingCard } from '../../redux/mainSlice';

import Button from '../../components/Button/Button';
import GroupSelect from '../../components/GroupSelect/GroupSelect';
import Header from '../../components/Header/Header';
import GridSorter from '../../components/GridSorter/GridSorter';
import ImportMenu from '../../components/ImportMenu/ImportMenu';

const MainPage = () => {
	const dispatch = useAppDispatch();
	const viewingShared = useAppSelector(state => state.main.viewingShared);
	const selectedCard = useAppSelector(state => state.main.selectedCard);
	const selectedGroup = useAppSelector(state => state.main.selectedGroup);
	const cards = useAppSelector(state => state.main.cards);
	const groups = useAppSelector(state => state.main.groups);

    //make sure current group is correct after loading data from local storage
    useEffect(() => {
        let groupCheck = groups.find(group => group.id === selectedGroup?.id);
        if (!groupCheck) dispatch(setSelectedGroup(groups[0]));
    }, [groups, selectedGroup, dispatch]);

    const onChangeGroup = (id: string) => {
		const newGroup = groups.find(group => group.id === id);
		if (newGroup) dispatch(setSelectedGroup(newGroup));
	}

	const onAddGroup = (group: Group) => {
		let newGroups = [...groups, group];
		dispatch(setGroups(newGroups));
		dispatch(setSelectedGroup(group));
	}

	const onEditGroup = (group: Group) => {
		let newGroups = editInArray(group, groups);
		dispatch(setGroups(newGroups));
		dispatch(setSelectedGroup(group));
	}

	const onDeleteGroup = (group: Group) => {
		let newGroups = removeFromArray(group, groups);
		dispatch(setGroups(newGroups));
		dispatch(setSelectedGroup(newGroups[0]));
		let newCards = cards.filter(card => card.groupId !== group.id);
		dispatch(setCards(newCards));
	}

	const onClickAddCard = () => {
		if (!selectedGroup) return;

		dispatch(setAddingCard(true));
		let newCard = createNewCard(selectedGroup.id);
		dispatch(setSelectedCard(newCard));
		addCard(newCard);
	}

	const addCard = (card: Card) => {
		let newCards = addToArray(card, cards);
		dispatch(setCards(newCards));
	}

	const onEditCard = (card: Card) => {
		let newCards = editInArray(card, cards);
		dispatch(setCards(newCards));
	}

	const onDeleteCard = (card: Card) => {
		let newCards = removeFromArray(card, cards);
		dispatch(setCards(newCards));
		if (selectedCard) dispatch(setSelectedCard(null));
		dispatch(setAddingCard(false));
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

	const onSelectCard = (card: Card) => {
		dispatch(setAddingCard(false));
		dispatch(setSelectedCard(card));
	}

	let filteredCards = [] as Card[];
	if (selectedGroup) {
		filteredCards = filterArrayByGroupId(selectedGroup.id, cards);
	}

	const cardFunctions = {
		onCorrect: onCorrectAnswer,
		onFail: onIncorrectAnswer,
		onEdit: onEditCard,
		onDelete: onDeleteCard,
		onSelect: onSelectCard
	}

	const groupfunctions = {
		onChange: onChangeGroup,
		onAdd: onAddGroup,
		onEdit: onEditGroup,
		onDelete: onDeleteGroup
	}

	return (
		<StyledMainPage>
			<Header text='Learn with Cards'/>
			{ viewingShared ? <ImportMenu/> : null }
			<GroupSelect {...groupfunctions}/>
			{ viewingShared ? null : <Button value='New Card' onClick={onClickAddCard}/> }
			<GridSorter cards={filteredCards} cardFunctions={cardFunctions}/>
		</StyledMainPage>
	);
}

export default MainPage;