import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Paper, TextField, Button, Typography, Box,
    Select, MenuItem, FormControl, InputLabel,
    Tabs, Tab
} from '@mui/material';
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import DataTable from "../../components/DataTable/DataTable";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectSelectedDatabase } from "../../store/crud/crud.selectors";
import FolderTreeView, { SchemaItem } from "../../components/FolderTreeView/FolderTreeView";
import PageContent from "../../layouts/dashboard/PageContent";
import { useNavigate, useParams } from "react-router-dom";
import GenerateSQLDialog from "./components/GenerateSQLDialog";
import { createEntity, updateEntity } from "../../store/crud/crud.actions";
import { HelpOutline } from '@mui/icons-material';

export default function QueryDatabase() {
    const db = useAppSelector(selectSelectedDatabase);
    const dbSchema = useAppSelector((state) => state.crud.selectedDatabaseSchema || {});
    const queries = useAppSelector((state) => state.crud.entities['queries']?.data || []);
    const isQueriesLoading = useAppSelector((state) => state.crud.entities['queries']?.loading || false);
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [state, setState] = useState({
        name: '',
        sqlQuery: '',
        queryResults: [],
        page: 0,
        rowsPerPage: 5,
        error: '',
        generateSqlDialogOpen: false,
        graphType: 'bar',
        labelColumn: '',
        valueColumns: [] as string[],
        visibility: 'public',
        schedule: '',
        activeTab: 0,
    });

    const updateState = (updates: Partial<typeof state>) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    useEffect(() => {
        if (isEditMode && queries.length > 0) {
            const queryData = queries.find(q => q._id === id);
            if (queryData) {
                updateState({
                    name: queryData.name || '',
                    sqlQuery: queryData.query || '',
                    labelColumn: queryData.graphConfig?.labelColumn || '',
                    valueColumns: queryData.graphConfig?.valueColumns || [],
                    graphType: queryData.graphConfig?.chartType || '',
                });
            }
        }
    }, [isEditMode, id, queries]);

    const generateSQL = (sql: string) => {
        try {
            updateState({ error: '', sqlQuery: sql || '', queryResults: [] });
        } catch (err) {
            console.error("Error generating SQL:", err);
            updateState({ error: 'Failed to generate SQL. Please try again.' });
        }
    };

    const executeQuery = async () => {
        try {
            updateState({ error: '' });
            if (!state.sqlQuery.trim()) return;
            const response = await axios.post(`http://localhost:3001/database/query/${db._id}`, { query: state.sqlQuery });
            updateState({
                queryResults: response.data?.data || [],
                page: 0,
            });
        } catch (err) {
            console.error("Error executing SQL query:", err);
            updateState({ error: 'Failed to execute query. Please check your SQL syntax.', queryResults: [] });
        }
    };

    const saveQuery = async () => {
        try {
            const payload = {
                name: state.name,
                query: state.sqlQuery,
                visibility: state.visibility,
                schedule: state.schedule,
                graphConfig: {
                    chartType: state.graphType,
                    labelColumn: state.labelColumn,
                    valueColumns: state.valueColumns,
                }
            };

            if (isEditMode && id) {
                dispatch(updateEntity('queries', id, payload, `database/${db._id}/queries`));
            } else {
                dispatch(createEntity('queries', payload, `database/${db._id}/queries`));
            }

            navigate('/queries');
        } catch (err) {
            console.error("Failed to save query:", err);
            updateState({ error: "Failed to save query." });
        }
    };

    const columns = state.queryResults.length > 0 ? Object.keys(state.queryResults[0]) : [];
    const labels = state.queryResults.map((row: any) => row[state.labelColumn] || '');

    const series = state.valueColumns.map((col) => ({
        data: state.queryResults.map((row: any) => Number(row[col]) || 0),
        label: col,
    }));

    const schemaData: SchemaItem[] = Object.keys(dbSchema).map((schemaName) => ({
        key: schemaName,
        label: schemaName,
        children: dbSchema[schemaName].map((col: any) => ({
            label: col.name,
            type: col.type,
        })),
    }));

    return (
        <PageContent
            title={isEditMode ? 'Edit Query' : 'Create Query'}
            fixedSidebar
            sidebarTopOffset={64}
            loading={isQueriesLoading}
            sidebar={
                <Box>
                    <Paper variant="outlined" sx={{ mt: 4, p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle1" gutterBottom fontWeight="500">Publish Settings</Typography>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Visibility</InputLabel>
                            <Select
                                value={state.visibility}
                                onChange={(e) => updateState({ visibility: e.target.value })}
                                label="Visibility"
                            >
                                <MenuItem value="public">Public</MenuItem>
                                <MenuItem value="private">Private</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            type="datetime-local"
                            fullWidth
                            label="Schedule"
                            InputLabelProps={{ shrink: true }}
                            sx={{ mb: 2 }}
                            value={state.schedule}
                            onChange={(e) => updateState({ schedule: e.target.value })}
                        />
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Button variant="outlined" color="primary" size="small">Save Draft</Button>
                            <Button variant="contained" color="success" onClick={saveQuery} size="small">
                                {isEditMode ? 'Update' : 'Publish'}
                            </Button>
                        </Box>
                    </Paper>
                    <Paper variant="outlined" sx={{ mt: 4, p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle1" gutterBottom fontWeight="500">Schema</Typography>
                        <FolderTreeView data={schemaData} title="Database Structure" />
                    </Paper>
                </Box>
            }
        >
            <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                <TextField
                    fullWidth
                    label="Query Name"
                    placeholder="Enter a descriptive name for your query"
                    variant="outlined"
                    value={state.name}
                    onChange={(e) => updateState({ name: e.target.value })}
                    sx={{ mb: 3 }}
                />

                <Paper
                    variant="outlined"
                    sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 2,
                        bgcolor: 'background.default'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ flex: 1 }}>SQL Query</Typography>
                        <Button
                            variant="outlined"
                            startIcon={<HelpOutline />}
                            onClick={() => updateState({ generateSqlDialogOpen: true })}
                            sx={{
                                borderRadius: 1.5,
                                textTransform: 'none',
                                px: 2
                            }}
                        >
                            Ask a Database Question
                        </Button>
                    </Box>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Enter your SQL query here..."
                        value={state.sqlQuery}
                        onChange={(e) => updateState({ sqlQuery: e.target.value })}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5
                            }
                        }}
                    />
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={executeQuery}
                            sx={{
                                borderRadius: 1.5,
                                px: 3
                            }}
                        >
                            Run Query
                        </Button>
                    </Box>
                </Paper>

                {state.error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {state.error}
                    </Typography>
                )}

                {state.queryResults.length > 0 && (
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Tabs
                            value={state.activeTab}
                            onChange={(_, newValue) => updateState({ activeTab: newValue })}
                            sx={{
                                borderBottom: 1,
                                borderColor: 'divider',
                                mb: 3
                            }}
                        >
                            <Tab label="Query Results" />
                            <Tab label="Graph Configuration" />
                        </Tabs>

                        {state.activeTab === 0 && (
                            <Box>
                                <DataTable
                                    data={state.queryResults}
                                    page={state.page}
                                    rowsPerPage={state.rowsPerPage}
                                    setPage={(page) => updateState({ page })}
                                    setRowsPerPage={(rowsPerPage) => updateState({ rowsPerPage })}
                                    size="small"
                                />
                            </Box>
                        )}

                        {state.activeTab === 1 && (
                            <Box>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                                    <FormControl sx={{ minWidth: 200 }}>
                                        <InputLabel>Label Column</InputLabel>
                                        <Select
                                            value={state.labelColumn}
                                            onChange={(e) => updateState({ labelColumn: e.target.value })}
                                            sx={{ borderRadius: 1.5 }}
                                        >
                                            {columns.map((col) => (
                                                <MenuItem key={col} value={col}>{col}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{ minWidth: 200 }}>
                                        <InputLabel>Value Columns</InputLabel>
                                        <Select
                                            multiple
                                            value={state.valueColumns}
                                            onChange={(e) => updateState({ valueColumns: e.target.value as any })}
                                            renderValue={(selected) => selected.join(', ')}
                                            sx={{ borderRadius: 1.5 }}
                                        >
                                            {columns.map((col) => (
                                                <MenuItem key={col} value={col}>{col}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{ minWidth: 200 }}>
                                        <InputLabel>Chart Type</InputLabel>
                                        <Select
                                            value={state.graphType}
                                            onChange={(e) => updateState({ graphType: e.target.value })}
                                            sx={{ borderRadius: 1.5 }}
                                        >
                                            <MenuItem value="bar">Bar Chart</MenuItem>
                                            <MenuItem value="line">Line Chart</MenuItem>
                                            <MenuItem value="pie">Pie Chart (1 Value Only)</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>

                                {labels.length > 0 && series.length > 0 && (
                                    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                                        {state.graphType === 'bar' && (
                                            <BarChart xAxis={[{ scaleType: 'band', data: labels }]} series={series} width={600} height={300} />
                                        )}
                                        {state.graphType === 'line' && (
                                            <LineChart xAxis={[{ scaleType: 'band', data: labels }]} series={series} width={600} height={300} />
                                        )}
                                        {state.graphType === 'pie' && state.valueColumns.length === 1 && (
                                            <PieChart
                                                series={[{
                                                    data: labels.map((label, index) => ({
                                                        id: label,
                                                        value: series[0].data[index],
                                                        label
                                                    }))
                                                }]}
                                                width={400}
                                                height={300}
                                            />
                                        )}
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Paper>
                )}
            </Box>

            <GenerateSQLDialog
                open={state.generateSqlDialogOpen}
                onClose={() => updateState({ generateSqlDialogOpen: false })}
                onGenerate={generateSQL}
                dbId={db?._id}
            />
        </PageContent>
    );
}
