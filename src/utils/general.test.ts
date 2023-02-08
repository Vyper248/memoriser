import { getSize, correctCardAdjustment, createNewCard, generateHash, parseHash, getLocalData, mergeSharedData, getIDCheckObj } from "./general.utils";

import type { Card, Group } from "../types";

describe('Testing the getSize function', () => {
    it('Gets the size of a card based on points and last checked', () => {
        let recentTime = new Date().getTime();
    
        expect(getSize({points: 1})).toEqual('medium');
        expect(getSize({points: 5})).toEqual('small');
        expect(getSize({points: 0})).toEqual('large');
        expect(getSize({points: 2, lastChecked: 1674135909479, lastCheckingPeriod: '1 Hour'})).toEqual('large');
        expect(getSize({points: 2, lastChecked: recentTime, lastCheckingPeriod: '1 Hour'})).toEqual('medium');
    });
});

describe('Testing the createNewCard function', () => {
    it('Creates and returns a new card, using the groupId passed in', () => {
        let newGroup = createNewCard('1');
        expect(newGroup).toHaveProperty('id');
        expect(newGroup.groupId).toBe('1');
        expect(newGroup.question).toBe('Question?');
        expect(newGroup.answer).toBe('Answer');
        expect(newGroup.points).toBe(0);
    });
});

describe('Testing the correctCardAdjustment function', () => {
    it('Adjusts card points based on last checked time and period', () => {
        const mockSetState = jest.fn();
    
        let newId = new Date().getTime();
    
        let mockCard = {
            id: `${newId}`,
            groupId: '1',
            question: 'mock',
            answer: 'card',
            points: 1,
            lastChecked: newId,
            lastCheckingPeriod: '1 Hour',
        }
    
        correctCardAdjustment(mockCard, [mockCard], mockSetState);
        expect(mockSetState).toBeCalled();
    
        //hasn't been an hour, so don't update points
        expect(correctCardAdjustment(mockCard, [mockCard], mockSetState)[0].points).toBe(1);
    
        //newly created card with 0 points, so should update to 1 point and add lastChecked/lastCheckingPeriod
        let mockCard2 = {
            id: `${newId}`,
            groupId: '2',
            question: 'mock',
            answer: 'card',
            points: 0
        }
    
        expect(correctCardAdjustment(mockCard2, [mockCard2], mockSetState)[0].points).toBe(1);
        expect(correctCardAdjustment(mockCard2, [mockCard2], mockSetState)[0].lastChecked).not.toBe(undefined);
        expect(correctCardAdjustment(mockCard2, [mockCard2], mockSetState)[0].lastCheckingPeriod).toBe('1 Hour');
    
        //last checked over an hour ago, which matches lastCheckingPeriod, so increase to 2 points
        mockCard.lastChecked = newId-3700000;
        mockCard.lastCheckingPeriod = '1 Hour';
        expect(correctCardAdjustment(mockCard, [mockCard], mockSetState)[0].points).toBe(2);
        expect(correctCardAdjustment(mockCard, [mockCard], mockSetState)[0].lastChecked).not.toBe(newId-3700000);
        expect(correctCardAdjustment(mockCard, [mockCard], mockSetState)[0].lastCheckingPeriod).toBe('2 Hours');
    
        //last checked less than an hour ago, so don't increase, but do change lastChecked
        mockCard.lastChecked = newId-100000;
        mockCard.lastCheckingPeriod = '1 Hour';
        expect(correctCardAdjustment(mockCard, [mockCard], mockSetState)[0].points).toBe(1);
        expect(correctCardAdjustment(mockCard, [mockCard], mockSetState)[0].lastChecked).not.toBe(newId-100000);
    
        //last checked over an hour ago, but doesn't match lastCheckingPeriod, so increase to 2 points but don't change lastChecking Period
        mockCard.lastChecked = newId-3700000;
        mockCard.lastCheckingPeriod = '2 Hours';
        expect(correctCardAdjustment(mockCard, [mockCard], mockSetState)[0].points).toBe(2);
        expect(correctCardAdjustment(mockCard, [mockCard], mockSetState)[0].lastChecked).not.toBe(newId-3700000);
        expect(correctCardAdjustment(mockCard, [mockCard], mockSetState)[0].lastCheckingPeriod).toBe('2 Hours');
    });
});

describe('Testing the generateURL and parseURL function', () => {
    let mockCards = [{id: '1', groupId: '1', question: 'test', answer: 'test', points: 3, lastChecked: 4232523, lastCheckingPeriod: '1 Week'}];
    let mockGroups = [{id: '1', name: 'testGroup'}];

    it('generates and parses the hash from a url', () => {
        let hash = generateHash(mockCards, mockGroups);
        expect(hash.length).toBeGreaterThan(0);

        let obj = parseHash(hash);
        expect(obj?.cards).toHaveLength(1);
        expect(obj?.cards[0]).toEqual({id: '1', groupId: '1', question: 'test', answer: 'test'});

        expect(obj?.groups).toHaveLength(1);
        expect(obj?.groups[0]).toEqual({id: '1', name: 'testGroup'});
    });

    it('Handles empty hash and returns null', () => {
        let obj = parseHash('');
        expect(obj).toBeNull();
    });

    it('Handles incorrect hash', () => {
        let obj = parseHash('29qhwadou3ahfsiohf');
        expect(obj).toBeNull();
    });
});

describe('Testing the getLocalData function', () => {
    it('Gets the correct data', () => {
        window.localStorage.clear();
        window.localStorage.setItem('memoriser-data-cards', JSON.stringify([{id: '1', question: 'test card'}]));
        window.localStorage.setItem('memoriser-data-groups', JSON.stringify([{id: '1', name: 'test group'}]));

        let { localDataCards, localDataGroups } = getLocalData();

        expect(localDataCards).toHaveLength(1);
        expect(localDataCards[0].id).toEqual('1');
        expect(localDataCards[0].question).toEqual('test card');

        expect(localDataGroups).toHaveLength(1);
        expect(localDataGroups[0].id).toEqual('1');
        expect(localDataGroups[0].name).toEqual('test group');
    });
});

describe('Testing getIDCheckObj function', () => {
    it('Returns the correct obj', () => {
        let cardA = { id: '1' } as Card;
        let cardB = { id: '2' } as Card;
        let mockArr = [cardA, cardB];
        let obj = getIDCheckObj(mockArr);

        expect(obj[cardA.id]).toEqual(true);
        expect(obj[cardB.id]).toEqual(true);
        expect(obj['3']).toEqual(undefined);
    });
});

describe('Testing mergeSharedData function', () => {
    it('Merges data with local', () => {
        localStorage.setItem('memoriser-data-groups', JSON.stringify([{id: '2', name: 'test group'}]));
        localStorage.setItem('memoriser-data-cards', JSON.stringify([{id: '1', groupId: '2', question: 'test card'}]));

        let mockCards = [{ id: '3', groupId: '4', question: 'new card'}] as Card[];
        let mockGroups = [{id: '4', name: 'new group'}] as Group[];

        mergeSharedData(mockCards, mockGroups);

        let { localDataCards, localDataGroups } = getLocalData();
        
        expect(localDataCards).toHaveLength(2);
        expect(localDataGroups).toHaveLength(2);

        expect(localDataGroups[0].name).toEqual('test group');
        expect(localDataGroups[0].id).toEqual('2');

        expect(localDataGroups[1].name).toEqual('new group');
        expect(localDataGroups[1].id).toEqual('4');

        expect(localDataCards[0].question).toEqual('test card');
        expect(localDataCards[0].id).toEqual('1');

        expect(localDataCards[1].question).toEqual('new card');
        expect(localDataCards[1].id).toEqual('3');
    });

    it('Updates any IDs that are duplicated with local data', () => {
        localStorage.setItem('memoriser-data-groups', JSON.stringify([{id: '2', name: 'test group'}]));
        localStorage.setItem('memoriser-data-cards', JSON.stringify([{id: '1', groupId: '2', question: 'test card'}]));

        let mockCards = [{ id: '1', groupId: '2', question: 'new card'}] as Card[];
        let mockGroups = [{id: '2', name: 'new group'}] as Group[];

        mergeSharedData(mockCards, mockGroups);

        let { localDataCards, localDataGroups } = getLocalData();
        
        expect(localDataCards).toHaveLength(2);
        expect(localDataGroups).toHaveLength(2);

        expect(localDataGroups[0].id).toEqual('2');
        expect(localDataGroups[1].id).not.toEqual('2');

        expect(localDataCards[0].id).toEqual('1');
        expect(localDataCards[1].id).not.toEqual('1');
        expect(localDataCards[1].groupId).toEqual(localDataGroups[1].id);
    });
});