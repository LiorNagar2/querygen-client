import React, {useState} from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TablePagination, Paper, TextField, Button, Typography, Box, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import {BarChart, LineChart, PieChart} from "@mui/x-charts";
import DataTable from "../components/DataTable/DataTable";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {selectSelectedDatabase} from "../store/crud/crud.selectors";
import {connectToDatabase} from "../store/crud/crud.actions";
import DashboardPageLayout from "../layouts/dashboard/DashboardPageLayout";
import FolderTreeView, {SchemaItem} from "../components/FolderTreeView/FolderTreeView";
import {RootState} from "../store/store";
import PageContent from "../layouts/dashboard/PageContent";

export default function QueryDatabase() {

    const db = useAppSelector(selectSelectedDatabase);
    const dbSchema = useAppSelector((state) => state.crud.selectedDatabaseSchema || {});

    const [question, setQuestion] = useState<string>('');
    const [sqlQuery, setSqlQuery] = useState('');
    const [queryResults, setQueryResults] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [error, setError] = useState('');

    const [graphType, setGraphType] = useState('bar');
    const [labelColumn, setLabelColumn] = useState('');
    const [valueColumn, setValueColumn] = useState('');

    const generateSQL = async () => {
        try {
            setError('');
            const response = await axios.post(`http://localhost:3001/database/generate-sql/${db._id}`, {question});
            setSqlQuery(response.data.sql || '');
            setQueryResults([]);
        } catch (err) {
            console.error("Error generating SQL:", err);
            setError('Failed to generate SQL. Please try again.');
        }
    };

    const executeQuery = async () => {
        try {
            setError('');
            if (!sqlQuery.trim()) return;
            const response = await axios.post(`http://localhost:3001/database/query/${db._id}`, {query: sqlQuery});
            setQueryResults(response.data.data || []);
        } catch (err) {
            console.error("Error executing SQL query:", err);
            setError('Failed to execute query. Please check your SQL syntax.');
            setQueryResults([]);
        }
    };

    // Extract available columns from query results
    const columns = queryResults.length > 0 ? Object.keys(queryResults[0]) : [];

    // Generate data for the selected columns
    const labels = queryResults.map((row: any) => row[labelColumn] || ''); // Ensure valid data
    const data = queryResults.map((row: any) => Number(row[valueColumn]) || 0); // Convert values to numbers

    const schemaData: SchemaItem[] =
        Object.keys(dbSchema).map((schemaName, i) => {
            let columns = dbSchema[schemaName];
            return {
                key: schemaName,
                label: schemaName,
                children: columns.map((col) => ({
                    label: col.name,
                    type: col.type,
                })),
            }
        });
    /*[
    {
        key: "users",
        label: "Users",
        children: [
            { label: "id", type: "int" },
            { label: "name", type: "varchar(255)" },
            { label: "email", type: "varchar(255)" },
            { label: "created_at", type: "timestamp" },
            { label: "updated_at", type: "timestamp" },
        ],
    },
    {
        key: "accounts",
        label: "Accounts",
        children: [
            { label: "id", type: "int" },
            { label: "user_id", type: "int" },
            { label: "balance", type: "decimal(10,2)" },
            { label: "status", type: "varchar(50)" },
            { label: "created_at", type: "timestamp" },
        ],
    },
    {
        key: "accounts2",
        label: "Accounts",
        children: [
            { label: "id", type: "int" },
            { label: "user_id", type: "int" },
            { label: "balance", type: "decimal(10,2)" },
            { label: "status", type: "varchar(50)" },
            { label: "created_at", type: "timestamp" },
        ],
    },
    {
        key: "accounts3",
        label: "Accounts",
        children: [
            { label: "id", type: "int" },
            { label: "user_id", type: "int" },
            { label: "balance", type: "decimal(10,2)" },
            { label: "status", type: "varchar(50)" },
            { label: "created_at", type: "timestamp" },
        ],
    },
    {
        key: "accounts4",
        label: "Accounts",
        children: [
            { label: "id", type: "int" },
            { label: "user_id", type: "int" },
            { label: "balance", type: "decimal(10,2)" },
            { label: "status", type: "varchar(50)" },
            { label: "created_at", type: "timestamp" },
        ],
    },
]*/
    return (
        <PageContent
            fixedSidebar
            sidebarTopOffset={64} // This should match your AppBar height
            sidebar={
                <Box sx={{p: 4}}>
                    <Typography variant="h6" gutterBottom>Sidebar Tools</Typography>
                    <FolderTreeView data={schemaData} title={'Database Structure'}/>
                </Box>
            }
        >
            <Box sx={{p: 4}}>

                <Typography variant="h4" gutterBottom>Database Management</Typography>

                {/* Ask a Question */}
                <TextField
                    fullWidth
                    label="Ask a Database Question"
                    placeholder="E.g., Show all users who made an order"
                    variant="outlined"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    sx={{mb: 2}}
                />
                <Button variant="contained" color="primary" onClick={generateSQL} sx={{mb: 2}}>
                    Generate SQL
                </Button>

                {/* Generated SQL Query */}
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Generated SQL"
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    variant="outlined"
                    sx={{mb: 2}}
                />
                {sqlQuery && (
                    <Button variant="contained" color="secondary" onClick={executeQuery} sx={{mb: 2}}>
                        Run Query
                    </Button>
                )}

                {/* Error Message */}
                {error && <Typography color="error">{error}</Typography>}

                {/* Query Results */}
                {queryResults.length > 0 && (
                    <Paper sx={{mt: 2}}>
                        <Typography variant="h6" sx={{padding: 2}}>Query Results:</Typography>

                        <DataTable
                            data={queryResults}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            setPage={setPage}
                            setRowsPerPage={setRowsPerPage}
                            size={'small'}
                        />

                        {/* Graph Configuration */}
                        <h3>Graph Configuration:</h3>
                        <FormControl style={{minWidth: 150, marginRight: 10}}>
                            <InputLabel>Label Column</InputLabel>
                            <Select value={labelColumn} onChange={(e) => setLabelColumn(e.target.value)}>
                                {columns.map((col) => (
                                    <MenuItem key={col} value={col}>{col}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl style={{minWidth: 150, marginRight: 10}}>
                            <InputLabel>Value Column</InputLabel>
                            <Select value={valueColumn} onChange={(e) => setValueColumn(e.target.value)}>
                                {columns.map((col) => (
                                    <MenuItem key={col} value={col}>{col}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl style={{minWidth: 150}}>
                            <InputLabel>Chart Type</InputLabel>
                            <Select value={graphType} onChange={(e) => setGraphType(e.target.value)}>
                                <MenuItem value="bar">Bar Chart</MenuItem>
                                <MenuItem value="line">Line Chart</MenuItem>
                                <MenuItem value="pie">Pie Chart</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Graph Display */}
                        {labels.length > 0 && data.length > 0 && (
                            <div style={{marginTop: 20}}>
                                {graphType === 'bar' && (
                                    <BarChart
                                        xAxis={[{scaleType: 'band', data: labels}]}
                                        series={[{data}]}
                                        width={600}
                                        height={300}
                                    />
                                )}
                                {graphType === 'line' && (
                                    <LineChart
                                        xAxis={[{scaleType: 'band', data: labels}]}
                                        series={[{data}]}
                                        width={600}
                                        height={300}
                                    />
                                )}
                                {graphType === 'pie' && (
                                    <PieChart
                                        series={[{
                                            data: labels.map((label, index) => ({
                                                id: label,
                                                value: data[index],
                                                label
                                            }))
                                        }]}
                                        width={400}
                                        height={300}
                                    />
                                )}
                            </div>
                        )}
                    </Paper>
                )}
            </Box>
        </PageContent>
    );
};