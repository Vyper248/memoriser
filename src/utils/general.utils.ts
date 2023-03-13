import { timeSinceLastChecked } from "./date.utils";
import { editInArray, getNextValue } from "./array.utils";
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";

import type { Card, FilterObject, Group } from "../types";

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
    '10 Minutes',
	'1 Hour', '2 Hours', '4 Hours', '8 Hours',
	'1 Day', '2 Days', '4 Days',
	'1 Week', '2 Weeks',
	'1 Month'
];


export const correctCardAdjustment = (card: Card, cards: Card[]) => {
    let adjustTimes = timeSinceLastChecked(card.lastChecked, card.lastCheckingPeriod);
    // let beenAnHour = hourPassed(card.lastChecked);

    let lastChecked = new Date().getTime();
    let points = card.points !== undefined ? card.points + 1 : 1;
    let newCards = cards;

    //if it's been enough time since last checking or have never checked
    if (adjustTimes || card.lastChecked === undefined) {
        let lastCheckingPeriod = getNextValue(card.lastCheckingPeriod, checkingPeriods);
        newCards = editInArray({...card, points, lastChecked, lastCheckingPeriod}, cards);
    }	

    //otherwise, not due to be checked and has already been checked
    //So just change lastChecked
    else {
        newCards = editInArray({...card, lastChecked}, cards);
    }

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

export const onClearHash = () => {
    window.location.hash = '';
}

export const generateURL = (cards: Card[], groups: Group[]) => {
    let hash = generateHash(cards, groups);

    let href = window.location.href;
    //have to check whether url already includes a hash
    let url = href.includes('#') ? href + hash : href + '#' + hash;
    navigator.clipboard.writeText(url);        
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

export const checkFilter = (card: Card, filter: FilterObject) => {
    if (filter.type === 'color') {
		if (filter.color === 'red') return Boolean(card.points === 0 || card.points === undefined);
		if (filter.color === 'green') return Boolean(card.points && card.points > 4);
		if (filter.color === 'orange') return Boolean(card.points && card.points > 0 && card.points <= 4);
	}

    if (filter.type === 'points') {
        if (card.points && card.points <= filter.points) return true;
        else if (card.points === undefined) return true;
        else return false;
    }

    return true;
}