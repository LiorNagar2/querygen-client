import React, {ReactNode} from "react";
import Grid from '@mui/material/Grid2';
import {Card, CardContent, Paper, Typography} from "@mui/material";
import Box from "@mui/material/Box";

interface Props {
    children: ReactNode;
    sidebar?: {
        title?: string;
        widgets?: { title: string, widget: ReactNode }[]
    }
}

const DashboardPageLayout = (props: Props) => {

    const {children, sidebar} = props;

    return (
        <Grid container spacing={3} sx={{p: 3}}>
            <Grid size="grow">
                {children}
            </Grid>
            {sidebar && (
                <Grid size={{xs: 3}}>
                    {sidebar?.title && (
                        <Typography variant="h5" gutterBottom>{sidebar.title}</Typography>
                    )}
                    {sidebar?.widgets && sidebar.widgets.map((widget) => (
                        <Box sx={{ my: 2 }}>
                            <Typography variant="subtitle1">{widget.title}</Typography>
                            {widget.widget}
                        </Box>
                    ))}
                </Grid>
            )}
        </Grid>
    )
};

export default DashboardPageLayout;