
import type { Card, Group, ImportData } from "../types";
import { getLocalData } from "./general.utils";

export const getIDCheckObj = (arr: Card[] | Group[]) => {
    const dataObj = {} as { [key: string]: boolean };
    arr.forEach(obj => {
        dataObj[obj.id] = true;
    });
    return dataObj;
}

export const checkGroupIDs = (cards: Card[], groups: Group[], localGroups: Group[]) => {
    //check group IDs to make sure not the same
    const localGroupsObj = getIDCheckObj(localGroups);
    groups.forEach(group => {
        if (localGroupsObj[group.id] !== undefined) {
            //fix duplicate id with group and cards
            const oldId = group.id;
            const newId = Math.floor(Math.random()*10000000000000).toString();

            cards.forEach(card => { if(card.groupId === oldId) card.groupId = newId; });
            group.id = newId;
        }
    });
}

export const checkCardIDs = (cards: Card[], localCards: Card[]) => {
    //check card IDs to make sure not the same
    const localCardsObj = getIDCheckObj(localCards);
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
    const { localDataCards, localDataGroups } = getLocalData();

    //copy arrays, can't modify originals
    const cardsCopy = structuredClone(cards);
    const groupsCopy = structuredClone(groups);

    //check group IDs to make sure not the same
    checkGroupIDs(cardsCopy, groupsCopy, localDataGroups);

    //check card IDs to make sure not the same
    checkCardIDs(cardsCopy, localDataCards);

    //merge arrays and save back to local storage
    const newGroupsArr = [...localDataGroups, ...groupsCopy];
    const newCardsArr = [...localDataCards, ...cardsCopy];
    localStorage.setItem('memoriser-data-groups', JSON.stringify(newGroupsArr));
    localStorage.setItem('memoriser-data-cards', JSON.stringify(newCardsArr));
}

export const filterOutSameCards = (cards: Card[], localCards: Card[], groupId: string) => {
    //get obj of existing local cards for this group, using question as the key
    const existingCardObj = {} as { [key: string]: Card };
    localCards.forEach(card => {
        if (card.groupId === groupId) existingCardObj[card.question] = card;
    });

    //filter out shared cards for this group
    const cardsToAdd = [] as Card[];
    cards.forEach(card => {
        //card doesn't exist, so add to array and set groupId to local group it's being added to
        if (existingCardObj[card.question] === undefined) {
            let newCard = structuredClone(card);
            newCard.groupId = groupId;
            cardsToAdd.push(newCard);
        }
    });

    return cardsToAdd;
}

export const mergeSharedData = (cards: Card[], groups: Group[]) => {
    //get locally stored data
    const { localDataCards, localDataGroups } = getLocalData();

    const localGroupsObj = {} as {[key: string]: string};
    localDataGroups.forEach(group => localGroupsObj[group.name] = group.id);

    const cardsToAdd = [] as Card[];
    const groupsToAdd = [] as Group[];

    groups.forEach(group => {
        //group exists, so merge data
        const localGroupId = localGroupsObj[group.name];
        if (localGroupId !== undefined) {
            //filter out shared cards for this group
            const filteredCards = cards.filter(card => card.groupId === group.id);
            const newCards = filterOutSameCards(filteredCards, localDataCards, localGroupId);

            cardsToAdd.push(...newCards);
        } else {
            //if group doesn't exist, add it and associated cards
            groupsToAdd.push(group);
            const filteredCards = cards.filter(card => card.groupId === group.id);
            cardsToAdd.push(...filteredCards);
        }
    });

    //make sure no duplicate IDs
    checkGroupIDs(cardsToAdd, groupsToAdd, localDataGroups);
    checkCardIDs(cardsToAdd, localDataCards);

    //merge arrays and save back to local storage
    const newGroupsArr = [...localDataGroups, ...groupsToAdd];
    const newCardsArr = [...localDataCards, ...cardsToAdd];
    localStorage.setItem('memoriser-data-groups', JSON.stringify(newGroupsArr));
    localStorage.setItem('memoriser-data-cards', JSON.stringify(newCardsArr));
}

export const mergeWithSelectedGroup = (cards: Card[], localGroupId: string) => {
    //get locally stored data
    const { localDataCards, localDataGroups } = getLocalData();

    //get local group to merge with
    const localGroup = localDataGroups.find(group => group.id === localGroupId);

    if (localGroup !== undefined) {
        //filter out cards that are already in the group (based on question)
        const newCards = filterOutSameCards(cards, localDataCards, localGroupId);

        //check IDs to make sure they're different
        checkCardIDs(newCards, localDataCards);

        //merge with local data
        const newCardsArr = [...localDataCards, ...newCards];
        localStorage.setItem('memoriser-data-cards', JSON.stringify(newCardsArr));
    }
}

export const importFromBackup = (file: File, callback: (importObj: ImportData | null)=>void) => {
    if (file.type.match('application/json')) {
        const reader = new FileReader();

        reader.onload = () => {
            let text = reader.result as string;
            let obj = JSON.parse(text);

            let newObj = {cards: [], groups: []} as ImportData;

            if (obj.cards !== undefined) newObj.cards = obj.cards;
            if (obj.groups !== undefined) newObj.groups = obj.groups;
            
            callback(newObj);
        }
        
        reader.readAsText(file);
    } else {
        callback(null);
    }
}

