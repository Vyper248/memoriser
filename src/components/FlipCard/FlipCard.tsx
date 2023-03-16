import React, { useCallback, useEffect, useState } from 'react';
import StyledFlipCard, { StyledInner, StyledTimer, StyledPoints } from './FlipCard.style';
import { MdEdit } from 'react-icons/md';

import type { Card } from '../../types';

import { getTimeStringTillNextPoint } from '../../utils/date.utils';
import { useKeyboardControls } from '../../utils/customHooks';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { editCard, deleteCard, setAddingCard, setSelectedCard, cardCorrect, cardIncorrect, setFlippedCard } from '../../redux/mainSlice';

import Button from '../Button/Button';
import ConfirmationButton from '../ConfirmationButton/ConfirmationButton';
import LabelledInput from '../LabelledInput/LabelledInput';

type FlipCardProps = {
    speed?: number;
    width?: string;
    height?: string;
    startInEditMode?: boolean;
    card: Card;
    size?: string;
    first?: boolean;
}

type EditMenuProps = {
    card: Card;
    onSave: (card: Card)=>void;
    onCancel: ()=>void;
}

const EditMenu = ({ card, onSave, onCancel }: EditMenuProps) => {
    const dispatch = useAppDispatch();
    const [newCard, setNewCard] = useState({...card});
    
    const onSaveCard = useCallback((e: React.SyntheticEvent) => {
        e.preventDefault();
        onSave(newCard);
    }, [newCard, onSave]);

    const onChangeValue = (e: React.FormEvent<HTMLInputElement>) => {
        setNewCard({...newCard, [e.currentTarget.name]: e.currentTarget.value});
    }

    const onClickDelete = () => {
        dispatch(deleteCard(card));
    }

    return (
        <div>
            <form onSubmit={onSaveCard}>
                <LabelledInput label='Question: ' value={newCard.question} onChange={onChangeValue} name='question' labelWidth='80px'/>
                <LabelledInput label='Answer: ' value={newCard.answer} onChange={onChangeValue} name='answer' labelWidth='80px'/>
                <div>
                    <Button value='Save' type='submit' onClick={onSaveCard}/>&nbsp;
                    <Button value='Cancel' type='button' onClick={onCancel}/>&nbsp;
                    <ConfirmationButton value='Delete' type='button' onClick={onClickDelete}/>
                </div>
            </form>
        </div>
    );
}

const FlipCard = ({ speed=0.5, width='100%', height='100%', startInEditMode=false, card, size='large', first=false }: FlipCardProps) => {
    const dispatch = useAppDispatch();
    const [flipped, setFlipped] = useState(false);
    const [shake, setShake] = useState(false);
    const [editMode, setEditMode] = useState(startInEditMode);
    const [timeToPoint, setTimeToPoint] = useState(getTimeStringTillNextPoint(card.lastChecked, card.lastCheckingPeriod));
    const viewingShared = useAppSelector(state => state.main.viewingShared);
    const flippedCard = useAppSelector(state => state.main.flippedCard);

    //update times for this card every minute
    useEffect(() => {
        setTimeToPoint(getTimeStringTillNextPoint(card.lastChecked, card.lastCheckingPeriod));
        if (size === 'large') {

            let interval = setInterval(() => {
                setTimeToPoint(getTimeStringTillNextPoint(card.lastChecked, card.lastCheckingPeriod));
            }, 60000);
    
            return () => {
                clearInterval(interval);
            };
        }
    }, [size, card.lastChecked, card.lastCheckingPeriod]);

    useEffect(() => {
        if ((flippedCard === null || flippedCard.id !== card.id) && (flipped === true || editMode === true)) {
            setFlipped(false);
            setEditMode(false);
        }
    }, [flippedCard, card, flipped, editMode]);

    //if shake has been enabled, then disable after timer
    useEffect(() => {
        if (shake === true) {
            let timeout = setTimeout(() => setShake(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [shake]);

    const flipCard = () => {
        setFlipped(true);
        if (viewingShared === false) dispatch(setFlippedCard(card));
    }

    const unFlipCard = () => {
        setFlipped(false);
        dispatch(setFlippedCard(null));
    }

    const onClick = () => {
        //disable flipping any other card if one is already flipped
        if (flippedCard !== null && flippedCard.id !== card.id) {
            //animate to show can't be flipped
            setShake(true);
            return;
        }

        //if not a large card, make selected and enlarge in place
        if (size === 'small' || size === 'medium') {
            dispatch(setAddingCard(false));
		    dispatch(setSelectedCard(card));
            return;
        }

        flipCard();
    }

    const onClickCorrect = () => {
        dispatch(cardCorrect(card));
        unFlipCard();
    }

    const onClickIncorrect = () => {
        dispatch(cardIncorrect(card));
        unFlipCard();
    }

    const onSaveCard = (card: Card) => {
        dispatch(editCard(card));
        setEditMode(false);
    }

    const onCancelEdit = () => {
        setEditMode(false);
    }

    const onClickEdit = () => {
        setEditMode(true);
    }

    const getTimeText = () => {
        if (size === 'large') {
            if (timeToPoint === 'Ready') return `Check now for another point!`;
            else if (timeToPoint === '') return '';
            else return `Check after ${timeToPoint} for another point`
        } else return '';
    }

    //enable user to use keyboard for flipping top card, or answering any flipped card
    useKeyboardControls(first, flippedCard, flipped, editMode, flipCard, onClickCorrect, onClickIncorrect);

    const styledProps = {
        timeToPoint,
        size,
        speed,
        shake,
        points: card.points,
        flipped: editMode ? true : flipped,
        disabled: flippedCard && flippedCard.id !== card.id,
    }

    return (
        <StyledFlipCard width={width} height={height} size={size}>
            <StyledInner className='visible' onClick={onClick} {...styledProps}>
                { card.points && card.points > 0 && size === 'large' && !viewingShared ? <StyledPoints>{ card.points } points</StyledPoints> : null }
                {card.question}
                { !viewingShared ? <StyledTimer>{ getTimeText() }</StyledTimer> : null }
            </StyledInner>
            <StyledInner className='hidden' {...styledProps}>
                { editMode 
                    ? <EditMenu card={card} onSave={onSaveCard} onCancel={onCancelEdit}/> 
                    : ( <div id='answer'>
                            <div>{card.answer}</div>
                            { viewingShared ? <Button value='Cancel' onClick={unFlipCard}/> : (<div>
                                <Button value='Correct' onClick={onClickCorrect}/>&nbsp;
                                <Button value='Incorrect' onClick={onClickIncorrect}/>&nbsp;
                                <Button className='flipCardEditBtn' title='Edit' aria-label='Edit Flip Card' value={<MdEdit/>} onClick={onClickEdit}/>
                            </div>) }
                        </div> ) }
            </StyledInner>
        </StyledFlipCard>
    );
}

export default FlipCard;