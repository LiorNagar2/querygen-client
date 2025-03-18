import React, {useMemo, useState} from 'react';
import './App.css';
import {ThemeProvider} from "@mui/material";
import MainRouter from "./routes/MainRouter";
import CssBaseline from "@mui/material/CssBaseline/CssBaseline";
import {darkTheme, lightTheme} from "./theme/theme";
import ThemeModeProvider from "./theme/themeContext";
import {useAppSelector} from "./store/hooks";
import {Theme} from "@mui/material/styles/createThemeNoVars";

function App() {

    const themeMode = useAppSelector(state => state.theme.mode);

    let theme = useMemo(() => {
        localStorage.setItem('themeMode', themeMode);
        return themeMode === 'light' ? lightTheme : darkTheme
    }, [themeMode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <MainRouter/>
        </ThemeProvider>
    )
}

export default App;
