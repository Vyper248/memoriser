import { useEffect } from 'react';
import StyledMainPage from './MainPage.style';

import type { Card } from '../../types';

import { filterArrayByGroupId } from '../../utils/array.utils';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setSelectedGroup, addCard } from '../../redux/mainSlice';

import Button from '../../components/Button/Button';
import GroupSelect from '../../components/GroupSelect/GroupSelect';
import Header from '../../components/Header/Header';
import GridSorter from '../../components/GridSorter/GridSorter';
import ImportMenu from '../../components/ImportMenu/ImportMenu';

const MainPage = () => {
	const dispatch = useAppDispatch();
	const viewingShared = useAppSelector(state => state.main.viewingShared);
	const selectedGroup = useAppSelector(state => state.main.selectedGroup);
	const cards = useAppSelector(state => state.main.cards);
	const groups = useAppSelector(state => state.main.groups);

    //make sure current group is correct after loading data from local storage
    useEffect(() => {
        let groupCheck = groups.find(group => group.id === selectedGroup?.id);
        if (!groupCheck) dispatch(setSelectedGroup(groups[0]));
    }, [groups, selectedGroup, dispatch]);

	const onClickAddCard = () => {
		dispatch(addCard());
	}

	let cardsInGroup = [] as Card[];
	if (selectedGroup) {
		cardsInGroup = filterArrayByGroupId(selectedGroup.id, cards);
	}

	return (
		<StyledMainPage>
			<Header text='Practise with Cards'/>
			{ viewingShared ? <ImportMenu/> : null }
			<GroupSelect/>
			{ viewingShared || !selectedGroup ? null : <Button value='New Card' onClick={onClickAddCard}/> }
			<GridSorter cards={cardsInGroup}/>
		</StyledMainPage>
	);
}

export default MainPage;