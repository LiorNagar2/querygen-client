import React from 'react';
import { Paper, Typography } from '@mui/material';
import PageContent from '../layouts/dashboard/PageContent';
import Box from "@mui/material/Box";
import ChatBot from "../components/ChatBot/ChatBot";

const DashboardHome = () => {
    return (
        <PageContent
            title={'Home'}
            fixedSidebar
            sidebarTopOffset={64} // This should match AppBar height
            sidebar={
                <Box>
                    <Typography variant="h6">Sidebar Tools</Typography>
                    <Typography>Filter, search, or stats</Typography>
                </Box>
            }
        >
            <Box>

                <ChatBot />

                <Typography paragraph>
                    Scroll to see if sidebar sticks to top.
                </Typography>
                {[...Array(30)].map((_, i) => (
                    <Typography key={i}>Line {i + 1}</Typography>
                ))}
            </Box>
        </PageContent>
    );
};

export default DashboardHome;
