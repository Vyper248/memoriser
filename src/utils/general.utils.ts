import { timeSinceLastChecked, hourPassed } from "./date.utils";
import { editInArray, getNextValue } from "./array.utils";
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";

import type { Card, Group } from "../types";

type BasicCard = {
    points?: number | undefined;
    lastChecked?: number | undefined;
    lastCheckingPeriod?: string | undefined;
}

export const getSize = (card: BasicCard): 'small' | 'medium' | 'large' => {
    if (timeSinceLastChecked(card.lastChecked, card.lastCheckingPeriod)) return 'large';
    if (card.points === undefined) return 'large';
    if (card.points === 0) return 'large';
    if (card.points > 4) return 'small';
    if (card.points > 0) return 'medium';
    return 'large';
}

const checkingPeriods = [
	'1 Hour', '2 Hours', '4 Hours', '8 Hours',
	'1 Day', '2 Days', '4 Days',
	'1 Week', '2 Weeks',
	'1 Month'
];


export const correctCardAdjustment = (card: Card, cards: Card[], setCards: (cards:Card[])=>void) => {
    let adjustTimes = timeSinceLastChecked(card.lastChecked, card.lastCheckingPeriod);
    let beenAnHour = hourPassed(card.lastChecked);

    let lastChecked = new Date().getTime();
    let points = card.points !== undefined ? card.points + 1 : 1;
    let newCards = cards;

    //if it's been enough time since last checking or have never checked
    if (adjustTimes || card.lastChecked === undefined) {
        let lastCheckingPeriod = getNextValue(card.lastCheckingPeriod, checkingPeriods);
        newCards = editInArray({...card, points, lastChecked, lastCheckingPeriod}, cards);
    }

    //if the above isn't true, can still increase points if it's been at least an hour since last checking
    //don't increase checking period as this means they haven't waited that long before checking yet
    // else if (beenAnHour) {
    //     newCards = editInArray({...card, points, lastChecked}, cards);
    // }		

    //otherwise, it's not been an hour, not due to be checked and has already been checked
    //So just change lastChecked
    else {
        newCards = editInArray({...card, lastChecked}, cards);
    }

    setCards(newCards);
    return newCards;
}

export const createNewCard = (groupId: string): Card => {
    //create new card
    let newId = new Date().getTime();
    let newCard: Card = {
        id: `${newId}`,
        groupId: groupId,
        question: 'Question',
        answer: 'Answer',
        points: 0,
    }

    return newCard;
}

export const generateHash = (cards: Card[], groups: Group[]) => {
    //filter out properties unique to the user
    let sharedCards = cards.map(card => {
        let { id, groupId, question, answer } = card;
        return {id, groupId, question, answer};
    });

    let combinedObj = JSON.stringify({cards: sharedCards, groups});
	let hash = compressToEncodedURIComponent(combinedObj);
    return hash;
}

export const parseHash = (hash: string): {cards: Card[], groups: Group[]} | null => {
    let encoded = hash.replace('#', '');
	let uncompressedString = decompressFromEncodedURIComponent(encoded) as string;
    let dataObj = null;
    try {
        dataObj = JSON.parse(uncompressedString);
    } catch (err) {
        // if it doesnt work, then hash was invalid, so just return null
    }
    return dataObj;
}

export const getLocalData = () => {
    let localDataCardsJson = localStorage.getItem('memoriser-data-cards');
    let localDataGroupsJson = localStorage.getItem('memoriser-data-groups');

    let localDataCards = [] as Card[];
    if (localDataCardsJson) localDataCards = JSON.parse(localDataCardsJson);

    let localDataGroups = [] as Group[];
    if (localDataGroupsJson) localDataGroups = JSON.parse(localDataGroupsJson);

    return { localDataCards, localDataGroups };
}