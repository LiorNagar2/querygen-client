import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {User} from "../../services/backend/models";

interface UserState {
    loading: boolean;
    userData: User | null; // TODO: Add type from swagger,
    errors: string[];
}

// Define the initial state using that type
const initialState: UserState = {
    loading: false,
    userData: null,
    errors: [],
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        getUserDataStart: (state: UserState) => {
            state.loading = true;
        },
        getUserDataSuccess: (state: UserState, action: PayloadAction<User>) => {
            state.loading = false;
            state.userData = action.payload;
        },
        getUserDataFailed: (state: UserState, action: PayloadAction<any>) => {
            state.loading = false;
        },

        reset: (state: UserState) => {
            state.loading = false;
            state.userData = null;
            state.errors = [];
        }
    }
});
export const {getUserDataStart, getUserDataSuccess, getUserDataFailed} = userSlice.actions;
export default userSlice.reducer;