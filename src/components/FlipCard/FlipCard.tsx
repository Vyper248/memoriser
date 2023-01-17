import { useState } from 'react';
import StyledFlipCard from './FlipCard.style';

import type { Card } from '../../types';

type FlipCardProps = {
    speed?: number;
    width?: string;
    height?: string;
    card: Card;
    onCorrect: (id:string)=>void;
    onFail: (id:string)=>void;
}

const FlipCard = ({ speed=0.5, width='250px', height='250px', card, onCorrect, onFail }: FlipCardProps) => {
    const [flipped, setFlipped] = useState<boolean | undefined>(undefined);

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
        <StyledFlipCard onClick={onClick} flipped={flipped} speed={speed} width={width} height={height}>
            <div className='visible'>{card.question}</div>
            <div className='hidden'>
                <div>
                    <div>{card.answer}</div>
                    <div>
                        <button onClick={onClickCorrect}>Correct</button>&nbsp;
                        <button onClick={onClickIncorrect}>Incorrect</button>
                    </div>
                </div>
            </div>
        </StyledFlipCard>
    );
}

export default FlipCard;