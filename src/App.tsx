import { useState } from 'react';
import './App.css';
import Button from './components/Button/Button';

import FlipCard from './components/FlipCard/FlipCard';
import GroupSelect from './components/GroupSelect/GroupSelect';
import Header from './components/Header/Header';

import type { Card, Group } from './types';

const initialGroup: Group = {
	id: '1',
	name: 'Group 1',
	cards: []
}

const secondGroup: Group = {
	id: '2',
	name: 'Group 2',
	cards: []
}

function App() {
	const [groups, setGroups] = useState([initialGroup, secondGroup]);
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
		setAddingCard(true);

		//create new card
		let newId = new Date().getTime();
		let newCard: Card = {
			id: `${newId}`,
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
		if (!currentGroup) return;

		//create new cards array
		let newCards = [card, ...currentGroup.cards];

		//add to current group within groups array
		let newCurrentGroup;
		setGroups(groups.map(group => {
			if (group === currentGroup) {
				group.cards = newCards;
				newCurrentGroup = group;
			}
			return group;
		}));
		//make sure current group is updated
		setCurrentGroup(newCurrentGroup);
	}

	let firstCard;
	if (currentGroup) {
		const cards = currentGroup.cards;
		firstCard = cards[0];
	}

	return (
		<div className="App">
			<Header text='Memoriser'/>
			<GroupSelect groups={groups} currentGroup={currentGroup} onChange={onChangeGroup} onAdd={onAddGroup}/>
			<Button value='New Card' onClick={onClickAddCard}/>
			{ firstCard ? <FlipCard card={firstCard} startInEditMode={addingCard} 
									onCorrect={()=>{}} onFail={()=>{}} 
									onEdit={()=>{}} onDelete={()=>{}}/> : null }
		</div>
	);
}

export default App;
