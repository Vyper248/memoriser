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
    cards: [],
    groups: [],
    selectedCard: null,
    flippedCard: null,
    selectedGroup: null,
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
            state.selectedGroup = action.payload;
        },
    }
});

export const { setViewingShared, setSelectedCard, setFlippedCard, setSelectedGroup } = mainSlice.actions;

export default mainSlice.reducer;