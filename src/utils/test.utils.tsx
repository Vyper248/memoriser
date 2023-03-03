import React from "react";
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import type { PreloadedState } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

import type { RootState } from "../redux/store";
import type { MainSlice } from "../redux/mainSlice";

import mainReducer, { initialState } from '../redux/mainSlice';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> { 
    preloadedState?: PreloadedState<RootState>;
}

const customRender = (
    ui: React.ReactElement,
    options?: ExtendedRenderOptions,
) => {

    const AllProviders = ( { children }: { children: React.ReactNode } ) => {
        let preloadedState = options?.preloadedState ? options.preloadedState : {};
        let store = configureStore({ reducer: { main: mainReducer }, preloadedState });
    
        return (
            <Provider store={store}>
                { children }
            </Provider>
        )
    }

    return render(ui, { wrapper: AllProviders, ...options })
}

export { customRender as render };

//helper function to get a mock state with any values passed in to replace defaults
export const getBasicMockState = (state: Partial<MainSlice>) => {
    let mockState = {...initialState, ...state};
    return { preloadedState: { main: mockState }};
}