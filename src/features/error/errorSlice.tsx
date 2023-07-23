import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {RootState} from "../../app/store";

export interface ErrorState {
    message?: string
    metadata?: any
}

const initialState: ErrorState = {}

export const errorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        displayError: (state, action: PayloadAction<{ message: string, metadata?:any }>) => {
            state.message = action.payload.message;
            state.metadata = action.payload.metadata;
        },
    },
})

// Action creators are generated for each case reducer function
export const { displayError } = errorSlice.actions;

export const selectCurrentErrorMessage = (state: RootState) => state.error.message;
export const selectCurrentErrorMetaData = (state: RootState) => state.error.metadata;

export default errorSlice.reducer;