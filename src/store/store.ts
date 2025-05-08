import { configureStore } from '@reduxjs/toolkit';
import crudReducer from './crud/crud.slice';
import themeReducer from './theme/theme.slice';
import authReducer from './auth/auth.slice';
import userReducer from './user/user.slice';

const store = configureStore({
    reducer: {
        theme: themeReducer,
        auth: authReducer,
        user: userReducer,
        crud: crudReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
