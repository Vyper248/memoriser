import React from "react";

import { timeSinceLastChecked, hourPassed } from "./date.utils";
import { editInArray, getNextValue } from "./array.utils";

import type { Card, Group } from "../types";

type BasicCard = {
    points?: number | undefined;
    lastChecked?: number | undefined;
    lastCheckingPeriod?: string | undefined;
}

export const getSize = (card: BasicCard) => {
    if (timeSinceLastChecked(card.lastChecked, card.lastCheckingPeriod)) return 'large';
    if (card.points === undefined) return 'large';
    if (card.points === 0) return 'large';
    if (card.points > 4) return 'small';
    if (card.points > 0) return 'medium';
}

const checkingPeriods = [
	'1 Hour', '2 Hours', '4 Hours', '8 Hours',
	'1 Day', '2 Days', '4 Days',
	'1 Week', '2 Weeks',
	'1 Month'
];


export const correctCardAdjustment = (card: Card, cards: Card[], setCards: React.Dispatch<React.SetStateAction<Card[]>>) => {
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
    else if (beenAnHour) {
        newCards = editInArray({...card, points, lastChecked}, cards);
    }		

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
        question: 'Question?',
        answer: 'Answer',
        points: 0,
    }

    return newCard;
}