import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {
    selectEntityState,
    selectSelectedDatabaseId
} from "../../store/crud/crud.selectors";
import PageContent from "../../layouts/dashboard/PageContent";
import {Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {Delete, Edit} from "@mui/icons-material";
import FilterTable, {FilterTableAction, FilterTableColumn} from "../../components/FilterTable/FilterTable";
import {useNavigate} from "react-router";
import {Pages} from "../../layouts/dashboard/MainMenu";
import {Link} from "react-router-dom";
import {formatDate, formatDateWithLocale} from "../../utils/date";

const allPosts = Array.from({length: 50}, (_, i) => ({
    id: i + 1,
    name: `Post ${i + 1}`,
    status: i % 2 === 0 ? 'Published' : 'Draft',
    createdAt: `2025-04-${(i % 30 + 1).toString().padStart(2, '0')}`,
    updatedAt: `2025-05-${(i % 30 + 1).toString().padStart(2, '0')}`,
}));

const columns: FilterTableColumn[] = [
    //{key: '_id', label: 'ID'},
    {
        key: 'name',
        label: 'Name',
        render: (row) => (
            <Link to={`${Pages.QUERIES}/${row._id}`} style={{textDecoration: 'none', color: '#1976d2'}}>
                {row.name}
            </Link>
        )
    },
    {
        key: 'createdAt',
        label: 'Created At',
        render: (row) => formatDateWithLocale(row.createdAt),
    },
    {
        key: 'updatedAt',
        label: 'Last Modified',
        render: (row) => formatDate(row.updatedAt),
    },
];


const ListQueries = () => {

    const selectedDatabaseId = useAppSelector(selectSelectedDatabaseId);

    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const queries = useAppSelector((state) => selectEntityState(state, 'queries'));
    const data = queries.data || [];
    const loading = queries.loading;
    const error = queries.error;

    const actions: FilterTableAction[] = [
        {
            icon: <Edit/>,
            onClick: (item) => navigate(Pages.QUERIES + '/' + item._id),
            color: 'primary',
        },
        {
            icon: <Delete/>,
            onClick: (item) => console.log('Delete item', item),
            color: 'error',
        },
    ];

    return (
        <PageContent loading={loading} title={'Queries'}>

            <FilterTable
                rows={data}
                columns={columns}
                actions={actions}
                searchableKeys={['name']}
                onAdd={() => navigate(Pages.QUERIES_NEW)}
            />

        </PageContent>
    )
};

export default ListQueries;