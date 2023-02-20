import { ReactNode, useState } from 'react';
import StyledGridSorter, { StyledGridSquare } from './GridSorter.style';

import { getGridValues, createCardObj, enlargeSelectedCard, addPositionToCard } from './GridSorter.utils';
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
    addingCard: boolean;
    selectedCard: Card | null;
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

const GridSorter = ({cards, selectedCard, cardFunctions, viewingShared, addingCard}: GridSorterProps) => {
    const [, updateLayout] = useState(0);
    const { gridSize } = getGridValues();

    let newCards = structuredClone(cards) as PositionedCard[];

    //make the original index of each card quickl accessible
    let originalIndexes = {} as {[key: string]: number};
    cards.forEach((card, i) => originalIndexes[card.id] = i);

    //create obj from array for quicker lookup
    let newCardObj = createCardObj(newCards);

    //create obj to store locations of cards
    const takenLocations = {} as LocationObj;

    //get sorted card array
    let sortedCards = sortArray(newCards);

    if (addingCard && selectedCard !== null) {
        //filter out that card from sorted cards
        sortedCards = sortedCards.filter(card => card.id !== selectedCard.id);
        sortedCards = [selectedCard as PositionedCard, ...sortedCards];
    }

    //if want to make a certain card larger in position (try with selected card)
    if (selectedCard && !addingCard) {
        //filter out that card from sorted cards
        sortedCards = sortedCards.filter(card => card.id !== selectedCard.id);
        //enlarge in-place
        enlargeSelectedCard(newCardObj, selectedCard as PositionedCard, takenLocations);
    }

    //add values to card and get highest y position
    let highestY = 0;
    sortedCards.forEach((card, i) => {
        let y = addPositionToCard(card, i, newCardObj, takenLocations, originalIndexes);
        if (y > highestY) highestY = y;
    });

    useResizeListener(() => {
        updateLayout(reset => reset+1);
    }, 200);

    return (
        <StyledGridSorter y={highestY} gridSize={gridSize}>
            {
                newCards.map((card, i) => {
                    return <GridSquare key={card.id} x={card.x} y={card.y} size={card.size} first={card.first}>
                                <FlipCard card={card} size={card.size} viewingShared={viewingShared} startInEditMode={addingCard} {...cardFunctions}/>
                            </GridSquare>
                })
            }
        </StyledGridSorter>
    );
}

export default GridSorter;