import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import { useAppSelector } from '../../store/hooks';
import { selectSelectedDatabase } from '../../store/crud/crud.selectors';
import PageContent from '../../layouts/dashboard/PageContent';
import apis from '../../services/axios';

interface Query {
    _id: string;
    name: string;
    query: string;
    graphConfig?: {
        chartType: 'bar' | 'line' | 'pie';
        labelColumn: string;
        valueColumns: string[];
    };
}

interface Database {
    _id: string;
    name: string;
}

export default function QueryGraphs() {
    const db = useAppSelector(selectSelectedDatabase) as Database;
    const queries = useAppSelector((state) => state.crud.entities['queries']?.data || []) as Query[];
    const [queryResults, setQueryResults] = useState<Record<string, any[]>>({});
    const [loading, setLoading] = useState<Record<string, boolean>>({});

    const executeQuery = async (query: Query) => {
        try {
            setLoading(prev => ({ ...prev, [query._id]: true }));
            const response = await apis.databaseApi.databaseControllerExecuteQuery(db._id, {
                data: { query: query.query }
            });
            setQueryResults(prev => ({ ...prev, [query._id]: (response as any).data?.data || [] }));
        } catch (err) {
            console.error("Error executing query:", err);
        } finally {
            setLoading(prev => ({ ...prev, [query._id]: false }));
        }
    };

    useEffect(() => {
        if (db?._id && queries.length > 0) {
            queries.forEach(query => {
                executeQuery(query);
            });
        }
    }, [db?._id, queries]);

    const getChartData = (query: Query) => {
        const results = queryResults[query._id] || [];
        if (!results.length || !query.graphConfig) return null;

        const labels = results.map(row => row[query.graphConfig!.labelColumn] || '');
        const series = query.graphConfig.valueColumns.map(col => ({
            data: results.map(row => Number(row[col]) || 0),
            label: col,
        }));

        return { labels, series };
    };

    if (!db) {
        return (
            <PageContent title="Query Graphs">
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6" color="error">
                        Please select a database first to view query graphs.
                    </Typography>
                </Box>
            </PageContent>
        );
    }

    return (
        <PageContent title={`Query Graphs for ${db.name}`}>
            <Grid container spacing={2} sx={{ mt: 2 }}>
                {queries.map((query) => (
                    <Grid item xs={12} md={6} key={query._id}>
                        <Paper sx={{ p: 2, height: '100%' }}>
                            <Typography variant="h6">{query.name}</Typography>
                            {loading[query._id] && (
                                <Typography sx={{ mt: 1, mb: 2 }}>Loading results...</Typography>
                            )}

                            {queryResults[query._id] && query.graphConfig && (
                                <Box sx={{ mt: 2 }}>
                                    {(() => {
                                        const chartData = getChartData(query);
                                        if (!chartData) return null;

                                        switch (query.graphConfig.chartType) {
                                            case 'bar':
                                                return (
                                                    <BarChart
                                                        xAxis={[{ scaleType: 'band', data: chartData.labels }]}
                                                        series={chartData.series}
                                                        width={500}
                                                        height={300}
                                                    />
                                                );
                                            case 'line':
                                                return (
                                                    <LineChart
                                                        xAxis={[{ scaleType: 'band', data: chartData.labels }]}
                                                        series={chartData.series}
                                                        width={500}
                                                        height={300}
                                                    />
                                                );
                                            case 'pie':
                                                return chartData.series.length === 1 && (
                                                    <PieChart
                                                        series={[{
                                                            data: chartData.labels.map((label, index) => ({
                                                                id: label,
                                                                value: chartData.series[0].data[index],
                                                                label
                                                            }))
                                                        }]}
                                                        width={400}
                                                        height={300}
                                                    />
                                                );
                                            default:
                                                return null;
                                        }
                                    })()}
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </PageContent>
    );
} 