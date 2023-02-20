import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import GridSorter, { CardObj, LocationObj } from './GridSorter'
import { getNextLocation, getGridValues, createCardObj, enlargeSelectedCard, addPositionToCard, fillPositions, getSizeFromIndex } from './GridSorter.utils';

import type { Card } from '../../types';
import type { PositionedCard } from './GridSorter';

describe('Tests GridSorter component', () => {
    const mockCards = [
        {id: '1', groupId: '1', question: 'test question', answer: 'test answer'},
        {id: '2', groupId: '1', question: 'test question 2', answer: 'test answer 2'},
        {id: '3', groupId: '1', question: 'test question 3', answer: 'test answer 3'},
    ];

    const mockFunctions = {
        onCorrect: (card:Card)=>{},
        onFail: (card: Card)=>{},
        onEdit: (card: Card)=>{},
        onDelete: (card: Card)=>{},
        onSelect: (card: Card)=>{},
    }

    it('Renders without crashing', () => {
        render(<GridSorter cards={mockCards} selectedCard={null} cardFunctions={mockFunctions} viewingShared={false} addingCard={false}/>);
    
        let element = screen.getByText('test question');
        expect(element).toBeInTheDocument();
    
        let element2 = screen.getByText('test question 2');
        expect(element2).toBeInTheDocument();
    
        let element3 = screen.getByText('test question 3');
        expect(element3).toBeInTheDocument();

        let buttons = screen.queryAllByText('Correct');
        expect(buttons).toHaveLength(3);
    });

    it('Wont allow showing buttons when viewing shared cards', () => {    
        render(<GridSorter cards={mockCards} selectedCard={null} cardFunctions={mockFunctions} viewingShared={true} addingCard={false}/>);
    
        let buttons = screen.queryAllByText('Correct');
        expect(buttons).toHaveLength(0);

        let cancelButtons = screen.queryAllByText('Cancel');
        expect(cancelButtons).toHaveLength(3);
    });
});

describe('Testing the getGridValues function', ()=>{
    //leftover = (innerWidth - 100 - (maxGrid*100)) / 2;

    it('Gives the correct values with a width of 1250', () => {
        window.innerWidth = 1250;
        const { maxGrid, gridSize, leftover } = getGridValues();
    
        expect(maxGrid).toEqual(11);
        expect(gridSize).toEqual(100);
        expect(leftover).toEqual(25);
    });

    it('Gives the correct values width a width of 872', () => {
        window.innerWidth = 872;
        const { maxGrid, gridSize, leftover } = getGridValues();
    
        expect(maxGrid).toEqual(7);
        expect(gridSize).toEqual(100);
        expect(leftover).toEqual(36);
    });
});

describe('Testing the getNextLocation function', () => {
    it('Gets the first location when nothing taken', () => {
        let mockTaken = {} as {[key: string] : boolean};
        let { x, y } = getNextLocation('small', mockTaken);
        expect(x).toEqual(0);
        expect(y).toEqual(0);
    });

    it('Gets the second location when first is taken', () => {
        let mockTaken = {'0-0': true} as {[key: string] : boolean};
        let { x, y } = getNextLocation('small', mockTaken);
        expect(x).toEqual(1);
        expect(y).toEqual(0);
    });

    it('Gets the third location', () => {
        let mockTaken = {'0-0': true, '1-1': true} as {[key: string] : boolean};
        let { x, y } = getNextLocation('medium', mockTaken);
        expect(x).toEqual(2);
        expect(y).toEqual(0);
    });

    it('Skips the location if size is too big and others are taken', () => {
        let mockTaken = {'1-0': true, '2-1': true, '3-0': true} as {[key: string] : boolean};
        let { x, y } = getNextLocation('medium', mockTaken);
        expect(x).toEqual(4);
        expect(y).toEqual(0);
    });
});

describe('Testing the createCardObj function', () => {
    it('Creates and returns a card with default position values', () => {
        let mockCardArray = [
            {id: '1', x: 5, y: 2, size: 'medium', first: true}
        ] as PositionedCard[];

        let cardObj = createCardObj(mockCardArray);
        expect(cardObj).toHaveProperty('1');
        expect(cardObj['1'].id).toEqual('1');
        expect(cardObj['1'].x).toEqual(0);
        expect(cardObj['1'].y).toEqual(0);
        expect(cardObj['1'].size).toEqual('large');
        expect(cardObj['1'].first).toEqual(false);
    });
});

describe('Testing the enlargeSelectedCard function', () => {
    it('Sets position values and fills position in takenLocations obj', () => {
        let mockCard = {id: '1', x: 0, y: 0, size: 'small'} as PositionedCard;
        let mockCardObj =  {'1': mockCard } as CardObj;
        let mockSelectedCard = {id: '1', x: 3, y: 4, size: 'small'} as PositionedCard;
        let mockTakenLocations = {} as LocationObj;

        enlargeSelectedCard(mockCardObj, mockSelectedCard, mockTakenLocations);

        expect(mockCardObj['1'].x).toBe(3);
        expect(mockCardObj['1'].y).toBe(4);
        expect(mockCardObj['1'].size).toBe('large');

        //should be taken
        expect(mockTakenLocations['3-4']).toBeTruthy();
        expect(mockTakenLocations['5-4']).toBeTruthy();
        expect(mockTakenLocations['3-6']).toBeTruthy();
        expect(mockTakenLocations['5-6']).toBeTruthy();

        //shouldn't have anything
        expect(mockTakenLocations['3-3']).toBeFalsy();
        expect(mockTakenLocations['6-6']).toBeFalsy();
    });
});

describe('Testing the addPositionToCard function', () => {
    it('Adds the correct position values to the first card', () => {
        let mockCard = {id: '1', x: 0, y: 0, size: 'small'} as PositionedCard;
        let mockCardObj =  {'1': mockCard } as CardObj;
        let index = 0;
        let mockTakenLocations = {} as LocationObj;

        addPositionToCard(mockCard, index, mockCardObj, mockTakenLocations, {});

        expect(mockCardObj['1'].x).toBe(0);
        expect(mockCardObj['1'].y).toBe(-3);
        expect(mockCardObj['1'].size).toBe('large');
        expect(mockCardObj['1'].first).toBe(true);
    });

    it('Adds the correct position values to the other cards', () => {
        let mockCard = {id: '1', x: 0, y: 0, size: 'small', points: 5} as PositionedCard;
        let mockCardObj =  {'1': mockCard } as CardObj;
        let index = 5;
        let mockTakenLocations = {} as LocationObj;

        addPositionToCard(mockCard, index, mockCardObj, mockTakenLocations, {'1': 6});

        expect(mockCardObj['1'].x).toBe(0);
        expect(mockCardObj['1'].y).toBe(0);
        expect(mockCardObj['1'].size).toBe('large');
        expect(mockCardObj['1'].first).toBe(false);
    });

    it('Adds the correct position values to the other cards if a position is taken', () => {
        let mockCard = {id: '1', x: 0, y: 0, size: 'small', points: 3} as PositionedCard;
        let mockCardObj =  {'1': mockCard } as CardObj;
        let index = 6;
        let mockTakenLocations = {'0-0': true} as LocationObj;

        addPositionToCard(mockCard, index, mockCardObj, mockTakenLocations, {'1': 7});

        expect(mockCardObj['1'].x).toBe(1);
        expect(mockCardObj['1'].y).toBe(0);
        expect(mockCardObj['1'].size).toBe('small'); //points > 0 and <= 4
        expect(mockCardObj['1'].first).toBe(false);
    });
});

describe('Testing the fillPositions function', () => {
    it('Fills the positions in the location object', () => {
        let mockTakenLocations = {} as LocationObj;
        fillPositions(0, 0, 1, mockTakenLocations);

        expect(mockTakenLocations['0-0']).toBeTruthy();
        expect(Object.keys(mockTakenLocations)).toHaveLength(1);

        fillPositions(1, 0, 2, mockTakenLocations);
        expect(mockTakenLocations['1-0']).toBeTruthy();
        expect(mockTakenLocations['2-0']).toBeTruthy();
        expect(mockTakenLocations['1-1']).toBeTruthy();
        expect(mockTakenLocations['2-1']).toBeTruthy();
        expect(Object.keys(mockTakenLocations)).toHaveLength(5);

        fillPositions(3, 0, 3, mockTakenLocations);
        expect(mockTakenLocations['3-0']).toBeTruthy();
        expect(mockTakenLocations['4-0']).toBeTruthy();
        expect(mockTakenLocations['5-0']).toBeTruthy();
        expect(mockTakenLocations['3-1']).toBeTruthy();
        expect(mockTakenLocations['4-1']).toBeTruthy();
        expect(mockTakenLocations['5-1']).toBeTruthy();
        expect(mockTakenLocations['3-2']).toBeTruthy();
        expect(mockTakenLocations['4-2']).toBeTruthy();
        expect(mockTakenLocations['5-2']).toBeTruthy();
        expect(Object.keys(mockTakenLocations)).toHaveLength(14);
    });
});

describe('Testing getSizeFromIndex function', () => {
    it('Gets a size based on the index, either small, medium or large', () => {
        let size = getSizeFromIndex(0);
        expect(size).toBe('small');

        size = getSizeFromIndex(1);
        expect(size).toBe('medium');

        size = getSizeFromIndex(2);
        expect(size).toBe('large');

        size = getSizeFromIndex(3);
        expect(size).toBe('small');
    });
});