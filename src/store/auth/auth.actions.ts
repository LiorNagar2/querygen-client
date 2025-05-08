import {AppDispatch} from "../store";
import {LoginRequest, RegisterDto, SocialLoginRequest} from "../../services/backend/models";
import apis from "../../services/axios";
import {saveTokenToLocalStorage} from "../../utils/token";
import {loginStart, loginSuccess, loginFailed} from './auth.slice';
import {AxiosError} from "axios";


export const auth_login = (req: LoginRequest) => async (dispatch: AppDispatch) => {
    try {
        dispatch(loginStart());
        const res = (await apis.authApi.authControllerLogin(req))?.data;
        if (res.access_token) {
            saveTokenToLocalStorage(res.access_token);
            dispatch(loginSuccess());
        }
    } catch (e) {

        dispatch(loginFailed(["Invalid email or password"]));
    }
};

export const auth = (type: 'login' | 'register' | 'social', req: LoginRequest | RegisterDto | SocialLoginRequest) => async (dispatch: AppDispatch) => {
    try {
        dispatch(loginStart());

        let res = undefined;
        switch (type) {
            case "login":
                res = (await apis.authApi.authControllerLogin(req as LoginRequest))?.data;
                break;
            case "register":
                res = (await apis.authApi.authControllerRegister(req as RegisterDto))?.data;
                break;
            case "social":
                res = (await apis.authApi.authControllerSocialLogin(req as SocialLoginRequest))?.data;
                break;
        }

        //const res = (await apis.authApi.authControllerRegister(req))?.data;
        if (res && res?.access_token) {
            saveTokenToLocalStorage(res.access_token);
            dispatch(loginSuccess());
        }
    } catch (e: AxiosError | any) {
        dispatch(loginFailed([e?.response?.data?.message || "Something went wrong"]));
    }
};