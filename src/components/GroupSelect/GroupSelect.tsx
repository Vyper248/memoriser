import React, { useState } from 'react';
import StyledGroupSelect from './GroupSelect.style';

import type { Group } from '../../types';

import Modal from '../Modal/Modal';

type GroupSelectProps = {
    groups: Group[],
    currentGroup: string,
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
            name: newGroupName,
            cards: []
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
            <select role="select" onChange={onChangeGroup} value={currentGroup}>
                {
                    groups.map((group, i) => <option key={`groupName-${group.name}-${i}`} value={group.id}>{group.name}</option>)
                }
            </select>
            <button onClick={onClickAddGroup}>New Group</button>
            <Modal open={modalOpen}>
                <h2>Add New Group</h2>
                <input value={newGroupName} onChange={onChangeNewGroupName}/>
                <br/>
                <br/>
                <button onClick={onCancelNewGroup}>Cancel</button>&nbsp;
                <button onClick={onAddNewGroup}>Add</button>
            </Modal>
        </StyledGroupSelect>
    );
}

export default GroupSelect;