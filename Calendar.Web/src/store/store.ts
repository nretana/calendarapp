import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { eventApi } from './services/events/eventApi';

import calendarPickerSlice from './slices/calendarPickerSlice';
import calendarBoardSlice from './slices/calendarBoardSlice';
import weeklyCalendarBoardSlice from './slices/weeklyCalendarBoardSlice';

const reducers = {
    calendarPicker: calendarPickerSlice.reducer,
    calendarBoard: calendarBoardSlice.reducer,
    weeklyCalendarBoard: weeklyCalendarBoardSlice.reducer,
    [eventApi.reducerPath]: eventApi.reducer
};

const rootReducer = combineReducers(reducers);

const initialState = {};

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
        getDefaultMiddleware({ serializableCheck: false })
        return getDefaultMiddleware({
            serializableCheck: false
        }).concat(eventApi.middleware)
    },
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: initialState
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;