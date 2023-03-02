import React, { useState, useCallback } from 'react';
import StyledGroupSelect from './GroupSelect.style';

import type { Card, Group } from '../../types';

import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import ConfirmationButton from '../ConfirmationButton/ConfirmationButton';
import PopupMenu from '../PopupMenu/PopupMenu';
import LabelledInput from '../LabelledInput/LabelledInput';
import LinkedBorders from '../LinkedBorders/LinkedBorders';
import Dropdown from '../Dropdown/Dropdown';
import Label from '../Label/Label';
import { generateURL, onClearHash } from '../../utils/general.utils';

type GroupSelectProps = {
    groups: Group[];
    cards: Card[];
    currentGroup: Group | undefined;
    viewingShared: boolean;
    onChange: (id:string)=>void;
    onAdd: (group: Group)=>void;
    onEdit: (group: Group)=>void;
    onDelete: (group: Group)=>void;
}

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

const GroupSelect = ({ groups, cards, currentGroup, viewingShared, onChange, onAdd, onEdit, onDelete }: GroupSelectProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [addingGroup, setAddingGroup] = useState(false);
    const [editingGroup, setEditingGroup] = useState(false);
    const [copyText, setCopyText] = useState('');

    let invalidShareLink = window.location.hash.length > 0 && !viewingShared;

    const setCopiedText = () => {
        //set message for user for 2 seconds
        setCopyText('Copied link to clipboard!');
        setTimeout(() => {
            setCopyText('');
        }, 2000);
    }

    const onClickShareAll = () => {
        generateURL(cards, groups);
        setCopiedText();
	}

    const onClickShareSelected = () => {
        if (!currentGroup) return;

        let filteredCards = cards.filter(card => card.groupId === currentGroup.id);
        generateURL(filteredCards, [currentGroup]);
        setCopiedText();
    }

    const onChangeGroup = (value: string) => {
        onChange(value);
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
        if (!currentGroup) return;

        onDelete(currentGroup);
        //makes sure the clickOutside handler runs to close the PopupMenu
        document.body.click();
    }

    const onAddNewGroup = (newGroupName: string) => {
        //id based on time will always be unique for a single user
        const id = new Date().getTime();

        let newGroup: Group = {
            id: `${id}`,
            name: newGroupName
        }

        setModalOpen(false);
        setAddingGroup(false);
        onAdd(newGroup);
    }

    const onCancelNewGroup = () => {
        setModalOpen(false);
    }

    const onEditGroup = (groupName: string) => {
        if (!currentGroup) return;

        let newGroup: Group = {
            id: currentGroup.id,
            name: groupName
        }

        onEdit(newGroup);
        setModalOpen(false);
        setEditingGroup(false);
    }

    return (
        <StyledGroupSelect>
            <LinkedBorders>
                <Label value='Group'/>
                <Dropdown value={currentGroup?.id} onChange={onChangeGroup} options={groups.map(group => ({value: group.id, name: group.name}))}/>
                { viewingShared ? null : (<PopupMenu width='180px'>
                    <Button value='New Group' onClick={onClickAddGroup}/>
                    <Button value='Edit Group' onClick={onClickEditGroup}/>
                    <ConfirmationButton value='Delete Group' onClick={onClickDeleteGroup}/>
                    <hr/>
                    <Button value='Share All' onClick={onClickShareAll}/>
                    { currentGroup ? <Button value='Share Selected Group' onClick={onClickShareSelected}/> : null }
                    { copyText.length > 0 ? <p id='copyText'>{copyText}</p> : null }
                </PopupMenu>) }
            </LinkedBorders>
            { invalidShareLink ? <p id='warning' onClick={onClearHash}>Warning: Shared link is invalid, click here to clear.</p> : null }
            <Modal open={modalOpen}>
                { modalOpen && addingGroup ? <NewGroupMenu onSave={onAddNewGroup} onCancel={onCancelNewGroup}/> : null }
                { modalOpen && editingGroup ? <NewGroupMenu initialName={currentGroup?.name} onSave={onEditGroup} onCancel={onCancelNewGroup}/> : null }
            </Modal>
        </StyledGroupSelect>
    );
}

export default GroupSelect;