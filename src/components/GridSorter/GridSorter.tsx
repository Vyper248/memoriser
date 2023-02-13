import { ReactNode, useState } from 'react';
import StyledGridSorter, { StyledGridSquare } from './GridSorter.style';

import { getSize } from '../../utils/general.utils';
import { getNextLocation, getGridValues } from './GridSorter.utils';
import { useResizeListener } from '../../utils/customHooks';

import type { Card } from '../../types';

import FlipCard from '../FlipCard/FlipCard';
import { sortArray } from '../../utils/array.utils';

type GridSorterProps = {
    cards: Card[];
    cardFunctions: { 
        onCorrect: (card:Card)=>void;
        onFail: (card: Card)=>void;
        onEdit: (card: Card)=>void;
        onDelete: (card: Card)=>void;
        onSelect: (card: Card)=>void;
    };
    viewingShared: boolean;
    selectedCard: Card | null;
}

interface PositionedCardExtra {
    x: number;
    y: number;
    size: string;
    first: boolean;
}

type PositionedCard = Card & PositionedCardExtra;

interface GridSquareProps extends PositionedCardExtra {
    children: ReactNode;
}

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

const GridSorter = ({cards, selectedCard, cardFunctions, viewingShared}: GridSorterProps) => {
    const [_, updateLayout] = useState(0);

    let newCards = structuredClone(cards) as PositionedCard[];

    //create obj from array for quicker lookup
    let newCardObj = {} as {[key: string]: PositionedCard};
    newCards.forEach(card => newCardObj[card.id] = card);

    //create obj to store locations of cards
    const takenLocations = {} as {[key: string] : boolean};

    //get sorted card array
    let sortedCards = sortArray(cards);

    //sort cards and add values to card
    sortedCards.forEach((card, i) => {
        let newCard = newCardObj[card.id];
        if (!newCard) return;

        //if it's the selected card or first card, put at top
        if ((selectedCard && card.id === selectedCard.id) || (!selectedCard && i === 0)) {
            newCard.x = 0;
            newCard.y = -3;
            newCard.size = 'large';
            newCard.first = true;
            return;
        } 

        //for all other cards, get location in grid
        let size = getSize(card);
        let { x, y } = getNextLocation(size, takenLocations);
        newCard.x = x;
        newCard.y = y;
        newCard.size = size;
        newCard.first = false;
    });

    useResizeListener(() => {
        updateLayout(reset => reset+1);
    }, 200);

    return (
        <StyledGridSorter>
            {
                newCards.map((card, i) => {
                    return <GridSquare key={card.id} x={card.x} y={card.y} size={card.size} first={card.first}>
                                <FlipCard card={card} size={card.size} viewingShared={viewingShared} {...cardFunctions}/>
                            </GridSquare>
                })
            }
        </StyledGridSorter>
    );
}

export default GridSorter;