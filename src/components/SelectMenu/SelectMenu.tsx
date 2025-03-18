import React, { useRef } from "react";
import {
    MenuItem,
    Select,
    FormControl,
    OutlinedInput,
    InputAdornment,
    Typography,
    TextField,
    useTheme,
    SelectChangeEvent
} from "@mui/material";

export interface SelectMenuOption {
    value: string;
    title: string;
    subtitle?: string;
}

interface SelectMenuProps {
    value: string;
    options: SelectMenuOption[];
    onChange: (event: SelectChangeEvent<string>) => void;
    icon?: React.ReactNode;
}

const IconSelect: React.FC<SelectMenuProps> = ({ value, options, onChange, icon }) => {

    const theme = useTheme();
    const selectRef = useRef<HTMLDivElement>(null);

    const handleIconClick = () => {
        console.log(selectRef.current)
        if (selectRef.current) {
            selectRef.current.click(); // Open the select menu when the icon is clicked
        }
    };

    return (
        <FormControl fullWidth variant="outlined">
            <Select
                ref={selectRef}
                value={value}
                onChange={onChange}
                displayEmpty
                variant={'outlined'}
                size={'small'}
                sx={{
                    minWidth: 200,
                    maxWidth: 200,
                    whiteSpace: "nowrap",
                    backgroundColor: theme.palette.background.default, // Match Drawer background
                    borderRadius: 1,
                }}
                input={
                    <OutlinedInput
                        startAdornment={
                            icon && (
                                <InputAdornment position="start" onClick={handleIconClick} style={{ cursor: "pointer" }} color={'primary'}>
                                    {icon}
                                </InputAdornment>
                            )
                        }
                    />
                }
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        <div>
                            <Typography variant="body1">{option.title}</Typography>
                            {option.subtitle && (
                                <Typography variant="body2" color="textSecondary">
                                    {option.subtitle}
                                </Typography>
                            )}
                        </div>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default IconSelect;
