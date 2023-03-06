import { useEffect, useState } from 'react';
import StyledMainPage from './MainPage.style';

import type { Group, Card } from '../../types';

import { addToArray, removeFromArray, editInArray, filterArrayByGroupId } from '../../utils/array.utils';
import { correctCardAdjustment, createNewCard } from '../../utils/general.utils';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setSelectedCard } from '../../redux/mainSlice';

import Button from '../../components/Button/Button';
import GroupSelect from '../../components/GroupSelect/GroupSelect';
import Header from '../../components/Header/Header';
import GridSorter from '../../components/GridSorter/GridSorter';
import ImportMenu from '../../components/ImportMenu/ImportMenu';

type MainPageProps = {
    groups: Group[];
    cards: Card[];
    setGroups: (groups: Group[])=>void;
    setCards: (cards: Card[])=>void;
}

const MainPage = ({groups, setGroups, cards, setCards }: MainPageProps) => {
	const dispatch = useAppDispatch();
    const [currentGroup, setCurrentGroup] = useState<Group | undefined>(groups[0]);
	const [addingCard, setAddingCard] = useState(false);
	const viewingShared = useAppSelector(state => state.main.viewingShared);
	const selectedCard = useAppSelector(state => state.main.selectedCard);

    //make sure current group is correct after loading data from local storage
    useEffect(() => {
        let groupCheck = groups.find(group => group.id === currentGroup?.id);
        if (!groupCheck) setCurrentGroup(groups[0]);
    }, [groups, currentGroup]);

    const onChangeGroup = (id: string) => {
		const newGroup = groups.find(group => group.id === id);
		if (newGroup) setCurrentGroup(newGroup);
        if (selectedCard) dispatch(setSelectedCard(null));
	}

	const onAddGroup = (group: Group) => {
		let newGroups = [...groups, group];
		setGroups(newGroups);
		setCurrentGroup(group);
		dispatch(setSelectedCard(null));
	}

	const onEditGroup = (group: Group) => {
		let newGroups = editInArray(group, groups);
		setGroups(newGroups);
		setCurrentGroup(group);
	}

	const onDeleteGroup = (group: Group) => {
		let newGroups = removeFromArray(group, groups);
		setGroups(newGroups);
		setCurrentGroup(newGroups[0]);
		let newCards = cards.filter(card => card.groupId !== group.id);
		setCards(newCards);
		dispatch(setSelectedCard(null));
	}

	const onClickAddCard = () => {
		if (!currentGroup) return;

		setAddingCard(true);
		let newCard = createNewCard(currentGroup.id);
		dispatch(setSelectedCard(newCard));
		addCard(newCard);
	}

	const addCard = (card: Card) => {
		let newCards = addToArray(card, cards);
		setCards(newCards);
	}

	const onEditCard = (card: Card) => {
		let newCards = editInArray(card, cards);
		setCards(newCards);
	}

	const onDeleteCard = (card: Card) => {
		let newCards = removeFromArray(card, cards);
		setCards(newCards);
		if (selectedCard) dispatch(setSelectedCard(null));
		setAddingCard(false);
	}

	const onCorrectAnswer = (card: Card) => {
		dispatch(setSelectedCard(null));
		setAddingCard(false);
		correctCardAdjustment(card, cards, setCards);		
	}

	const onIncorrectAnswer = (card: Card) => {
		let lastChecked = new Date().getTime()
		let newCards = editInArray({...card, points: 0, lastChecked, lastCheckingPeriod: '1 Hour'}, cards);
		setCards(newCards);
		dispatch(setSelectedCard(null));
		setAddingCard(false);
	}

	const onSelectCard = (card: Card) => {
		setAddingCard(false);
		dispatch(setSelectedCard(card));
	}

	let filteredCards = [] as Card[];
	if (currentGroup) {
		filteredCards = filterArrayByGroupId(currentGroup.id, cards);
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
			{ viewingShared ? <ImportMenu cards={cards} groups={groups} currentGroup={currentGroup}/> : null }
			<GroupSelect groups={groups} cards={cards} currentGroup={currentGroup} {...groupfunctions}/>
			{ viewingShared ? null : <Button value='New Card' onClick={onClickAddCard}/> }
			<GridSorter currentGroup={currentGroup} cards={filteredCards} cardFunctions={cardFunctions} addingCard={addingCard}/>
		</StyledMainPage>
	);
}

export default MainPage;