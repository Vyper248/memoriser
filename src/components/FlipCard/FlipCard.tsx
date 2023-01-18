import { useState } from 'react';
import StyledFlipCard from './FlipCard.style';

import type { Card } from '../../types';

import Button from '../Button/Button';

type FlipCardProps = {
    speed?: number;
    width?: string;
    height?: string;
    startInEditMode?: boolean;
    card: Card;
    onCorrect: (id:string)=>void;
    onFail: (id:string)=>void;
    onEdit: (id:string)=>void;
    onDelete: (id:string)=>void;
}

type EditMenuProps = {
    card: Card;
}

const EditMenu = ({ card }: EditMenuProps) => {
    return (
        <div>
            <div>Question: <input value={card.question}/></div>
            <div>Answer: <input value={card.answer}/></div>
            <Button value='Save' onClick={()=>{}}/>
            <Button value='Cancel' onClick={()=>{}}/>
        </div>
    );
}

const FlipCard = ({ speed=0.5, width='250px', height='250px', startInEditMode=false, card, onCorrect, onFail, onEdit, onDelete }: FlipCardProps) => {
    const [flipped, setFlipped] = useState<boolean | undefined>(undefined);
    const [editMode, setEditMode] = useState(startInEditMode);

    const onClick = () => {
        setFlipped(flipped => !flipped);
    }

    const onClickCorrect = () => {
        onCorrect(card.id);
    }

    const onClickIncorrect = () => {
        onFail(card.id);
    }

    return (
        <StyledFlipCard onClick={onClick} flipped={editMode ? true : flipped} speed={speed} width={width} height={height}>
            <div className='visible'>{card.question}</div>
            <div className='hidden'>
                { editMode 
                    ? <EditMenu card={card}/> 
                    : ( <div>
                            <div>{card.answer}</div>
                            <div>
                                <Button value='Correct' onClick={onClickCorrect}/>&nbsp;
                                <Button value='Incorrect' onClick={onClickIncorrect}/>
                            </div> 
                        </div> ) }
            </div>
        </StyledFlipCard>
    );
}

export default FlipCard;