import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getTokenFromLocalStorage} from "../../utils/token";

interface AuthState {
    hasJwtToken: boolean;
    loading: boolean;
    errors: string[];
}

const initialState: AuthState = {
    hasJwtToken: !!getTokenFromLocalStorage() ,
    loading: false,
    errors: []
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state: AuthState) => {
            state.loading = true;
        },
        loginSuccess: (state: AuthState) => {
            state.loading = false;
            state.hasJwtToken = true;
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        loginFailed: (state: AuthState, action: PayloadAction<any>) => {
            state.loading = false;
            state.errors = action.payload;
        },
        logout: (state: AuthState) => {
            state.loading = false;
            state.hasJwtToken = false;
            state.errors = [];
        },
    }
});

export const {loginStart, loginSuccess, loginFailed, logout} = authSlice.actions;
export default authSlice.reducer;