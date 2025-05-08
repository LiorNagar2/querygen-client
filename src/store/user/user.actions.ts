import {getUserDataStart, getUserDataSuccess,getUserDataFailed} from './user.slice';
import {AppDispatch} from "../store";
import apis from "../../services/axios";

export const user_getUserData = () => async (dispatch: AppDispatch) => {
    try {
        dispatch(getUserDataStart());
        const res = await apis.userApi.usersControllerGetProfile();
        if (res.data) {
            dispatch(getUserDataSuccess(res.data));

        } else {
            getUserDataFailed({});
        }

    } catch (e) {
        getUserDataFailed({});
    }
};