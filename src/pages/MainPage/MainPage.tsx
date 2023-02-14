import { useEffect, useState } from 'react';
import StyledMainPage from './MainPage.style';

import type { Group, Card } from '../../types';

import { addToArray, removeFromArray, editInArray, filterArrayByGroupId } from '../../utils/array.utils';
import { correctCardAdjustment, createNewCard, getLocalData } from '../../utils/general.utils';
import { importSharedData, mergeSharedData, mergeWithSelectedGroup } from '../../utils/importing.utils';

import Button from '../../components/Button/Button';
import GroupSelect from '../../components/GroupSelect/GroupSelect';
import Header from '../../components/Header/Header';
import GridSorter from '../../components/GridSorter/GridSorter';
import LinkedBorders from '../../components/LinkedBorders/LinkedBorders';

type MainPageProps = {
    groups: Group[];
    cards: Card[];
    setGroups: (groups: Group[])=>void;
    setCards: (cards: Card[])=>void;
	viewingShared: boolean;
}

const MainPage = ({groups, setGroups, cards, setCards, viewingShared}: MainPageProps) => {
    const [currentGroup, setCurrentGroup] = useState<Group | undefined>(groups[0]);
	const [addingCard, setAddingCard] = useState(false);
	const [mergeGroup, setMergeGroup] = useState('');
	const [selectedCard, setSelectedCard] = useState<Card | null>(null);

    //make sure current group is correct after loading data from local storage
    useEffect(() => {
        let groupCheck = groups.find(group => group.id === currentGroup?.id);
        if (!groupCheck) setCurrentGroup(groups[0]);
    }, [groups]);

    const onChangeGroup = (id: string) => {
		const newGroup = groups.find(group => group.id === id);
		if (newGroup) setCurrentGroup(newGroup);
        if (selectedCard) setSelectedCard(null);
	}

	const onAddGroup = (group: Group) => {
		let newGroups = [...groups, group];
		setGroups(newGroups);
		setCurrentGroup(group);
		setSelectedCard(null);
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
		setSelectedCard(null);
	}

	const onClickAddCard = () => {
		if (!currentGroup) return;

		setAddingCard(true);
		let newCard = createNewCard(currentGroup.id);
		setSelectedCard(newCard);
		addCard(newCard);
	}

	const addCard = (card: Card) => {
		let newCards = addToArray(card, cards);
		setCards(newCards);
	}

	const onEditCard = (card: Card) => {
		let newCards = editInArray(card, cards);
		setCards(newCards);
		if (selectedCard) setSelectedCard(card);
		setAddingCard(false);
	}

	const onDeleteCard = (card: Card) => {
		let newCards = removeFromArray(card, cards);
		setCards(newCards);
		if (selectedCard) setSelectedCard(null);
		setAddingCard(false);
	}

	const onCorrectAnswer = (card: Card) => {
		setSelectedCard(null);
		setAddingCard(false);
		correctCardAdjustment(card, cards, setCards);		
	}

	const onIncorrectAnswer = (card: Card) => {
		let lastChecked = new Date().getTime()
		let newCards = editInArray({...card, points: 0, lastChecked, lastCheckingPeriod: '1 Hour'}, cards);
		setCards(newCards);
		setSelectedCard(null);
		setAddingCard(false);
	}

	const onCancelShare = () => {
		window.location.hash = '';
	}

	const onAddShared = () => {
		importSharedData(cards, groups);
		onCancelShare();
	}

	const onMergeShared = () => {
		mergeSharedData(cards, groups);
		onCancelShare();
	}

	const onMergeWithGroup = () => {
		let selectedGroup = currentGroup as Group;
		let filteredCards = cards.filter(card => card.groupId === selectedGroup.id);
		mergeWithSelectedGroup(filteredCards, mergeGroup);
		onCancelShare();
	}

	const onChangeMergeGroup = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setMergeGroup(e.target.value);
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
		onSelect: setSelectedCard
	}

	let localGroups = [] as Group[];
	if (viewingShared) {
		let { localDataGroups } = getLocalData();	
		localGroups = localDataGroups;
	}

	return (
		<StyledMainPage>
			<Header text='Memoriser' cards={cards} groups={groups} currentGroup={currentGroup} viewingShared={viewingShared}/>
			{ viewingShared ? <Button value='Back to your groups' onClick={onCancelShare}/> : null }
			{ viewingShared ? <Button value='Add All' onClick={onAddShared}/> : null }
			{ viewingShared && localGroups.length > 0 ? <Button value='Merge All' onClick={onMergeShared}/> : null }
			{ viewingShared && localGroups.length > 0 ? <>
				<br/>
				<LinkedBorders>
					<label style={{backgroundColor: '#DDD'}}>Merge Selected Group With</label>
					<select onChange={onChangeMergeGroup}>
						{ localGroups.map(group => <option value={group.id}>{group.name}</option>) }
					</select>
					<Button value='Go' onClick={onMergeWithGroup}/>
				</LinkedBorders>
				<br/>
				<br/>
			</> : null }
			<GroupSelect groups={groups} currentGroup={currentGroup} viewingShared={viewingShared} onChange={onChangeGroup} onAdd={onAddGroup} onEdit={onEditGroup} onDelete={onDeleteGroup}/>
			{ viewingShared ? null : <Button value='New Card' onClick={onClickAddCard}/> }
			<GridSorter cards={filteredCards} selectedCard={selectedCard} cardFunctions={cardFunctions} viewingShared={viewingShared}/>
		</StyledMainPage>
	);
}

export default MainPage;