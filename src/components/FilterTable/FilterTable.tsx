import React, {ReactNode, useState} from 'react';
import {
    Box,
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    IconButton,
    Fab,
    TextField,
    InputAdornment,
} from '@mui/material';
import {Add, Search as SearchIcon} from '@mui/icons-material';
import Grid from "@mui/material/Grid2";
import styled from "@mui/material/styles/styled";
import useTheme from "@mui/material/styles/useTheme";

export interface FilterTableColumn {
    key: string;
    label: string;
    render?: (row: any) => ReactNode;
}

export interface FilterTableAction {
    icon: ReactNode;
    onClick: (row: any) => void;
    color?: 'primary' | 'secondary' | 'error' | 'info' | 'warning' | 'default';
}

interface FilterTableProps {
    title?: string;
    rows: any[];
    columns: FilterTableColumn[];
    actions?: FilterTableAction[];
    searchableKeys?: string[];
    onAdd?: () => void;
}

export default function FilterTable({title, rows, columns, actions, onAdd, searchableKeys = []}: FilterTableProps) {

    const theme = useTheme();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');

    const handleChangePage = (_: any, newPage: React.SetStateAction<number>) => setPage(newPage);
    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(0);
    };

    const filteredRows = rows.filter((row) =>
        searchableKeys.some((key) =>
            String(row[key]).toLowerCase().includes(search.toLowerCase())
        )
    );

    const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box my={4}>
            {title && <Typography variant="h4" gutterBottom>{title}</Typography>}

            {/*<Box mb={2}>

            </Box>*/}

            <Paper sx={{p: theme.spacing(2), mb: theme.spacing(3)}}>
                <Grid container spacing={2} direction="row"
                      sx={{
                          justifyContent: "space-between",
                          alignItems: "center",
                      }}>
                    <Grid>
                        <TextField
                            size="small"
                            fullWidth
                            placeholder="Search..."
                            value={search}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon/>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid size="auto">
                        Actions
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{p: theme.spacing(2)}}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((col) => (
                                    <TableCell key={col.key}>{col.label}</TableCell>
                                ))}
                                {actions && <TableCell align="right">Actions</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedRows.map((row) => (
                                <TableRow key={row.id}>
                                    {columns.map((col) => (
                                        <TableCell
                                            key={col.key}>{col.render ? col.render(row) : row[col.key]}
                                        </TableCell>
                                    ))}
                                    {actions && (
                                        <TableCell align="right">
                                            {actions.map((action, index) => (
                                                <IconButton
                                                    key={index}
                                                    onClick={() => action.onClick(row)}
                                                    color={action.color || 'default'}
                                                >
                                                    {action.icon}
                                                </IconButton>
                                            ))}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}

                            {paginatedRows.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} align="center">
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={filteredRows.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </Paper>

            {onAdd && (
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{position: 'fixed', bottom: 24, right: 24}}
                    onClick={onAdd}
                >
                    <Add/>
                </Fab>
            )}
        </Box>
    );
}