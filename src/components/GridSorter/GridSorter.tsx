import React, { Component, ReactNode, useEffect, useState } from 'react';
import StyledGridSorter, { StyledGridSquare } from './GridSorter.style';

import { getSize } from '../../utils/general.utils';
import { getNextLocation, getGridValues } from './GridSorter.utils';
import { useResizeListener } from '../../utils/customHooks';

import type { Card } from '../../types';
import FlipCard from '../FlipCard/FlipCard';

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
}

type GridSquareProps = {
    x: number;
    y: number;
    size: string;
    firstCard?: boolean;
    children: ReactNode;
}

const GridSquare = ({x, y, size, firstCard=false, children}: GridSquareProps) => {
    const { gridSize, leftover } = getGridValues();

    let widthHeight: number = gridSize;
    if (size === 'medium') widthHeight = gridSize * 2;
    if (size === 'large') widthHeight = gridSize * 3;

    let left = x * gridSize;
    left += leftover;
    if (firstCard) left = window.innerWidth/2 - 150;

    return (
        <StyledGridSquare size={widthHeight} style={{left: left, top: y*gridSize}}>
            { children }
        </StyledGridSquare>
    );
}

const GridSorter = ({cards, cardFunctions, viewingShared}: GridSorterProps) => {
    const [_, updateLayout] = useState(0);
    let clonedCards = structuredClone(cards);

    useResizeListener(() => {
        updateLayout(reset => reset+1);
    }, 200);

    const takenLocations = {} as {[key: string] : boolean};

    return (
        <StyledGridSorter>
            {
                clonedCards.map((card, i) => {
                    if (i === 0) return <GridSquare key={card.id} firstCard={true} x={0} y={-3} size={'large'}>
                                            <FlipCard card={card} size={'large'} viewingShared={viewingShared} {...cardFunctions}/>
                                        </GridSquare>

                    let size = getSize(card);
                    let { x, y } = getNextLocation(size, takenLocations);
                    return <GridSquare key={card.id} x={x} y={y} size={size}>
                                <FlipCard card={card} size={size} viewingShared={viewingShared} {...cardFunctions}/>
                            </GridSquare>
                })
            }
        </StyledGridSorter>
    );
}

export default GridSorter;