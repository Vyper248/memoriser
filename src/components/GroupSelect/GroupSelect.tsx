import React, { useState, useCallback } from 'react';
import StyledGroupSelect from './GroupSelect.style';

import { useEnterListener } from '../../utils/customHooks';

import type { Group } from '../../types';

import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import DropdownMenu from '../DropdownMenu/DropdownMenu';
import LabelledInput from '../LabelledInput/LabelledInput';

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
    
    const onClickSave = useCallback(() => {
        onSave(newGroupName);
        setNewGroupName('');
    }, [newGroupName, onSave]);
    
    useEnterListener('groupNameInput', onClickSave);

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
            <LabelledInput inputID='groupNameInput' label='Name: ' value={newGroupName} onChange={onChangeNewGroupName} autofocus/>
            <br/>
            <Button value='Cancel' onClick={onClickCancel}/>&nbsp;
            <Button value='Save' onClick={onClickSave}/>
        </>
    );
}

const GroupSelect = ({ groups, currentGroup, viewingShared, onChange, onAdd, onEdit, onDelete }: GroupSelectProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [addingGroup, setAddingGroup] = useState(false);
    const [editingGroup, setEditingGroup] = useState(false);

    const onChangeGroup = (e: React.FormEvent<HTMLSelectElement>) => {
        onChange(e.currentTarget.value);
    }

    const onClickAddGroup = () => {
        setModalOpen(true);
        setAddingGroup(true);
        setEditingGroup(false);
    }

    const onClickEditGroup = () => {
        setModalOpen(true);
        setEditingGroup(true);
        setAddingGroup(false);
    }

    const onClickDeleteGroup = () => {
        if (!currentGroup) return;

        onDelete(currentGroup);
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
        // setNewGroupName('');
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
            <label>Group</label>
            <select onChange={onChangeGroup} value={currentGroup?.id}>
                {
                    groups.map((group, i) => <option key={`groupName-${group.name}-${i}`} value={group.id}>{group.name}</option>)
                }
            </select>
            { viewingShared ? null : (<DropdownMenu>
                <Button value='New Group' onClick={onClickAddGroup}/>
                <Button value='Edit Group' onClick={onClickEditGroup}/>
                <Button value='Delete Group' onClick={onClickDeleteGroup}/>
            </DropdownMenu>) }
            <Modal open={modalOpen}>
                { modalOpen && addingGroup ? <NewGroupMenu onSave={onAddNewGroup} onCancel={onCancelNewGroup}/> : null }
                { modalOpen && editingGroup ? <NewGroupMenu initialName={currentGroup?.name} onSave={onEditGroup} onCancel={onCancelNewGroup}/> : null }
            </Modal>
        </StyledGroupSelect>
    );
}

export default GroupSelect;