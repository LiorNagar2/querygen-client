import React from "react";
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import CloudIcon from '@mui/icons-material/Cloud';
import BarChartIcon from '@mui/icons-material/BarChart';

interface MenuItem {
    text: string;
    link: string;
    icon: any;
    title?: string
}

export enum Pages {
    HOME = '/',

    LOGIN = '/login',
    REGISTER = '/register',

    DATABASES = '/database',
    DATABASE__CREATE = '/database/create',
    DASHBOARD__USERS = '/dashboard/users',
    DASHBOARD__CREATE_USER = '/dashboard/create-user',

    QUERIES = '/queries',
    QUERIES_NEW = '/queries/new',
    QUERIES_GRAPHS = '/queries/graphs',

    PROFILE = '/profile'
}

export const menuItems: MenuItem[] = [
    {
        text: 'Home',
        link: Pages.HOME,
        icon: <HomeIcon />,
    },
    {
        text: 'Databases',
        link: Pages.DATABASES,
        icon: <CloudIcon />,
    },
    {
        text: 'Queries',
        link: Pages.QUERIES,
        icon: <CloudIcon />,
    },
    {
        text: 'Query Graphs',
        link: Pages.QUERIES_GRAPHS,
        icon: <BarChartIcon />,
    },
    {
        text: 'Users',
        link: Pages.DASHBOARD__USERS,
        icon: <PersonIcon />,
        title: 'Users Title'
    },
];