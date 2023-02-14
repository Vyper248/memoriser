import { getIDCheckObj, checkCardIDs, checkGroupIDs, importSharedData, filterOutSameCards, mergeSharedData, mergeWithSelectedGroup } from "./importing.utils";
import { getLocalData } from "./general.utils";

import { Card, Group } from "../types";

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

describe('Testing checkCardIDs function', () => {
    it('changes any duplicated IDs', () => {
        let cards = [{id: '2'}, {id: '3'}] as Card[];
        let localCards = [{id: '1'}, {id: '2'}] as Card[];

        checkCardIDs(cards, localCards);

        expect(cards[0].id).not.toEqual('2');
        expect(cards[1].id).toEqual('3');
    });
});

describe('Testing checkGroupIds function', () => {
    it('changes any duplicated IDs', () => {
        let groups = [{id: '1'}] as Group[];
        let cards = [{id: '2', groupId: '1'}, {id: '3', groupId: '1'}] as Card[];
        let localGroups = [{id: '1'}, {id: '2'}] as Group[];

        checkGroupIDs(cards, groups, localGroups);

        expect(cards[0].groupId).not.toEqual('1');
        expect(cards[1].groupId).not.toEqual('1');
        expect(groups[0].id).not.toEqual('1');

        expect(groups[0].id).toEqual(cards[0].groupId);
    });
});

describe('Testing importSharedData function', () => {
    it('Merges data with local', () => {
        localStorage.setItem('memoriser-data-groups', JSON.stringify([{id: '2', name: 'test group'}]));
        localStorage.setItem('memoriser-data-cards', JSON.stringify([{id: '1', groupId: '2', question: 'test card'}]));

        let mockCards = [{ id: '3', groupId: '4', question: 'new card'}] as Card[];
        let mockGroups = [{id: '4', name: 'new group'}] as Group[];

        importSharedData(mockCards, mockGroups);

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

        importSharedData(mockCards, mockGroups);

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

describe('Testing filterOutSameCards function', () => {
    it('Filters out cards that are already in the array', () => {
        let mockCards = [{id: '1', groupId: '2', question: 'test card'},
                         {id: '2', groupId: '2', question: 'new card'}, 
                         {id: '3', groupId: '2', question: 'card 2'}] as Card[];
        
        let mockLocalCards = [{id: '1', groupId: '2', question: 'test card'}, 
                              {id: '2', groupId: '2', question: 'new card'}] as Card[];

        let groupId = '2';

        let cardsToAdd = filterOutSameCards(mockCards, mockLocalCards, groupId);

        expect(cardsToAdd).toHaveLength(1);
        expect(cardsToAdd[0].question).toEqual('card 2');
    });
});

describe('Testing the mergeSharedData function', () => {
    it('Correctly merges data with existing data', () => {
        localStorage.setItem('memoriser-data-groups', JSON.stringify([{id: '2', name: 'test group'}]));
        localStorage.setItem('memoriser-data-cards', JSON.stringify([{id: '1', groupId: '2', question: 'test card'}]));

        let mockCards = [{id: '1', groupId: '2', question: 'test card'}, 
                         {id: '2', groupId: '2', question: 'new card'}] as Card[];
        let mockGroups = [{id: '2', name: 'test group'}] as Group[];

        mergeSharedData(mockCards, mockGroups);

        let { localDataCards, localDataGroups } = getLocalData();

        expect(localDataCards).toHaveLength(2);
        expect(localDataGroups).toHaveLength(1);
    });

    it('Correctly merges data with existing data when ids are different', () => {
        localStorage.setItem('memoriser-data-groups', JSON.stringify([{id: '2', name: 'test group'}]));
        localStorage.setItem('memoriser-data-cards', JSON.stringify([{id: '1', groupId: '2', question: 'test card'}]));

        let mockCards = [{id: '4', groupId: '5', question: 'test card'}, 
                         {id: '1', groupId: '5', question: 'new card'}] as Card[];
        let mockGroups = [{id: '5', name: 'test group'}] as Group[];

        mergeSharedData(mockCards, mockGroups);

        let { localDataCards, localDataGroups } = getLocalData();

        expect(localDataCards).toHaveLength(2);
        expect(localDataGroups).toHaveLength(1);

        expect(localDataGroups[0].id).toEqual('2');

        expect(localDataCards[0].groupId).toEqual('2');
        expect(localDataCards[1].groupId).toEqual('2');

        expect(localDataCards[0].id).toEqual('1');
        expect(localDataCards[1].id).not.toEqual('1');
    });

    it('Correctly adds a new group and new cards with same ids', () => {
        localStorage.setItem('memoriser-data-groups', JSON.stringify([{id: '2', name: 'test group'}]));
        localStorage.setItem('memoriser-data-cards', JSON.stringify([{id: '1', groupId: '2', question: 'test card'}]));

        let mockCards = [{id: '4', groupId: '2', question: 'test card'}, 
                         {id: '1', groupId: '2', question: 'new card'}] as Card[];
        let mockGroups = [{id: '2', name: 'new group'}] as Group[];

        mergeSharedData(mockCards, mockGroups);

        let { localDataCards, localDataGroups } = getLocalData();

        expect(localDataCards).toHaveLength(3);
        expect(localDataGroups).toHaveLength(2);

        expect(localDataGroups[0].id).toEqual('2');
        expect(localDataGroups[1].id).not.toEqual('2');

        expect(localDataCards[0].groupId).toEqual('2');
        expect(localDataCards[1].groupId).not.toEqual('2');
        expect(localDataCards[2].groupId).not.toEqual('2');

        expect(localDataCards[0].id).toEqual('1');
        expect(localDataCards[1].id).toEqual('4');
        expect(localDataCards[2].id).not.toEqual('1');
    });
});

describe('Testing mergeWithSelectedGroup function', () => {
    it('Merges cards with selected group', () => {
        localStorage.setItem('memoriser-data-groups', JSON.stringify([{id: '2', name: 'test group'}]));
        localStorage.setItem('memoriser-data-cards', JSON.stringify([{id: '2', groupId: '2', question: 'test card'}]));

        let mockCards = [{ id: '1', groupId: '4', question: 'test card'}, 
                         { id: '2', groupId: '4', question: 'new card'}] as Card[];

        mergeWithSelectedGroup(mockCards, '2');

        let { localDataCards, localDataGroups } = getLocalData();
        
        expect(localDataCards).toHaveLength(2);
        expect(localDataGroups).toHaveLength(1);

        expect(localDataCards[0].question).toEqual('test card');
        expect(localDataCards[0].id).toEqual('2');

        expect(localDataCards[1].question).toEqual('new card');
        expect(localDataCards[1].id).not.toEqual('2');
    });
});