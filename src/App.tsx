import { useState } from 'react';
import './App.css';

import type { Card, Group } from './types';

import { addToArray, removeFromArray, editInArray, filterArrayByGroupId, sortArray } from './utils/array.utils';
import { getSize, correctCardAdjustment, createNewCard } from './utils/general.utils';

import Button from './components/Button/Button';
import FlipCard from './components/FlipCard/FlipCard';
import GroupSelect from './components/GroupSelect/GroupSelect';
import Header from './components/Header/Header';
import SquareGrid from './components/SquareGrid/SquareGrid';

const initialGroup: Group = {
	id: '1',
	name: 'Group 1',
}

const initialCards: Card[] = [
	{
		id: '1',
		groupId: '1',
		question: 'Hello',
		answer: 'World',
		points: 1,
	},
	{
		id: '2',
		groupId: '1',
		question: 'What is my name?',
		answer: 'Bob',
		points: 2,
	},
	{
		id: '3',
		groupId: '1',
		question: 'Favourite fruit?',
		answer: 'Strawberry',
		points: 0,
		lastChecked: 1674136289747,
		lastCheckingPeriod: '1 Hour'
	},
	{
		id: '4',
		groupId: '1',
		question: 'Favourite Dessert?',
		answer: 'Trifle',
		points: 0,
	},
	{
		id: '5',
		groupId: '1',
		question: 'Favourite Pizza?',
		answer: 'Pineapple and Pepper',
		points: 0,
	},
	{
		id: '6',
		groupId: '1',
		question: 'Good morning in German?',
		answer: 'Guten Morgen',
		points: 0,
		lastChecked: 1674136205133,
		lastCheckingPeriod: '1 Hour'
	},
	{
		id: '7',
		groupId: '1',
		question: 'Favourite battle royale?',
		answer: 'Fortnite',
		points: 3,
	},
	{
		id: '8',
		groupId: '1',
		question: 'Favourite game?',
		answer: 'Horizon: Forbidden West',
		points: 5,
		lastChecked: 1674136206133
	},
];

function App() {
	const [groups, setGroups] = useState<Group[]>([initialGroup]);
	const [cards, setCards] = useState<Card[]>(initialCards);
	const [currentGroup, setCurrentGroup] = useState<Group | undefined>(groups[0]);
	const [addingCard, setAddingCard] = useState(false);
	const [selectedCard, setSelectedCard] = useState<Card | null>(null);

	const onChangeGroup = (id: string) => {
		const newGroup = groups.find(group => group.id === id);
		if (newGroup) setCurrentGroup(newGroup);
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
		<div className="App">
			<Header text='Memoriser'/>
			<GroupSelect groups={groups} currentGroup={currentGroup} onChange={onChangeGroup} onAdd={onAddGroup} onEdit={onEditGroup} onDelete={onDeleteGroup}/>
			<Button value='New Card' onClick={onClickAddCard}/>
			<div id='firstCard'>
				{ firstCard ? <FlipCard key={'first-'+firstCard.id} width='300px' height='300px' card={firstCard} size='large' startInEditMode={addingCard} {...cardFunctions}/> : null }
			</div>
			<SquareGrid>
				{ sortedCards ? sortedCards.map((card, i) => i === 0 ? null : <div key={card.id} className={getSize(card)}><FlipCard card={card} size={getSize(card)} {...cardFunctions}/></div>) : null }
			</SquareGrid>
		</div>
	);
}

export default App;
