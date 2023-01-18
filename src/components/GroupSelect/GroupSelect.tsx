import React, { useState } from 'react';
import StyledGroupSelect from './GroupSelect.style';

import type { Group } from '../../types';

import Modal from '../Modal/Modal';
import Button from '../Button/Button';

type GroupSelectProps = {
    groups: Group[],
    currentGroup: Group | undefined,
    onChange: (id:string)=>void,
    onAdd: (group: Group)=>void,
}

const GroupSelect = ({ groups, currentGroup, onChange, onAdd }: GroupSelectProps) => {
    const [newGroupName, setNewGroupName] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    const onChangeGroup = (e: React.FormEvent<HTMLSelectElement>) => {
        onChange(e.currentTarget.value);
    }

    const onChangeNewGroupName = (e: React.FormEvent<HTMLInputElement>) => {
        setNewGroupName(e.currentTarget.value);
    }

    const onClickAddGroup = () => {
        setModalOpen(true);
    }

    const onAddNewGroup = () => {
        //id based on time will always be unique for a single user
        const d = new Date();
        let id = d.getTime();

        let newGroup: Group = {
            id: `${id}`,
            name: newGroupName
        }

        setModalOpen(false);
        setNewGroupName('');
        onAdd(newGroup);
    }

    const onCancelNewGroup = () => {
        setNewGroupName('');
        setModalOpen(false);
    }

    return (
        <StyledGroupSelect>
            <select role="select" onChange={onChangeGroup} value={currentGroup?.id}>
                {
                    groups.map((group, i) => <option key={`groupName-${group.name}-${i}`} value={group.id}>{group.name}</option>)
                }
            </select>
            <Button value='New Group' onClick={onClickAddGroup}/>
            <Modal open={modalOpen}>
                <h2>Add New Group</h2>
                <input value={newGroupName} onChange={onChangeNewGroupName}/>
                <br/>
                <br/>
                <Button value='Cancel' onClick={onCancelNewGroup}/>&nbsp;
                <Button value='Add' onClick={onAddNewGroup}/>
            </Modal>
        </StyledGroupSelect>
    );
}

export default GroupSelect;