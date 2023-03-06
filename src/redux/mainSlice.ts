import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { Card, Group } from "../types";

export type MainSlice = {
    cards: Card[];
    groups: Group[];
    selectedCard: Card | null;
    flippedCard: Card | null;
    selectedGroup: Group | null;
    viewingShared: boolean;
};

export const initialState: MainSlice = {
    cards: [
        {
            id: '1',
            groupId: '1',
            question: 'Look at a card, try to guess, then check if you got it right by clicking on it.',
            answer: 'Be truthful here, otherwise it won\'t help you.',
            points: 0,
        },
        {
            id: '2',
            groupId: '1',
            question: 'You can use the dropdown menu above to add, edit or delete a group.',
            answer: 'So start creating some cards and learning!',
            points: 0,
        }
    ],
    groups: [
        {
            id: '1',
            name: 'Instructions',
        }
    ],
    selectedCard: null,
    flippedCard: null,
    selectedGroup: null,
    viewingShared: false
};

export const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        setCards: (state, action: PayloadAction<Card[]>) => {
            state.cards = action.payload;

            //if not viewing shared cards, save to local storage
            if (state.viewingShared === false) {
                let string = JSON.stringify(action.payload);
                localStorage.setItem(`memoriser-data-cards`, string);
            }
        },
        setGroups: (state, action: PayloadAction<Group[]>) => {
            state.groups = action.payload;

            //if not viewing shared cards, save to local storage
            if (state.viewingShared === false) {
                let string = JSON.stringify(action.payload);
                localStorage.setItem(`memoriser-data-groups`, string);
            }
        },
        setViewingShared: (state, action: PayloadAction<boolean>) => {
            state.viewingShared = action.payload;
        },
        setSelectedCard: (state, action: PayloadAction<Card | null>) => {
            state.selectedCard = action.payload;
        },
        setFlippedCard: (state, action: PayloadAction<Card | null>) => {
            state.flippedCard = action.payload;
        },
        setSelectedGroup: (state, action: PayloadAction<Group | null>) => {
            state.selectedGroup = action.payload;
            state.selectedCard = null;
        }
    }
});

export const { setCards, setGroups, setViewingShared, setSelectedCard, setFlippedCard, setSelectedGroup } = mainSlice.actions;

export default mainSlice.reducer;