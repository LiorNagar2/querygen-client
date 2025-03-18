import React, {createContext, useMemo, useState} from "react";
import {ThemeProvider, useTheme} from "@mui/material";
import {darkTheme, lightTheme} from "./theme";

interface ThemModeContextI {
    mode: 'light' | 'dark';
    toggleMode: () => void;
}

export const ThemeModeContext = createContext<ThemModeContextI>({
    mode: "light", toggleMode: () => {
    }
});

const ThemeModeProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({children}) => {

    //const theme = useTheme();
    const [mode, setMode] = useState<'light' | 'dark'>('dark');

    const toggleMode: ThemModeContextI['toggleMode'] = () => {
        setMode((prevMode) => prevMode === 'light' ? 'dark' : 'light');
    };

    let theme = useMemo(() => {
        return mode === 'dark' ? darkTheme : lightTheme;
    }, [mode]);

    return (
        <ThemeModeContext.Provider value={{mode, toggleMode}}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeModeContext.Provider>
    )
};

export default ThemeModeProvider;