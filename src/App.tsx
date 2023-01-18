import { useState } from 'react';
import './App.css';

import type { Card, Group } from './types';

import { addToArray, removeFromArray, editInArray, filterArrayByGroupId, sortArray, getNextValue } from './utils/array.utils';
import { timeSinceLastChecked } from './utils/date.utils';

import Button from './components/Button/Button';
import FlipCard from './components/FlipCard/FlipCard';
import GroupSelect from './components/GroupSelect/GroupSelect';
import Header from './components/Header/Header';
import SquareGrid from './components/SquareGrid/SquareGrid';

const initialGroup: Group = {
	id: '1',
	name: 'Group 1',
}

const secondGroup: Group = {
	id: '2',
	name: 'Group 2',
}

const checkingPeriods = [
	'1 Hour', '2 Hours', '4 Hours', '8 Hours',
	'1 Day', '2 Days', '4 Days',
	'1 Week', '2 Weeks',
	'1 Month'
];

function App() {
	const [groups, setGroups] = useState<Group[]>([initialGroup, secondGroup]);
	const [cards, setCards] = useState<Card[]>([]);
	const [currentGroup, setCurrentGroup] = useState<Group | undefined>(groups[0]);
	const [addingCard, setAddingCard] = useState(true);

	const onChangeGroup = (id: string) => {
		const newGroup = groups.find(group => group.id === id);
		if (newGroup) setCurrentGroup(newGroup);
	}

	const onAddGroup = (group: Group) => {
		let newGroups = [...groups, group];
		setGroups(newGroups);
	}

	const onClickAddCard = () => {
		if (!currentGroup) return;

		setAddingCard(true);

		//create new card
		let newId = new Date().getTime();
		let newCard: Card = {
			id: `${newId}`,
			groupId: currentGroup.id,
			question: 'Question?',
			answer: 'Answer',
			points: 0,
			lastChecked: newId,
			lastCheckingPeriod: '1 Hour'
		}

		//add to beginning of current group
		addCard(newCard);
	}

	const addCard = (card: Card) => {
		let newCards = addToArray(card, cards);
		setCards(newCards);
	}

	const onEditCard = (card: Card) => {
		let newCards = editInArray(card, cards);
		setCards(newCards);
		setAddingCard(false);
	}

	const onDeleteCard = (card: Card) => {
		let newCards = removeFromArray(card, cards);
		setCards(newCards);
	}

	const onCorrectAnswer = (card: Card) => {
		let adjustTimes = timeSinceLastChecked(card.lastChecked, card.lastCheckingPeriod);
		let points = card.points !== undefined ? card.points + 1 : 1;
		//this will stop people repeatedly answering a question correctly to get lots of points
		//only allow points after time periods have passed
		points = adjustTimes || card.points === 0 ? points : card.points || 1;
		let lastChecked = adjustTimes ? new Date().getTime() : card.lastChecked;
		let lastCheckingPeriod = adjustTimes ? getNextValue(card.lastCheckingPeriod, checkingPeriods) : card.lastCheckingPeriod;
		let newCards = editInArray({...card, points, lastChecked, lastCheckingPeriod}, cards);
		setCards(newCards);
	}

	const onIncorrectAnswer = (card: Card) => {
		let lastChecked = new Date().getTime()
		let newCards = editInArray({...card, points: 0, lastChecked, lastCheckingPeriod: '1 Hour'}, cards);
		setCards(newCards);
	}

	let firstCard;
	let sortedCards;
	if (currentGroup) {
		const filteredCards = filterArrayByGroupId(currentGroup.id, cards);
		sortedCards = sortArray(filteredCards);
		firstCard = sortedCards[0];
	}

	const cardFunctions = {
		onCorrect: onCorrectAnswer,
		onFail: onIncorrectAnswer,
		onEdit: onEditCard,
		onDelete: onDeleteCard
	}

	return (
		<div className="App">
			<Header text='Memoriser'/>
			<GroupSelect groups={groups} currentGroup={currentGroup} onChange={onChangeGroup} onAdd={onAddGroup}/>
			<Button value='New Card' onClick={onClickAddCard}/>
			{ firstCard ? <FlipCard key={'first-'+firstCard.id} card={firstCard} startInEditMode={addingCard} {...cardFunctions}/> : null }
			<SquareGrid>
				{ sortedCards ? sortedCards.map((card, i) => i === 0 ? null : <div key={card.id} className='medium'><FlipCard card={card} width='100%' height='100%' {...cardFunctions}/></div>) : null }
			</SquareGrid>
		</div>
	);
}

export default App;
