import { ReactNode, useEffect, useState } from 'react';
import StyledGridSorter, { StyledGridSquare } from './GridSorter.style';

import { getGridValues, getCardArray } from './GridSorter.utils';
import { useResizeListener, useScrollListener } from '../../utils/customHooks';
import { useAppSelector } from '../../redux/hooks';

import type { Card } from '../../types';

import FlipCard from '../FlipCard/FlipCard';

type GridSorterProps = {
    cards: Card[];
}

interface PositionedCardExtra {
    x: number;
    y: number;
    size: string;
    first: boolean;
}

export type PositionedCard = Card & PositionedCardExtra;

interface GridSquareProps extends PositionedCardExtra {
    children: ReactNode;
}

export type CardObj = { [key: string]: PositionedCard };
export type LocationObj = { [key: string]: boolean | number, startX: number, startY: number };

const GridSquare = ({x=0, y=0, size, first=false, children}: GridSquareProps) => {
    const { gridSize, leftover } = getGridValues();

    let widthHeight: number = gridSize;
    if (size === 'medium') widthHeight = gridSize * 2;
    if (size === 'large') widthHeight = gridSize * 3;

    let left = x * gridSize;
    left += leftover;
    if (first) left = window.innerWidth/2 - 150;

    //move all cards down
    y += 4;

    return (
        <StyledGridSquare size={widthHeight} style={{transform: `translate(${left}px, ${y*gridSize}px)`}}>
            { children }
        </StyledGridSquare>
    );
};

const GridSorter = ({cards}: GridSorterProps) => {
    const [resized, updateLayout] = useState(0);
    const [scrollPos, setScrollPos] = useState(window.scrollY + window.innerHeight);
    const [highestY, setHighestY] = useState(0);
    const [savedCardId, setSavedCardId] = useState('');
    const [newCards, setNewCards] = useState<PositionedCard[]>([]);
    const selectedCard = useAppSelector(state => state.main.selectedCard);
    const selectedGroup = useAppSelector(state => state.main.selectedGroup);
    const addingCard = useAppSelector(state => state.main.addingCard);
    const filter = useAppSelector(state => state.main.filter);
    const flippedCard = useAppSelector(state => state.main.flippedCard);

    const { gridSize } = getGridValues();

    //If a card is flipped, add it to a scrollSet so it doesn't disappear when it goes offscreen (even after no longer flipped).
    useEffect(() => {
        if (flippedCard) {
            setSavedCardId(flippedCard.id);
        }
    }, [flippedCard]);

    //get card array, with position information
    useEffect(() => {
        const { newCards, highestY } = getCardArray(cards, addingCard, selectedCard, filter);
        setHighestY(highestY);
        setNewCards(newCards);
    }, [cards, addingCard, selectedCard, filter, resized]);

    //if screen is resized, update grid layout and set new scroll position
    useResizeListener(() => {
        updateLayout(reset => reset+1);
        setScrollPos(window.scrollY + window.innerHeight);
    }, 200);

    //if scrolling, update scroll position
    useScrollListener(() => {
        setScrollPos(window.scrollY + window.innerHeight);
    });

    //if changing groups, reset scroll position and Set
    useEffect(() => {
        setScrollPos(window.scrollY + window.innerHeight);
        setSavedCardId('');
    }, [selectedGroup]);

    //Check card position. If offscreen and not in the Set, don't display it.
    //If onscreen, add to set and display
    //Set allows cards that are in display to remain in display even if they move offscreen, preserving the movement animation
    const checkCardPos = (card: PositionedCard) => {
        let cardPos = ((card.y + 3) * gridSize); // +150 for actual position
        if (cardPos > scrollPos && card.id !== savedCardId) return false;
        if (cardPos + 150 + 300 < window.scrollY) return false;
        return true;
    }

    return (
        <StyledGridSorter y={highestY} gridSize={gridSize}>
            {
                newCards.map(card => {
                    if (checkCardPos(card) === false) return null;
                    return <GridSquare key={card.id} x={card.x} y={card.y} size={card.size} first={card.first}>
                                <FlipCard card={card} size={card.size} startInEditMode={addingCard} first={card.first}/>
                            </GridSquare>
                })
            }
        </StyledGridSorter>
    );
}

export default GridSorter;