import React from "react";
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import CloudIcon from '@mui/icons-material/Cloud';

interface MenuItem {
    text: string;
    link: string;
    icon: any;
    title?: string
}

export enum Pages {
    DATABASES = '/database',
    DATABASE__CREATE = '/database/create',
    HOME = '/',
    DASHBOARD__USERS = '/dashboard/users',
    DASHBOARD__CREATE_USER = '/dashboard/create-user',
}

export const menuItems: MenuItem[] = [
    {
        text: 'Home',
        link: Pages.HOME,
        icon: <HomeIcon/>,
    },
    {
        text: 'Databases',
        link: Pages.DATABASES,
        icon: <CloudIcon/>,
    },
    {
        text: 'Users',
        link: Pages.DASHBOARD__USERS,
        icon: <PersonIcon/>,
        title: 'Users Title'
    },
];