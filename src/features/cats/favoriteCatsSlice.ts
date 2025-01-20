import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {Cat} from "../../models/cat";

export interface FavoriteCatsStateType {
    favoriteCats: Cat[],
}

const initialState: FavoriteCatsStateType = {
    favoriteCats: JSON.parse(localStorage.getItem('favoriteCats') || '[]')
}

export const favoriteCatsSlice = createSlice({
    name: 'favoriteCats',
    initialState,
    reducers: {
        addFavoriteCat: (state, action: PayloadAction<Cat>) => {
            const found = state.favoriteCats.find((cat) => cat.id === action.payload.id);
            if (!found) {
                state.favoriteCats.push({...action.payload, favorite: true});
                localStorage.setItem('favoriteCats', JSON.stringify(state.favoriteCats));
            }
        },
        removeFavoriteCat: (state, action: PayloadAction<string>) => {
            const found = state.favoriteCats.find((cat) => cat.id === action.payload);
            if (found) {
                state.favoriteCats = [...state.favoriteCats].filter(cat => cat.id !== action.payload);
                localStorage.setItem('favoriteCats', JSON.stringify(state.favoriteCats));
            }
        }
    },
})

export const selectIsFavoriteCat = (state: { favoriteCats: FavoriteCatsStateType }, id: string) => {
    return state.favoriteCats.favoriteCats.some(cat => cat.id === id);
};

export const { addFavoriteCat, removeFavoriteCat } = favoriteCatsSlice.actions;
export default favoriteCatsSlice.reducer;