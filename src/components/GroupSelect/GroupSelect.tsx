import React, { useState, useCallback } from 'react';
import StyledGroupSelect from './GroupSelect.style';

import type { Group } from '../../types';

import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import DropdownMenu from '../DropdownMenu/DropdownMenu';
import LabelledInput from '../LabelledInput/LabelledInput';
import LinkedBorders from '../LinkedBorders/LinkedBorders';
import Dropdown from '../Dropdown/Dropdown';
import Label from '../Label/Label';

type GroupSelectProps = {
    groups: Group[];
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
    
    const onClickSave = useCallback((e: React.SyntheticEvent) => {
        e.preventDefault();
        onSave(newGroupName);
        setNewGroupName('');
    }, [newGroupName, onSave]);

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

const GroupSelect = ({ groups, currentGroup, viewingShared, onChange, onAdd, onEdit, onDelete }: GroupSelectProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [addingGroup, setAddingGroup] = useState(false);
    const [editingGroup, setEditingGroup] = useState(false);

    const onChangeGroup = (value: string) => {
        onChange(value);
    }

    const onClickAddGroup = () => {
        setModalOpen(true);
        setAddingGroup(true);
        setEditingGroup(false);
        //makes sure the clickOutside handler runs to close the DropdownMenu
        document.body.click();
    }

    const onClickEditGroup = () => {
        setModalOpen(true);
        setEditingGroup(true);
        setAddingGroup(false);
        //makes sure the clickOutside handler runs to close the DropdownMenu
        document.body.click();
    }

    const onClickDeleteGroup = () => {
        if (!currentGroup) return;

        onDelete(currentGroup);
        //makes sure the clickOutside handler runs to close the DropdownMenu
        document.body.click();
    }

    const onAddNewGroup = (newGroupName: string) => {
        //id based on time will always be unique for a single user
        const d = new Date();
        let id = d.getTime();

        let newGroup: Group = {
            id: `${id}`,
            name: newGroupName
        }

        setModalOpen(false);
        setAddingGroup(false);
        onAdd(newGroup);
    }

    const onCancelNewGroup = () => {
        // setNewGroupName('');
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
                { viewingShared ? null : (<DropdownMenu>
                    <Button value='New Group' onClick={onClickAddGroup}/>
                    <Button value='Edit Group' onClick={onClickEditGroup}/>
                    <Button value='Delete Group' onClick={onClickDeleteGroup}/>
                </DropdownMenu>) }
            </LinkedBorders>
            <Modal open={modalOpen}>
                { modalOpen && addingGroup ? <NewGroupMenu onSave={onAddNewGroup} onCancel={onCancelNewGroup}/> : null }
                { modalOpen && editingGroup ? <NewGroupMenu initialName={currentGroup?.name} onSave={onEditGroup} onCancel={onCancelNewGroup}/> : null }
            </Modal>
        </StyledGroupSelect>
    );
}

export default GroupSelect;