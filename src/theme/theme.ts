import {createTheme, PaletteOptions} from "@mui/material/styles";
import grey from "@mui/material/colors/grey";

const invertColor = (color: string) => {
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(color)) return color;
    const hex = color.substring(1);
    const num = parseInt(hex, 16);
    const inverted = (0xffffff ^ num).toString(16).padStart(6, "0");
    return `#${inverted}`;
};

const deepInverse = (obj: object): object => {
    if (typeof obj !== "object" || obj === null) return obj

    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
            key,
            typeof value === "string" ? invertColor(value) : deepInverse(value),
        ])
    );
};

const palette: Partial<PaletteOptions> = {
    mode: "light",
    primary: {main: "#002c6e", contrastText: "#ffffff"},
    secondary: {main: "#f59c15", contrastText: "#ffffff"},
    background: {default: "#fcfcfc", paper: "#f5f6fa"},
    text: {primary: "#000000", secondary: "#555555"},
    error: {main: "#d32f2f"},
    warning: {main: "#f57c00"},
    info: {main: "#0288d1"},
    success: {main: "#388e3c"},
    divider: "#e0e0e0",
    grey: { // Add MUI grey colors explicitly
        50: grey[50],
        100: grey[100],
        200: grey[200],
        300: grey[300],
        400: grey[400],
        500: grey[500],
        600: grey[600],
        700: grey[700],
        800: grey[800],
        900: grey[900],
    },
};

export const lightTheme = createTheme({
    palette,
    typography: {
        fontFamily: '"Roboto", "Arial", sans-serif',
        h1: {fontSize: "2.5rem", fontWeight: 700},
        h2: {fontSize: "2rem", fontWeight: 700},
        h3: {fontSize: "1.75rem", fontWeight: 600},
        h4: {fontSize: "1.5rem", fontWeight: 600},
        h5: {fontSize: "1.25rem", fontWeight: 500},
        h6: {fontSize: "1rem", fontWeight: 500},
        body1: {fontSize: "1rem", fontWeight: 400},
        body2: {fontSize: "0.875rem", fontWeight: 400},
        button: {textTransform: "uppercase", fontWeight: 500},
    },
    breakpoints: {
        values: {xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920},
    },
    spacing: 8,
    shape: {borderRadius: 4},
    components: {
        MuiListItemIcon: {
            styleOverrides: {
                root: ({theme}) => ({
                    color: theme.palette.primary?.main, // Fallback to primary blue
                }),
            },
        },
    },
    /*shadows: [
        "none",
        "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
    ], // Keeping only basic shadows for simplicity*/
});

// Generate dark theme by inverting the light theme
export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        ...deepInverse(lightTheme.palette),
        primary: palette.primary, // keep primary color for darkMode
        secondary: palette.secondary, // keep secondary color for darkMode
    },
    typography: {...lightTheme.typography},
    breakpoints: {...lightTheme.breakpoints},
    spacing: lightTheme.spacing,
    shape: {...lightTheme.shape},
    shadows: [...lightTheme.shadows], // Copy the shadows
    components: {
        ...lightTheme.components,
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: invertColor(palette.divider!), // Invert the default border color
                    },
                },
            },
        },
    },
});

console.log(lightTheme.shadows);

