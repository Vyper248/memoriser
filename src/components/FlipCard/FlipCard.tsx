import React, { useState } from 'react';
import StyledFlipCard from './FlipCard.style';

import type { Card } from '../../types';

import Button from '../Button/Button';

type FlipCardProps = {
    speed?: number;
    width?: string;
    height?: string;
    startInEditMode?: boolean;
    card: Card;
    onCorrect: (card:Card)=>void;
    onFail: (card:Card)=>void;
    onEdit: (card:Card)=>void;
    onDelete: (card:Card)=>void;
}

type EditMenuProps = {
    card: Card;
    onSave: (card: Card)=>void;
    onCancel: ()=>void;
    onDelete: ()=>void;
}

const EditMenu = ({ card, onSave, onCancel, onDelete }: EditMenuProps) => {
    const [newCard, setNewCard] = useState({...card});

    const onSaveCard = () => {
        onSave(newCard);
    }

    const onChangeValue = (e: React.FormEvent<HTMLInputElement>) => {
        setNewCard({...newCard, [e.currentTarget.name]: e.currentTarget.value});
    }

    return (
        <div>
            <div>Question: <input value={newCard.question} onChange={onChangeValue} name='question'/></div>
            <div>Answer: <input value={newCard.answer} onChange={onChangeValue} name='answer'/></div>
            <Button value='Save' onClick={onSaveCard}/>
            <Button value='Cancel' onClick={onCancel}/>
            <Button value='Delete' onClick={onDelete}/>
        </div>
    );
}

const FlipCard = ({ speed=0.5, width='250px', height='250px', startInEditMode=false, card, onCorrect, onFail, onEdit, onDelete }: FlipCardProps) => {
    const [flipped, setFlipped] = useState<boolean | undefined>(undefined);
    const [editMode, setEditMode] = useState(startInEditMode);

    const onClick = () => {
        // setFlipped(flipped => !flipped);
        setFlipped(true);
    }

    const onClickCorrect = () => {
        onCorrect(card);
        setFlipped(false);
    }

    const onClickIncorrect = () => {
        onFail(card);
        setFlipped(false);
    }

    const onSaveCard = (card: Card) => {
        onEdit(card);
        setEditMode(false);
        setFlipped(false);
    }

    const onCancelEdit = () => {
        setEditMode(false);
        setFlipped(false);
    }

    const onDeleteCard = () => {
        onDelete(card);
    }

    const onClickEdit = () => {
        setEditMode(true);
    }

    return (
        <StyledFlipCard flipped={editMode ? true : flipped} speed={speed} width={width} height={height} points={card.points}>
            <div className='visible' onClick={onClick}>{card.question}</div>
            <div className='hidden'>
                { editMode 
                    ? <EditMenu card={card} onSave={onSaveCard} onCancel={onCancelEdit} onDelete={onDeleteCard}/> 
                    : ( <div>
                            <div>{card.answer}</div>
                            <div>
                                <Button value='Correct' onClick={onClickCorrect}/>&nbsp;
                                <Button value='Incorrect' onClick={onClickIncorrect}/>&nbsp;
                                <Button value='Edit' onClick={onClickEdit}/>
                            </div> 
                        </div> ) }
            </div>
        </StyledFlipCard>
    );
}

export default FlipCard;