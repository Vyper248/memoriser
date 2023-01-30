import React, { useCallback, useState } from 'react';
import StyledFlipCard from './FlipCard.style';

import type { Card } from '../../types';

import Button from '../Button/Button';
import { useEnterListener } from '../../utils/customHooks';

type FlipCardProps = {
    speed?: number;
    width?: string;
    height?: string;
    startInEditMode?: boolean;
    card: Card;
    size?: string;
    onCorrect: (card:Card)=>void;
    onFail: (card:Card)=>void;
    onEdit: (card:Card)=>void;
    onDelete: (card:Card)=>void;
    onSelect: (card:Card)=>void;
}

type EditMenuProps = {
    card: Card;
    onSave: (card: Card)=>void;
    onCancel: ()=>void;
    onDelete: ()=>void;
}

const EditMenu = ({ card, onSave, onCancel, onDelete }: EditMenuProps) => {
    const [newCard, setNewCard] = useState({...card});
    
    const onSaveCard = useCallback(() => {
        onSave(newCard);
    }, [newCard, onSave]);

    useEnterListener('editCardQuestion', onSaveCard);
    useEnterListener('editCardAnswer', onSaveCard);

    const onChangeValue = (e: React.FormEvent<HTMLInputElement>) => {
        setNewCard({...newCard, [e.currentTarget.name]: e.currentTarget.value});
    }

    return (
        <div>
            <div>Question: <input id='editCardQuestion' value={newCard.question} onChange={onChangeValue} name='question'/></div>
            <div>Answer: <input id='editCardAnswer' value={newCard.answer} onChange={onChangeValue} name='answer'/></div>
            <Button value='Save' onClick={onSaveCard}/>
            <Button value='Cancel' onClick={onCancel}/>
            <Button value='Delete' onClick={onDelete}/>
        </div>
    );
}

const FlipCard = ({ speed=0.5, width='100%', height='100%', startInEditMode=false, card, size='large', onCorrect, onFail, onEdit, onDelete, onSelect }: FlipCardProps) => {
    const [flipped, setFlipped] = useState<boolean | undefined>(undefined);
    const [editMode, setEditMode] = useState(startInEditMode);

    const onClick = () => {
        //if not a large card, move to top instead
        if (size === 'small' || size === 'medium') {
            onSelect(card); //can do something else here later
            return;
        }
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
        setFlipped(true);
    }

    const onCancelEdit = () => {
        setEditMode(false);
        setFlipped(true);
    }

    const onDeleteCard = () => {
        onDelete(card);
    }

    const onClickEdit = () => {
        setEditMode(true);
    }

    return (
        <StyledFlipCard flipped={editMode ? true : flipped} speed={speed} width={width} height={height} points={card.points} size={size}>
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