import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import GridSorter from './GridSorter'
import { getNextLocation, getGridValues } from './GridSorter.utils';

import type { Card } from '../../types';

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
        render(<GridSorter cards={mockCards} cardFunctions={mockFunctions} viewingShared={false}/>);
    
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
        render(<GridSorter cards={mockCards} cardFunctions={mockFunctions} viewingShared={true}/>);
    
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