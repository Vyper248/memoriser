import { configureStore, createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import mainReducer from './mainSlice';
import { setCards, addCard, editCard, deleteCard, cardCorrect, cardIncorrect, 
        setGroups, addGroup, editGroup, deleteGroup,
        importBackup } from "./mainSlice";

const cardListener = createListenerMiddleware();
cardListener.startListening({
    matcher: isAnyOf(setCards, addCard, editCard, deleteCard, deleteGroup, cardCorrect, cardIncorrect, importBackup),
    effect: (_, listenerApi) => {
        const state = listenerApi.getState() as RootState
        if (state.main.viewingShared === false) {
            const cards = state.main.cards;
            localStorage.setItem('memoriser-data-cards', JSON.stringify(cards));
        }
    }
});

const groupListener = createListenerMiddleware();
groupListener.startListening({
    matcher: isAnyOf(setGroups, addGroup, editGroup, deleteGroup, importBackup),
    effect: (_, listenerApi) => {
        const state = listenerApi.getState() as RootState
        if (state.main.viewingShared === false) {
            const groups = state.main.groups;
            localStorage.setItem('memoriser-data-groups', JSON.stringify(groups));
        }
    }
});

export const store = configureStore({
    reducer: {
        main: mainReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(cardListener.middleware, groupListener.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;