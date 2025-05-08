import React from 'react';
import {Box, CircularProgress, alpha, useTheme} from '@mui/material';

interface SuspenseLoaderProps {
    fullscreen?: boolean;
}

const SuspenseLoader: React.FC<SuspenseLoaderProps> = ({ fullscreen = true }) => {

    const theme = useTheme();

    return (
        <Box
            sx={{
                position: fullscreen ? 'fixed' : 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: fullscreen ? 1300 : 10,
                backgroundColor: alpha(theme.palette.background.paper, 0.7), // translucent background
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <CircularProgress />
        </Box>
    );
}

export default SuspenseLoader;
