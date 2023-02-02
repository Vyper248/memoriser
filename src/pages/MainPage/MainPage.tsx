import { useEffect, useState } from 'react';
import StyledMainPage from './MainPage.style';

import type { Group, Card } from '../../types';

import { addToArray, removeFromArray, editInArray, filterArrayByGroupId, sortArray } from '../../utils/array.utils';
import { getSize, correctCardAdjustment, createNewCard } from '../../utils/general.utils';

import Button from '../../components/Button/Button';
import FlipCard from '../../components/FlipCard/FlipCard';
import GroupSelect from '../../components/GroupSelect/GroupSelect';
import Header from '../../components/Header/Header';
import SquareGrid from '../../components/SquareGrid/SquareGrid';

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

	//filter and sort cards and get first one ready to display
	let firstCard;
	let sortedCards;
	if (currentGroup) {
		const filteredCards = filterArrayByGroupId(currentGroup.id, cards);
		sortedCards = sortArray(filteredCards);
		//if a new card has been added, filter it out and put it at the front of the array
		if (selectedCard) {
			sortedCards = sortedCards.filter(card => card.id !== selectedCard.id);
			sortedCards = [selectedCard, ...sortedCards];
		}
		firstCard = sortedCards[0];
	}

	const cardFunctions = {
		onCorrect: onCorrectAnswer,
		onFail: onIncorrectAnswer,
		onEdit: onEditCard,
		onDelete: onDeleteCard,
		onSelect: setSelectedCard
	}

	return (
		<StyledMainPage>
			<Header text='Memoriser' cards={cards} groups={groups} currentGroup={currentGroup} viewingShared={viewingShared}/>
			{ viewingShared ? <Button value='Back to your groups' onClick={onCancelShare}/> : null }
			<GroupSelect groups={groups} currentGroup={currentGroup} viewingShared={viewingShared} onChange={onChangeGroup} onAdd={onAddGroup} onEdit={onEditGroup} onDelete={onDeleteGroup}/>
			{ viewingShared ? null : <Button value='New Card' onClick={onClickAddCard}/> }
			<div id='firstCard'>
				{ firstCard ? <FlipCard key={'first-'+firstCard.id} viewingShared={viewingShared} width='300px' height='300px' card={firstCard} size='large' startInEditMode={addingCard} {...cardFunctions}/> : null }
			</div>
			<SquareGrid>
				{ sortedCards ? sortedCards.map((card, i) => i === 0 ? null : <div key={card.id} className={getSize(card)}><FlipCard card={card} size={getSize(card)} viewingShared={viewingShared} {...cardFunctions}/></div>) : null }
			</SquareGrid>
		</StyledMainPage>
	);
}

export default MainPage;