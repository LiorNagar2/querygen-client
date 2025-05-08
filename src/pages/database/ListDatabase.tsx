import React, {useEffect} from "react";
import PageContent from "../../layouts/dashboard/PageContent";
import {useAppSelector} from "../../store/hooks";
import {selectEntityState} from "../../store/crud/crud.selectors";
import FilterTable, {FilterTableAction, FilterTableColumn} from "../../components/FilterTable/FilterTable";
import {Link, useNavigate} from "react-router-dom";
import {Pages} from "../../layouts/dashboard/MainMenu";
import {formatDate, formatDateWithLocale} from "../../utils/date";
import {Delete, Edit} from "@mui/icons-material";

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


const ListDatabase = () => {

    const database = useAppSelector((state) => selectEntityState(state, 'database'));
    const data = database.data || [];
    const loading = database.loading;
    const error = database.error;

    const navigate = useNavigate();

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
        <PageContent title={'Databases'}>
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

export default ListDatabase;