import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RouteObject } from "react-router/dist/lib/context";
import React, { useEffect } from "react";
import DashboardLayout from "../layouts/dashboard/DashboardLayout";
import QueryDatabase from "../QueryDatabase/QueryDatabase";
import CreateDatabase from "../pages/database/CreateDatabase";
import ListDatabase from "../pages/database/ListDatabase";
import DashboardHome from "../pages/DashboardHome";
import ListQueries from "../pages/queries/ListQueries";
import Login from "../pages/auth/Login/Login";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import Register from "../pages/auth/Register/Register";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { user_getUserData } from "../store/user/user.actions";
import QueryForm from "../pages/queries/QueryForm";
import QueryGraphs from "../pages/queries/QueryGraphs";

const routes: RouteObject[] = [
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/',
        element: <PrivateRoute />,
        children: [
            {
                path: '/',
                element: <DashboardLayout />,
                children: [
                    {
                        path: '/',
                        element: <DashboardHome />
                    },
                    {
                        path: '/database',
                        element: <ListDatabase />
                    },
                    {
                        path: '/database/create',
                        element: <CreateDatabase />
                    },
                    {
                        path: '/database/:id',
                        element: <QueryDatabase />
                    },
                    {
                        path: '/queries',
                        element: <ListQueries />
                    },
                    {
                        path: '/queries/new',
                        element: <QueryForm />
                    },
                    {
                        path: '/queries/:id',
                        element: <QueryForm />
                    },
                    {
                        path: '/queries/view',
                        element: <QueryGraphs />
                    },
                    {
                        path: '/queries/graphs',
                        element: <QueryGraphs />
                    }
                ]
            }
        ]
    }
];

const router = createBrowserRouter(routes);

const MainRouter = () => {

    const { hasJwtToken, loading } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (hasJwtToken && !loading) {
            dispatch(user_getUserData());
        }
    }, [hasJwtToken, loading]);

    return <RouterProvider router={router} />;
};

export default MainRouter;
