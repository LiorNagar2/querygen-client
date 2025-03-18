import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {RouteObject} from "react-router/dist/lib/context";
import React from "react";
import DashboardLayout from "../layouts/dashboard/DashboardLayout";
import QueryDatabase from "../QueryDatabase/QueryDatabase";
import CreateDatabase from "../pages/database/CreateDatabase";
import ListDatabase from "../pages/database/ListDatabase";

const routes: RouteObject[] = [
    {
        path: '/',
        element: <DashboardLayout/>,
        children: [
            {
                path: '/database',
                element: <ListDatabase/>
            },
            {
                path: '/database/create',
                element: <CreateDatabase/>
            },
            {
                path: '/database/:id',
                element: <QueryDatabase/>
            }
        ]
    }
];

const router = createBrowserRouter(routes);

const MainRouter = () => {

    return <RouterProvider router={router}/>
};

export default MainRouter;