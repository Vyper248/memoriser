import React, { useState } from 'react';
import StyledGroupSelect from './GroupSelect.style';
import { FaFilter, FaShareAlt } from 'react-icons/fa';

import type { Group } from '../../types';

import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { addGroup, editGroup, deleteGroup, setSelectedGroup } from '../../redux/mainSlice';
import { onClearHash } from '../../utils/general.utils';

import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import ConfirmationButton from '../ConfirmationButton/ConfirmationButton';
import PopupMenu from '../PopupMenu/PopupMenu';
import LabelledInput from '../LabelledInput/LabelledInput';
import LinkedBorders from '../LinkedBorders/LinkedBorders';
import Dropdown from '../Dropdown/Dropdown';
import Label from '../Label/Label';
import FilterMenu from '../FilterMenu/FilterMenu';
import ShareMenu from '../ShareMenu/ShareMenu';

type NewGroupMenuProps = {
    initialName?: string;
    onSave: (newGroupName: string)=>void;
    onCancel: ()=>void;
}

const NewGroupMenu = ({initialName='', onSave, onCancel}: NewGroupMenuProps) => {
    const [newGroupName, setNewGroupName] = useState(initialName);

    const onClickSave = (e: React.SyntheticEvent) => {
        e.preventDefault();
        onSave(newGroupName);
        setNewGroupName('');
    }

    const onClickCancel = () => {
        onCancel();
        setNewGroupName('');
    }

    const onChangeNewGroupName = (e: React.FormEvent<HTMLInputElement>) => {
        setNewGroupName(e.currentTarget.value);
    }

    return (
        <>
            <h2>Add New Group</h2>
            <form onSubmit={onClickSave}>
                <LabelledInput inputID='groupNameInput' label='Name: ' value={newGroupName} onChange={onChangeNewGroupName} autofocus/>
                <br/>
                <Button value='Save' type='submit' onClick={onClickSave}/>
                <Button value='Cancel' type='button' onClick={onClickCancel}/>&nbsp;
            </form>
        </>
    );
}

const GroupSelect = () => {
    const dispatch = useAppDispatch();
    const [modalOpen, setModalOpen] = useState(false);
    const [addingGroup, setAddingGroup] = useState(false);
    const [editingGroup, setEditingGroup] = useState(false);
    const viewingShared = useAppSelector(state => state.main.viewingShared);
    const selectedGroup = useAppSelector(state => state.main.selectedGroup);
    const groups = useAppSelector(state => state.main.groups);

    let invalidShareLink = window.location.hash.length > 0 && !viewingShared;

    const onChangeGroup = (value: string) => {
        const newGroup = groups.find(group => group.id === value);
        if (newGroup) dispatch(setSelectedGroup(newGroup));
    }

    const onClickAddGroup = () => {
        setModalOpen(true);
        setAddingGroup(true);
        setEditingGroup(false);
        //makes sure the clickOutside handler runs to close the PopupMenu
        document.body.click();
    }

    const onClickEditGroup = () => {
        setModalOpen(true);
        setEditingGroup(true);
        setAddingGroup(false);
        //makes sure the clickOutside handler runs to close the PopupMenu
        document.body.click();
    }

    const onClickDeleteGroup = () => {
        if (!selectedGroup) return;

        dispatch(deleteGroup(selectedGroup));
        //makes sure the clickOutside handler runs to close the PopupMenu
        document.body.click();
    }

    const onAddNewGroup = (newGroupName: string) => {
        //id based on time will always be unique for a single user
        const id = new Date().getTime();

        setModalOpen(false);
        setAddingGroup(false);
        dispatch(addGroup({id: `${id}`, name: newGroupName}));
    }

    const onCancelNewGroup = () => {
        setModalOpen(false);
    }

    const onEditGroup = (groupName: string) => {
        if (!selectedGroup) return;

        let newGroup: Group = {
            id: selectedGroup.id,
            name: groupName
        }

        dispatch(editGroup(newGroup));
        setModalOpen(false);
        setEditingGroup(false);
    }

    return (
        <StyledGroupSelect>
            <LinkedBorders>
                <Label value='Group'/>
                <Dropdown value={selectedGroup?.id} onChange={onChangeGroup} options={groups.map(group => ({value: group.id, name: group.name}))}/>
                { viewingShared ? null : (<PopupMenu width='180px'>
                    <Button value='New Group' onClick={onClickAddGroup}/>
                    <Button value='Edit Group' onClick={onClickEditGroup}/>
                    <ConfirmationButton value='Delete Group' onClick={onClickDeleteGroup}/>
                </PopupMenu>) }
                { viewingShared ? null : <PopupMenu width='180px' icon={<FaShareAlt/>} iconSize='1em'><ShareMenu/></PopupMenu> }
                { viewingShared ? null : (<PopupMenu icon={<FaFilter/>} iconSize='1em'><FilterMenu/></PopupMenu>) }
            </LinkedBorders>
            { invalidShareLink ? <p id='warning' onClick={onClearHash}>Warning: Shared link is invalid, click here to clear.</p> : null }
            <Modal open={modalOpen}>
                { modalOpen && addingGroup ? <NewGroupMenu onSave={onAddNewGroup} onCancel={onCancelNewGroup}/> : null }
                { modalOpen && editingGroup ? <NewGroupMenu initialName={selectedGroup?.name} onSave={onEditGroup} onCancel={onCancelNewGroup}/> : null }
            </Modal>
        </StyledGroupSelect>
    );
}

export default GroupSelect;