import React, { useEffect, useState } from 'react';
import { Box, Button, Drawer, MenuItem, Select, TextField, Typography } from '@mui/material';
import GridLayout from 'react-grid-layout';
import axios from 'axios';
import Paper from "@mui/material/Paper";

const BACKEND_URL = 'http://localhost:3001';

type DashboardComponent = {
    id: string;
    type: string;
    queryId: string;
    config: {
        title?: string;
        type?: string;
        [key: string]: any;
    };
};

type LayoutItem = {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
};

export default function DashboardBuilder({
                                             dashboardId,
                                             databaseId,
                                         }: {
    dashboardId: string;
    databaseId: string;
}) {
    const [layout, setLayout] = useState<LayoutItem[]>([]);
    const [components, setComponents] = useState<DashboardComponent[]>([]);
    const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

    const selectedComponent = components.find((c) => c.id === selectedComponentId);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/dashboards/${dashboardId}`).then((res) => {
            setLayout(res.data.layout);
            setComponents(res.data.components);
        });
    }, [dashboardId]);

    const addComponent = () => {
        const id = `comp-${Date.now()}`;
        const newComponent: DashboardComponent = {
            id,
            type: 'chart',
            queryId: '',
            config: { title: 'New Chart', type: 'bar' },
        };

        setComponents((prev) => [...prev, newComponent]);

        setLayout((prev) => {
            const nextX = prev.length % 3 * 4; // cycle: 0, 4, 8 (3 columns per row)
            return [
                ...prev,
                {
                    i: id,
                    x: nextX,
                    y: Infinity, // let react-grid-layout auto-place it in next available row
                    w: 4,
                    h: 6,
                },
            ];
        });
    };

    const updateComponentConfig = (key: string, value: any) => {
        setComponents((prev) =>
            prev.map((comp) =>
                comp.id === selectedComponentId
                    ? { ...comp, config: { ...comp.config, [key]: value } }
                    : comp
            )
        );
    };

    const saveDashboard = async () => {
        await axios.put(`${BACKEND_URL}/dashboards/${dashboardId}`, {
            layout,
            components,
            databaseId,
        });
        alert('Dashboard saved!');
    };

    return (
        <Box>
            <Box display="flex" gap={2} mb={2}>
                <Button onClick={addComponent} variant="contained">
                    + Add Component
                </Button>
                <Button onClick={saveDashboard} variant="outlined">
                    Save Dashboard
                </Button>
            </Box>

            <GridLayout
                layout={layout}
                cols={12}
                rowHeight={30}
                width={1200}
                onLayoutChange={(newLayout) => setLayout(newLayout)}
                draggableHandle=".drag-handle"
            >
                {components.map((comp) => (
                    <Paper
                        key={comp.id}
                        data-grid={
                            layout.find((l) => l.i === comp.id) ?? {
                                i: comp.id,
                                x: 0,
                                y: Infinity,
                                w: 4,
                                h: 6,
                            }
                        }
                        onClick={() => setSelectedComponentId(comp.id)}
                        sx={{p:1}}
                    >
                        <Typography className="drag-handle" fontWeight="bold" mb={1}>
                            {comp.config.title || 'Untitled'}
                        </Typography>
                        <Box>{`[${comp.type}] Chart - ${comp.config.type}`}</Box>
                    </Paper>
                ))}
            </GridLayout>

            {/* Drawer for Editing */}
            <Drawer
                anchor="right"
                open={!!selectedComponentId}
                onClose={() => setSelectedComponentId(null)}
            >
                <Box width={300} p={2}>
                    <Typography variant="h6" gutterBottom>
                        Edit Component
                    </Typography>
                    {selectedComponent && (
                        <>
                            <TextField
                                fullWidth
                                label="Title"
                                value={selectedComponent.config.title || ''}
                                onChange={(e) => updateComponentConfig('title', e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Select
                                fullWidth
                                value={selectedComponent.config.type || 'bar'}
                                onChange={(e) => updateComponentConfig('type', e.target.value)}
                                sx={{ mb: 2 }}
                            >
                                <MenuItem value="bar">Bar</MenuItem>
                                <MenuItem value="line">Line</MenuItem>
                                <MenuItem value="pie">Pie</MenuItem>
                            </Select>
                            {/* Add more editable fields here */}
                        </>
                    )}
                </Box>
            </Drawer>
        </Box>
    );
}
