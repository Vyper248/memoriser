import { useState } from "react";
import StyledImportMenu from "./ImportMenu.style";

import { getLocalData } from "../../utils/general.utils";
import { importSharedData, mergeSharedData, mergeWithSelectedGroup } from '../../utils/importing.utils';
import { useAppSelector } from "../../redux/hooks";

import Button from "../Button/Button";
import LinkedBorders from "../LinkedBorders/LinkedBorders";
import Dropdown from "../Dropdown/Dropdown";
import Label from "../Label/Label";

const ImportMenu = () => {
	const selectedGroup = useAppSelector(state => state.main.selectedGroup);
	const cards = useAppSelector(state => state.main.cards);
	const groups = useAppSelector(state => state.main.groups);

	let { localDataGroups } = getLocalData();
	const [mergeGroup, setMergeGroup] = useState(localDataGroups[0]?.id || '');

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
		if (selectedGroup === null) return;

		let filteredCards = cards.filter(card => card.groupId === selectedGroup.id);
		mergeWithSelectedGroup(filteredCards, mergeGroup);
		onCancelShare();
	}

	const onChangeMergeGroup = (value: string) => {
		setMergeGroup(value);
	}

	return (
		<StyledImportMenu>
			<Button value='Back to your groups' onClick={onCancelShare}/>
			<Button value='Add All' onClick={onAddShared}/>
			{ localDataGroups.length > 0 ? <Button value='Merge All' onClick={onMergeShared}/> : null }
			{ localDataGroups.length > 0 ? <>
				<br/>
				<LinkedBorders>
					<Label value='Merge Selected Group With'/>
					<Dropdown value={mergeGroup} onChange={onChangeMergeGroup} options={localDataGroups.map(group => ({value: group.id, name: group.name}))}/>
					<Button value='Go' onClick={onMergeWithGroup}/>
				</LinkedBorders>
				<br/>
				<br/>
			</> : null }	
		</StyledImportMenu>
	);
}

export default ImportMenu;
