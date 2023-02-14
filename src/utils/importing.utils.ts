
import type { Card, Group } from "../types";
import { getLocalData } from "./general.utils";

export const getIDCheckObj = (arr: Card[] | Group[]) => {
    let dataObj = {} as { [key: string]: boolean };
    arr.forEach(obj => {
        dataObj[obj.id] = true;
    });
    return dataObj;
}

export const checkGroupIDs = (cards: Card[], groups: Group[], localGroups: Group[]) => {
    //check group IDs to make sure not the same
    let localGroupsObj = getIDCheckObj(localGroups);
    groups.forEach(group => {
        if (localGroupsObj[group.id] !== undefined) {
            //fix duplicate id with group and cards
            let oldId = group.id;
            let newId = Math.floor(Math.random()*10000000000000).toString();

            cards.forEach(card => { if(card.groupId === oldId) card.groupId = newId; });
            group.id = newId;
        }
    });
}

export const checkCardIDs = (cards: Card[], localCards: Card[]) => {
    //check card IDs to make sure not the same
    let localCardsObj = getIDCheckObj(localCards);
    cards.forEach(card => {
        if (localCardsObj[card.id] !== undefined) {
            //fix duplicate
            let newId = Math.floor(Math.random()*10000000000000).toString();
            card.id = newId;
        }
    });
}

export const importSharedData = (cards: Card[], groups: Group[]) => {
    //get locally stored groups
    let { localDataCards, localDataGroups } = getLocalData();

    //check group IDs to make sure not the same
    checkGroupIDs(cards, groups, localDataGroups);

    //check card IDs to make sure not the same
    checkCardIDs(cards, localDataCards);

    //merge arrays and save back to local storage
    let newGroupsArr = [...localDataGroups, ...groups];
    let newCardsArr = [...localDataCards, ...cards];
    localStorage.setItem('memoriser-data-groups', JSON.stringify(newGroupsArr));
    localStorage.setItem('memoriser-data-cards', JSON.stringify(newCardsArr));
}

export const filterOutSameCards = (cards: Card[], localCards: Card[], groupId: string) => {
    //get obj of existing local cards for this group, using question as the key
    let existingCardObj = {} as { [key: string]: Card };
    localCards.forEach(card => {
        if (card.groupId === groupId) existingCardObj[card.question] = card;
    });

    //filter out shared cards for this group
    let cardsToAdd = [] as Card[];
    cards.forEach(card => {
        //card doesn't exist, so add to array and set groupId to local group it's being added to
        if (existingCardObj[card.question] === undefined) {
            card.groupId = groupId;
            cardsToAdd.push(card);
        }
    });

    return cardsToAdd;
}

export const mergeSharedData = (cards: Card[], groups: Group[]) => {
    //get locally stored data
    let { localDataCards, localDataGroups } = getLocalData();

    let localGroupsObj = {} as {[key: string]: string};
    localDataGroups.forEach(group => localGroupsObj[group.name] = group.id);

    let cardsToAdd = [] as Card[];
    let groupsToAdd = [] as Group[];

    groups.forEach(group => {
        //group exists, so merge data
        let localGroupId = localGroupsObj[group.name];
        if (localGroupId !== undefined) {
            //filter out shared cards for this group
            let filteredCards = cards.filter(card => card.groupId === group.id);
            let newCards = filterOutSameCards(filteredCards, localDataCards, localGroupId);

            cardsToAdd.push(...newCards);
        } else {
            //if group doesn't exist, add it and associated cards
            groupsToAdd.push(group);
            let filteredCards = cards.filter(card => card.groupId === group.id);
            cardsToAdd.push(...filteredCards);
        }
    });

    //make sure no duplicate IDs
    checkGroupIDs(cardsToAdd, groupsToAdd, localDataGroups);
    checkCardIDs(cardsToAdd, localDataCards);

    //merge arrays and save back to local storage
    let newGroupsArr = [...localDataGroups, ...groupsToAdd];
    let newCardsArr = [...localDataCards, ...cardsToAdd];
    localStorage.setItem('memoriser-data-groups', JSON.stringify(newGroupsArr));
    localStorage.setItem('memoriser-data-cards', JSON.stringify(newCardsArr));
}

export const mergeWithSelectedGroup = (cards: Card[], localGroupId: string) => {
    //get locally stored data
    let { localDataCards, localDataGroups } = getLocalData();

    //get local group to merge with
    let localGroup = localDataGroups.find(group => group.id === localGroupId);

    if (localGroup !== undefined) {
        //filter out cards that are already in the group (based on question)
        let newCards = filterOutSameCards(cards, localDataCards, localGroupId);

        //check IDs to make sure they're different
        checkCardIDs(newCards, localDataCards);

        //merge with local data
        let newCardsArr = [...localDataCards, ...newCards];
        localStorage.setItem('memoriser-data-cards', JSON.stringify(newCardsArr));
    }
}