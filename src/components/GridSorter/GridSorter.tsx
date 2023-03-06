import { ReactNode, useEffect, useState } from 'react';
import StyledGridSorter, { StyledGridSquare } from './GridSorter.style';

import { getGridValues, getCardArray } from './GridSorter.utils';
import { useResizeListener, useScrollListener } from '../../utils/customHooks';
import { useAppSelector } from '../../redux/hooks';

import type { Card } from '../../types';

import FlipCard from '../FlipCard/FlipCard';

type GridSorterProps = {
    cards: Card[];
    cardFunctions: { 
        onCorrect: (card:Card)=>void;
        onFail: (card: Card)=>void;
    };
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
export type LocationObj = { [key: string]: boolean };

const GridSquare = ({x=0, y=0, size, first=false, children}: GridSquareProps) => {
    const { gridSize, leftover } = getGridValues();

    let widthHeight: number = gridSize;
    if (size === 'medium') widthHeight = gridSize * 2;
    if (size === 'large') widthHeight = gridSize * 3;

    let left = x * gridSize;
    left += leftover;
    if (first) left = window.innerWidth/2 - 150;

    return (
        <StyledGridSquare size={widthHeight} style={{transform: `translate(${left}px, ${y*gridSize}px)`}}>
            { children }
        </StyledGridSquare>
    );
};

const GridSorter = ({cards, cardFunctions}: GridSorterProps) => {
    const [, updateLayout] = useState(0);
    const [scrollPos, setScrollPos] = useState(window.scrollY + window.innerHeight - 450);
    const [scrollSet, setScrollSet] = useState(new Set());
    const selectedCard = useAppSelector(state => state.main.selectedCard);
    const selectedGroup = useAppSelector(state => state.main.selectedGroup);
    const addingCard = useAppSelector(state => state.main.addingCard);

    const { gridSize } = getGridValues();

    //if screen is resized, update grid layout and set new scroll position
    useResizeListener(() => {
        updateLayout(reset => reset+1);
        setScrollPos(window.scrollY + window.innerHeight - 450);
    }, 200);

    //if scrolling, update scroll position
    useScrollListener(() => {
        let divPosition = 450;
        let scrollY = window.scrollY;
        let height = window.innerHeight;
        let bottom = scrollY + height - divPosition;

        setScrollPos(scrollPos => {
            if (bottom > scrollPos) return bottom;
            return scrollPos;
        });
    });

    //if changing groups, reset scroll position and Set
    useEffect(() => {
        setScrollPos(window.scrollY + window.innerHeight - 450);
        setScrollSet(new Set());
    }, [selectedGroup]);

    //Check card position. If offscreen and not in the Set, don't display it.
    //If onscreen, add to set and display
    //Set allows cards that are in display to remain in display even if they move offscreen, preserving the movement animation
    const checkCardPos = (card: PositionedCard) => {
        let cardPos = card.y * gridSize;
        if (cardPos > scrollPos && scrollSet.has(card.id) === false) return false;
        if (scrollSet.has(card.id) === false) {
            setScrollSet(scrollSet => {
                scrollSet.add(card.id);
                return scrollSet;
            });
        }
        return true;
    }

    const { newCards, highestY } = getCardArray(cards, addingCard, selectedCard);

    return (
        <StyledGridSorter y={highestY} gridSize={gridSize}>
            {
                newCards.map((card, i) => {
                    if (checkCardPos(card) === false) return null;
                    return <GridSquare key={card.id} x={card.x} y={card.y} size={card.size} first={card.first}>
                                <FlipCard card={card} size={card.size} startInEditMode={addingCard} {...cardFunctions}/>
                            </GridSquare>
                })
            }
        </StyledGridSorter>
    );
}

export default GridSorter;