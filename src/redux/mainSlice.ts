import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { editInArray, removeFromArray } from "../utils/array.utils";

import type { Card, Group } from "../types";

export type MainSlice = {
    cards: Card[];
    groups: Group[];
    selectedCard: Card | null;
    flippedCard: Card | null;
    selectedGroup: Group | null;
    addingCard: boolean;
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
    addingCard: false,
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
        },
        setAddingCard: (state, action: PayloadAction<boolean>) => {
            state.addingCard = action.payload;
        },
        addGroup: (state, action: PayloadAction<Group>) => {
            let newGroups = [...state.groups, action.payload];
            state.groups = newGroups;
            state.selectedGroup = action.payload;
        },
        editGroup: (state, action: PayloadAction<Group>) => {
            let newGroups = editInArray(action.payload, state.groups);
            state.groups = newGroups;
            state.selectedGroup = action.payload;
        },
        changeGroup: (state, action: PayloadAction<string>) => {
            const newGroup = state.groups.find(group => group.id === action.payload);
            if (newGroup) state.selectedGroup = newGroup;
        },
        deleteGroup: (state, action: PayloadAction<Group>) => {
            let newGroups = removeFromArray(action.payload, state.groups);
            state.groups = newGroups;
            state.selectedGroup = newGroups[0];
            let newCards = state.cards.filter(card => card.groupId !== action.payload.id);
            state.cards = newCards;
        }
    }
});

export const {  setCards, setGroups, 
                setViewingShared, setSelectedCard, setFlippedCard, setSelectedGroup, setAddingCard, 
                addGroup, editGroup, changeGroup, deleteGroup } = mainSlice.actions;

export default mainSlice.reducer;