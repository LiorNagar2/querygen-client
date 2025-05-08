import {createSlice, CreateSliceOptions, PayloadAction} from "@reduxjs/toolkit";
import { PaletteMode} from "@mui/material";

interface ThemeState {
    mode: PaletteMode;
}

const getThemeModeLocalStorage = () => {
    return localStorage.getItem('themeMode') || 'light';
};

const initialState: ThemeState = {
    mode: getThemeModeLocalStorage() as PaletteMode,
};


const ThemeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleThemeMode: (state: ThemeState) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
        }
    },
    selectors: {
        selectThemeMode: (state: ThemeState) => state.mode,
    }
});

export const {toggleThemeMode} = ThemeSlice.actions;
export const {selectThemeMode} = ThemeSlice.selectors;

export default ThemeSlice.reducer;