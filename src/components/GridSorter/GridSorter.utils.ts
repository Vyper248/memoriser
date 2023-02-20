import type { CardObj, LocationObj, PositionedCard } from "./GridSorter";
import { getSize } from "../../utils/general.utils";

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
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let coord = `${x+j}-${y+i}`;
            obj[coord] = true;
        }
    }
}

export const getNextLocation = (size: 'small' | 'medium' | 'large', takenLocations: {[key: string] : boolean}) => {
    const { maxGrid } = getGridValues();
    let checks = 1;
    if (size === 'medium') checks = 2;
    if (size === 'large') checks = 3;

    let x = 0;
    let y = 0;
    let foreverStopper = 0;

    while(true) {
        foreverStopper++;
        if (foreverStopper > 1000) break;

        //if going off edge of grid, move to next level
        if (x + checks-1 > maxGrid) {
            x = 0;
            y += 1;
        }

        //check all coordinates for size of card
        let found = true;
        let adjust = 0;
        for (let i = 0; i < checks; i++) {
            for (let j = 0; j < checks; j++) {
                let coord = `${x+j}-${y+i}`;
                if (takenLocations[coord] !== undefined) {
                    found = false;
                    adjust = j;
                    break;
                };
            }
            if (found === false) break;
        }

        //if not found, continue to next position and skip if needed
        if (found === false) {
            x += 1 + adjust;
            continue;
        }

        //if found, then fill in takenLocations
        fillPositions(x, y, checks, takenLocations);
        break;
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