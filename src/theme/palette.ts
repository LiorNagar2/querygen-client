import { PaletteOptions } from '@mui/material/styles';
import {grey} from "@mui/material/colors";

const greyscale =  { // Add MUI grey colors explicitly
    0: '#ffffff',
    50:  "#fafafa",
    100: '#f5f5f5',
    200: '#e0e0e0',
    300: '#c2c2c2',
    400: '#a3a3a3',
    500: '#858585',
    600: '#666666',
    700: '#4d4d4d',
    800: '#333333',
    900: '#1a1a1a',
    1000: '#000000'
};

export const invertGrayscale = (mode: 'light' | 'dark', grayscale: {[key: string]: string}) => {
    const levels = Object.keys(grayscale) // ['100', ..., '900']
    const inverted: typeof grayscale = {};

    levels.forEach((level, i) => {
        const invertedLevel = levels[levels.length - 1 - i];
        inverted[level as keyof typeof grayscale] = grayscale[invertedLevel as keyof typeof grayscale];
    });

    return mode === 'light' ? grayscale : inverted;
};

const getPalette = (mode: 'light' | 'dark'): PaletteOptions => {
    const gray = invertGrayscale(mode, greyscale);

    console.log(gray);

    return {
        mode,
        primary: {main: "#002c6e", contrastText: "#ffffff"},
        secondary: {main: "#f59c15", contrastText: "#ffffff"},
        background: { default: gray[50], paper: gray[0]},
        text: { primary: gray[900],  secondary: gray[700]},
        error: {main: "#d32f2f"},
        warning: {main: "#f57c00"},
        info: {main: "#0288d1"},
        success: {main: "#388e3c"},
        divider: gray[300],
        grey: gray,
    };
};

export default getPalette;