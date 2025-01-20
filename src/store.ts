import { configureStore } from '@reduxjs/toolkit';
import favoriteCatsReducer from "./features/cats/favoriteCatsSlice";
import { catsApi } from './features/cats/allCatsApiSlice';

export const store = configureStore({
    reducer: {
        [catsApi.reducerPath]: catsApi.reducer,
        favoriteCats: favoriteCatsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(catsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
