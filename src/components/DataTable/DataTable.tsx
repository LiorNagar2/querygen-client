import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TablePagination, Paper, Typography
} from '@mui/material';

interface DataTableProps {
    data: any[];
    page: number;
    rowsPerPage: number;
    setPage: (page: number) => void;
    setRowsPerPage: (rowsPerPage: number) => void;
}

const DataTable: React.FC<DataTableProps> = ({data, page, rowsPerPage, setPage, setRowsPerPage}) => {
    if (data.length === 0) {
        return <Typography variant="h6" sx={{padding: 2, textAlign: "center"}}>No data available</Typography>;
    }

    const columns = Object.keys(data[0]);

    return (
        <div>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((key) => (
                                <TableCell key={key} sx={{fontWeight: "bold"}}>{key}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                            <TableRow key={index}>
                                {columns.map((col, idx) => (
                                    <TableCell key={idx} sx={{
                                        maxWidth: "200px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {String(row[col])}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
            />
        </div>
    );
};

export default DataTable;
