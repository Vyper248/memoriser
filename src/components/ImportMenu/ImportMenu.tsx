import { useState } from "react";
import StyledImportMenu from "./ImportMenu.style";

import { getLocalData } from "../../utils/general.utils";
import { importSharedData, mergeSharedData, mergeWithSelectedGroup } from '../../utils/importing.utils';

import Button from "../Button/Button";
import LinkedBorders from "../LinkedBorders/LinkedBorders";

import type { Group, Card } from "../../types";

type ImportMenuProps = {
	cards: Card[];
	groups: Group[];
	currentGroup: Group | undefined;
}

const ImportMenu = ({cards, groups, currentGroup}: ImportMenuProps) => {
	const [mergeGroup, setMergeGroup] = useState('');

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
		if (currentGroup === undefined) return;

		let selectedGroup = currentGroup as Group;
		let filteredCards = cards.filter(card => card.groupId === selectedGroup.id);
		mergeWithSelectedGroup(filteredCards, mergeGroup);
		onCancelShare();
	}

	const onChangeMergeGroup = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setMergeGroup(e.target.value);
	}	

	let { localDataGroups } = getLocalData();	

	return (
		<StyledImportMenu>
			<Button value='Back to your groups' onClick={onCancelShare}/>
			<Button value='Add All' onClick={onAddShared}/>
			{ localDataGroups.length > 0 ? <Button value='Merge All' onClick={onMergeShared}/> : null }
			{ localDataGroups.length > 0 ? <>
				<br/>
				<LinkedBorders>
					<label style={{backgroundColor: '#DDD'}}>Merge Selected Group With</label>
					<select onChange={onChangeMergeGroup}>
						{ localDataGroups.map(group => <option key={'localGroups-'+group.id} value={group.id}>{group.name}</option>) }
					</select>
					<Button value='Go' onClick={onMergeWithGroup}/>
				</LinkedBorders>
				<br/>
				<br/>
			</> : null }	
		</StyledImportMenu>
	);
}

export default ImportMenu;
