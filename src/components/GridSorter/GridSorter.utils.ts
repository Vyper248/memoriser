import type { CardObj, LocationObj, PositionedCard } from "./GridSorter";
import { sortArray } from "../../utils/array.utils";

import type { Card } from "../../types";

export const getGridValues = () => {
    let screenWidth = window.innerWidth - 100;
    if (screenWidth > 1400) screenWidth = 1400;
    const gridSize = 100;
    const maxGrid = Math.floor(screenWidth / gridSize);
    const actualWidth = window.innerWidth - 100;
    const leftover = (actualWidth - (maxGrid*gridSize)) / 2;

    return { gridSize, maxGrid, leftover };
}

export const fillPositions = (x: number, y: number, size: number, obj: {[key: string] : boolean}) => {
    const positions = getPositions(x, y, size);
    positions.forEach(position => obj[position] = true);
}

export const getPositions = (x: number, y: number, size: number) => {
    return Array.from({ length: size ** 2 }, (_, index) => {
        const xOffset = index % size;
        const yOffset = Math.floor(index / size);
        return `${x + xOffset}-${y + yOffset}`;
    });
}

export const getNextLocation = (size: 'small' | 'medium' | 'large', takenLocations: {[key: string] : boolean}) => {
    const { maxGrid } = getGridValues();
    const checks = size === 'medium' ? 2 : size === 'large' ? 3 : 1;

    let x = 0;
    let y = 0;

    for (let i = 0; i < 2000; i++) {
        //if going off edge of grid, move to next level
        if (x + checks-1 > maxGrid) {
            x = 0;
            y += 1;
        }

        //get all possible positions at x,y point
        const positions = getPositions(x, y, checks);

        //check if positions are taken
        if (positions.some(position => takenLocations[position])) {
            x++;
            continue;
        }

        //once position is found, fill in taken locations
        positions.forEach(position => takenLocations[position] = true);
        return { x, y };
    }

    return { x, y };
}

export const createCardObj = (cardArray: PositionedCard[]) => {
    let newCardObj = {} as CardObj;

    //reset all positions and add to obj
    cardArray.forEach(card => {
        card.x = 0;
        card.y = 0;
        card.size = 'large';
        card.first = false;
        newCardObj[card.id] = card;
    });

    return newCardObj;
}

export const enlargeSelectedCard = (newCardObj: CardObj, selectedCard: PositionedCard, takenLocations: LocationObj) => {
    //determine if x value needs to change if too close to the edge
    let { x, y } = selectedCard;
    let { maxGrid } = getGridValues();
    if (x + 2 > maxGrid) x = maxGrid - 2;

    //fill positions so no other card will overlap
    fillPositions(x, y, 3, takenLocations);

    //set values on card obj
    newCardObj[selectedCard.id].x = x;
    newCardObj[selectedCard.id].y = y;
    newCardObj[selectedCard.id].size = 'large';
}

type Size = 'small' | 'medium' | 'large';
export const getSizeFromIndex = (i: number) => {
    let sizes = ['small', 'medium', 'large', 'small'] as Size[];
    let chosen = i % 4;
    return sizes[chosen];
}

export const addPositionToCard = (card: PositionedCard, i: number, newCardObj: CardObj, takenLocations: LocationObj, originalIndexes: {[key: string]: number}) => {
    let newCard = newCardObj[card.id];
    if (!newCard) return 0;

    //if it's the selected card or first card, put at top
    if (i === 0) {
        newCard.x = 0;
        newCard.y = -3;
        newCard.size = 'large';
        newCard.first = true;
        return -1;
    } 

    //for all other cards, get location in grid
    //Set size based on index in original array - (prevents too much size changing if using original)
    //allows for a better look, even when all would normally be large
    let size: Size;
    if (i > 4) size = getSizeFromIndex(originalIndexes[card.id]);
    else size = 'large';

    let { x, y } = getNextLocation(size, takenLocations);
    newCard.x = x;
    newCard.y = y;
    newCard.size = size;
    newCard.first = false;

    if (size === 'small') return y;
    else if (size === 'medium') return y+1;
    else return y+2;
}

export const getCardArray = (cards: Card[], addingCard: boolean, selectedCard: Card | null) => {
    let newCards = structuredClone(cards) as PositionedCard[];

    //make the original index of each card quickl accessible
    let originalIndexes = {} as {[key: string]: number};
    cards.forEach((card, i) => originalIndexes[card.id] = i);

    //create obj from array for quicker lookup
    let newCardObj = createCardObj(newCards);

    //create obj to store locations of cards
    const takenLocations = {} as LocationObj;

    //get sorted card array
    let sortedCards = sortArray(newCards);

    if (addingCard && selectedCard !== null) {
        //filter out that card from sorted cards
        sortedCards = sortedCards.filter(card => card.id !== selectedCard.id);
        sortedCards = [selectedCard as PositionedCard, ...sortedCards];
    }

    //if want to make a certain card larger in position (try with selected card)
    if (selectedCard && !addingCard) {
        //filter out that card from sorted cards
        sortedCards = sortedCards.filter(card => card.id !== selectedCard.id);
        //enlarge in-place
        enlargeSelectedCard(newCardObj, selectedCard as PositionedCard, takenLocations);
    }

    //add values to card and get highest y position
    let highestY = 0;
    sortedCards.forEach((card, i) => {
        let y = addPositionToCard(card, i, newCardObj, takenLocations, originalIndexes);
        if (y > highestY) highestY = y;
    });

    return { newCards, highestY };
}