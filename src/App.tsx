import { useState } from 'react';
import './App.css';
import FlipCard from './components/FlipCard/FlipCard';
import GroupSelect from './components/GroupSelect/GroupSelect';

import type { Group } from './types';

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
	const [currentGroup, setCurrentGroup] = useState('1');

	const onChangeGroup = (id: string) => {
		setCurrentGroup(id);
	}

	const onAddGroup = (group: Group) => {
		let newGroups = [...groups, group];
		setGroups(newGroups);
	}

	return (
		<div className="App">
			<GroupSelect groups={groups} currentGroup={currentGroup} onChange={onChangeGroup} onAdd={onAddGroup}/>
			<FlipCard card={{id: '1', question: 'Hello?', answer: 'World'}} onCorrect={()=>{}} onFail={()=>{}}/>
		</div>
	);
}

export default App;
