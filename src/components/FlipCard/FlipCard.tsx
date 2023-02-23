import React, { useCallback, useEffect, useState } from 'react';
import StyledFlipCard, { StyledInner, StyledTimer } from './FlipCard.style';
import { MdEdit } from 'react-icons/md';

import type { Card } from '../../types';

import Button from '../Button/Button';
import LabelledInput from '../LabelledInput/LabelledInput';
import { useEnterListener } from '../../utils/customHooks';
import { getTimeTillNextPoint } from '../../utils/date.utils';

type FlipCardProps = {
    viewingShared: boolean;
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
            <LabelledInput label='Question: ' value={newCard.question} onChange={onChangeValue} name='question' labelWidth='80px'/>
            <LabelledInput label='Answer: ' value={newCard.answer} onChange={onChangeValue} name='answer' labelWidth='80px'/>
            <div>
                <Button value='Save' onClick={onSaveCard}/>&nbsp;
                <Button value='Cancel' onClick={onCancel}/>&nbsp;
                <Button value='Delete' onClick={onDelete}/>
            </div>
        </div>
    );
}

const FlipCard = ({ viewingShared, speed=0.5, width='100%', height='100%', startInEditMode=false, card, size='large', onCorrect, onFail, onEdit, onDelete, onSelect }: FlipCardProps) => {
    const [flipped, setFlipped] = useState<boolean | undefined>(false);
    const [editMode, setEditMode] = useState(startInEditMode);
    const [timeToPoint, setTimeToPoint] = useState(getTimeTillNextPoint(card.lastChecked, card.lastCheckingPeriod));

    //update times for this card every minute
    useEffect(() => {
        setTimeToPoint(getTimeTillNextPoint(card.lastChecked, card.lastCheckingPeriod));
        if (size === 'large') {

            let interval = setInterval(() => {
                setTimeToPoint(getTimeTillNextPoint(card.lastChecked, card.lastCheckingPeriod));
            }, 60000);
    
            return () => {
                clearInterval(interval);
            };
        }
    }, [size, card.lastChecked, card.lastCheckingPeriod]);

    const onClick = () => {
        //if not a large card, move to top instead
        if (size === 'small' || size === 'medium') {
            onSelect(card); //can do something else here later
            return;
        }
        setFlipped(true);
    }

    const onClickHidden = () => {
        if (size !== 'large') {
            onSelect(card);
        }
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

    const getTimeText = () => {
        if (size === 'large') {
            if (timeToPoint === 'Ready') return `'Check now for another point!'`;
            else if (timeToPoint === '') return '';
            else return `'Check after ${timeToPoint} for another point'`
        } else return '';
    }

    const styledProps = {
        timeToPoint,
        size,
        flipped: editMode ? true : flipped,
        points: card.points,
        speed
    }

    return (
        <StyledFlipCard width={width} height={height} size={size}>
            <StyledInner className='visible' onClick={onClick} {...styledProps}>
                {card.question}
                <StyledTimer>{ getTimeText() }</StyledTimer>
            </StyledInner>
            <StyledInner className='hidden' onClick={onClickHidden} {...styledProps}>
                { editMode 
                    ? <EditMenu card={card} onSave={onSaveCard} onCancel={onCancelEdit} onDelete={onDeleteCard}/> 
                    : ( <div id='answer'>
                            <div>{card.answer}</div>
                            { viewingShared ? <Button value='Cancel' onClick={()=>setFlipped(false)}/> : (<div>
                                <Button value='Correct' onClick={onClickCorrect}/>&nbsp;
                                <Button value='Incorrect' onClick={onClickIncorrect}/>&nbsp;
                                <Button className='flipCardEditBtn' title='Edit' value={<MdEdit/>} onClick={onClickEdit}/>
                            </div>) }
                        </div> ) }
            </StyledInner>
        </StyledFlipCard>
    );
}

export default FlipCard;