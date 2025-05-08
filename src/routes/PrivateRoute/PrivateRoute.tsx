import React, {ReactNode} from "react";
import {Navigate, Outlet} from "react-router-dom";
import {useAppSelector} from "../../store/hooks";
import {RootState} from "../../store/store";
import SuspenseLoader from "../../components/SuspenseLoader";

interface PrivateRouteProps {
    children?: ReactNode;
}

const PrivateRoute = (props: PrivateRouteProps) => {
    const {children} = props;
    //const {userData} = useAppSelector((state: RootState) => state.user);
    const isAuthenticated = useAppSelector((state: RootState) => state.auth.hasJwtToken);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    /*if(!userData){
        return <SuspenseLoader/>;
    }*/

    return children ? <>{children}</> : <Outlet/>
};

export default PrivateRoute;