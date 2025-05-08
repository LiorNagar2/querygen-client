import React from 'react';
import {Box, Grid, Typography} from '@mui/material';
import CircularProgress from "@mui/material/CircularProgress";

interface PageContentProps {
    title?: string;
    children: React.ReactNode;
    sidebar?: React.ReactNode;
    sidebarWidth?: number;
    spacing?: number;
    fixedSidebar?: boolean;
    sidebarTopOffset?: number; // Optional offset for sticky sidebar (e.g., height of AppBar)
    loading?: boolean,
}

const PageContent: React.FC<PageContentProps> = (props) => {
    const {
        children,
        sidebar,
        sidebarWidth = 3,
        spacing = 3,
        fixedSidebar = false,
        sidebarTopOffset = 64,
        loading = false,
        title = undefined,
    } = props;

    if (loading) {
        return (
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <Grid container spacing={spacing}>
            <Grid item xs={12} md={sidebar ? 12 - sidebarWidth : 12}>
                <Box sx={{p: 4}}>
                    {title && (
                        <Typography variant="h4" gutterBottom>{title}</Typography>
                    )}
                    {children}
                </Box>
            </Grid>
            {sidebar && (
                <Grid item xs={12} md={sidebarWidth}>
                    <Box
                        sx={{
                            position: fixedSidebar ? 'sticky' : 'relative',
                            top: fixedSidebar ? sidebarTopOffset : 'auto',
                        }}
                    >
                        <Box sx={{p: 4}}>
                            {sidebar}
                        </Box>
                    </Box>
                </Grid>
            )}
        </Grid>
    );
};

export default PageContent;
