import { Card } from '../types';
import { timeSinceLastChecked, getTimeTillNextPoint } from './date.utils';

interface Obj {
    id: string;
    groupId?: string;
    points?: number;
    lastChecked?: number;
    lastCheckingPeriod?: string;
}

export const addToArray = <T>(obj: T, arr: T[]): T[] => {
    if (obj === undefined) return arr;
    return [obj, ...arr];
}

export const editInArray = <T extends Obj>(obj: T, arr: T[]): T[] => {
    return arr.map(arrObj => {
        if (arrObj.id === obj.id) return obj;
        return arrObj;
    });
}

export const removeFromArray = <T extends Obj>(obj: T, arr: T[]): T[] => {
    return arr.filter(arrObj => arrObj.id !== obj.id);
}

export const filterArrayByGroupId = <T extends Obj>(id: string, arr: T[]): T[] => {
    return arr.filter(arrObj => arrObj.groupId === id);
}

export const sortArray = <T extends Obj>(arr: T[]): T[] => {
    return [...arr].sort((a,b) => {
        let pointsA: number = a.points || 0;
        let pointsB: number = b.points || 0;

        //0 points and never looked at goes first
        if (pointsA === 0 && a.lastChecked === undefined) return -1;
        if (pointsB === 0 && b.lastChecked === undefined) return 1;

        //if it's ready to be checked, sort by number of points, lowest first
        if (timeSinceLastChecked(a.lastChecked, a.lastCheckingPeriod) 
         && timeSinceLastChecked(b.lastChecked, b.lastCheckingPeriod)) return pointsA - pointsB;

        //otherwise sort by time until it can be checked again
        if (a.lastChecked && b.lastChecked) {
            let timeToNextPointA = getTimeTillNextPoint(a.lastChecked, a.lastCheckingPeriod);
            let timeToNextPointB = getTimeTillNextPoint(b.lastChecked, b.lastCheckingPeriod);
            return timeToNextPointA - timeToNextPointB;
        }

        //otherwise just sort by points (shouldn't ever get here)
        return pointsA - pointsB;
    });
}

export const getNextValue = (currentValue: string | undefined, arr: string[]): string => {
    if (currentValue === undefined) return arr[0];

    let currentIndex = arr.indexOf(currentValue);
    let nextIndex = currentIndex + 1;
    if (nextIndex > arr.length-1) return arr[arr.length-1];
    else return arr[nextIndex];
}

export const removeExtraCardProperties = (cards: Card[]) => {
    let newCards = cards.map(card => {
        const { id, groupId, question, answer, points, lastChecked, lastCheckingPeriod } = card;
        return { id, groupId, question, answer, points, lastChecked, lastCheckingPeriod } as Card;
    });
    return newCards;
}