import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { editInArray, removeFromArray } from "../utils/array.utils";
import { correctCardAdjustment, createNewCard } from "../utils/general.utils";

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
            state.selectedCard = null;
            state.selectedGroup = action.payload;
        },
        setAddingCard: (state, action: PayloadAction<boolean>) => {
            state.addingCard = action.payload;
        },
        //Group Functions ===============================================================
        setGroups: (state, action: PayloadAction<Group[]>) => {
            state.groups = action.payload;

            //if not viewing shared cards, save to local storage
            if (state.viewingShared === false) {
                let string = JSON.stringify(action.payload);
                localStorage.setItem(`memoriser-data-groups`, string);
            }
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
        deleteGroup: (state, action: PayloadAction<Group>) => {
            let newGroups = removeFromArray(action.payload, state.groups);
            state.groups = newGroups;
            state.selectedGroup = newGroups[0];
            let newCards = state.cards.filter(card => card.groupId !== action.payload.id);
            state.cards = newCards;
        },
        //Card Functions ===============================================================
        setCards: (state, action: PayloadAction<Card[]>) => {
            state.cards = action.payload;

            //if not viewing shared cards, save to local storage
            if (state.viewingShared === false) {
                let string = JSON.stringify(action.payload);
                localStorage.setItem(`memoriser-data-cards`, string);
            }
        },
        addCard: (state) => {
            if (state.selectedGroup === null) return;

            let newCard = createNewCard(state.selectedGroup.id);
            state.addingCard = true;
            state.selectedCard = newCard;
            state.cards = [...state.cards, newCard];
        },
        editCard: (state, action: PayloadAction<Card>) => {
            let newCards = editInArray(action.payload, state.cards);
            state.cards = newCards;
        },
        deleteCard: (state, action: PayloadAction<Card>) => {
            let newCards = removeFromArray(action.payload, state.cards);
            state.cards = newCards;
            state.selectedCard = null;
            state.addingCard = false;
        },
        //Card Correct / Fail ==========================================================
        cardCorrect: (state, action: PayloadAction<Card>) => {
            state.selectedCard = null;
            state.addingCard = false;
            let newCardArray = correctCardAdjustment(action.payload, state.cards);
            state.cards = newCardArray;
        },
        cardIncorrect: (state, action: PayloadAction<Card>) => {
            let lastChecked = new Date().getTime();
            let newCards = editInArray({...action.payload, points: 0, lastChecked, lastCheckingPeriod: '1 Hour'}, state.cards);
            state.cards = newCards;
            state.selectedCard = null;
            state.addingCard = false;
        }
    }
});

export const {  setCards, setGroups, 
                setViewingShared, setSelectedCard, setFlippedCard, setSelectedGroup, setAddingCard, 
                addGroup, editGroup, deleteGroup,
                addCard, editCard, deleteCard, cardCorrect, cardIncorrect } = mainSlice.actions;

export default mainSlice.reducer;