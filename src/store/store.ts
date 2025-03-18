import { configureStore } from '@reduxjs/toolkit';
import crudReducer from './crud/crud.slice';
import themeReducer from './theme/theme.slice';

const store = configureStore({
    reducer: {
        theme: themeReducer,
        crud: crudReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
