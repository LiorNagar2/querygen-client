import axios from 'axios';
import { AppDispatch } from '../store';
import {
    startFetchEntities,
    fetchEntitiesSuccess,
    fetchEntitiesFailed,
    startDeleteEntity,
    deleteEntitySuccess,
    deleteEntityFailed,
    startCreateEntity,
    createEntitySuccess,
    createEntityFailed,
    startUpdateEntity,
    updateEntitySuccess,
    setSelectedDatabaseSchema,
} from './crud.slice';

// Fetch entities
export const fetchEntities = (entity: string, url?: string, page = 1, limit = 0,) => async (dispatch: AppDispatch) => {
    dispatch(startFetchEntities({ entity }));
    try {
        const response = await axios.get(`http://localhost:3001/${url || entity}?page=${page}&limit=${limit}`);
        dispatch(fetchEntitiesSuccess({ entity, data: response.data.data, total: response.data.total, page, limit }));
    } catch (error) {
        dispatch(fetchEntitiesFailed({ entity, error: (error as Error).message || 'Failed to fetch data' }));
    }
};

export const createEntity = (entity: string, newItem: any, url?: string) => async (dispatch: AppDispatch) => {
    dispatch(startCreateEntity({ entity }));
    try {
        const response = await axios.post(`http://localhost:3001/${url || entity}`, newItem);
        const data = await response.data;
        dispatch(createEntitySuccess({ entity, newItem: data }));
    } catch (error) {
        dispatch(createEntityFailed({ entity, error: (error as Error).message }));
    }
};

export const updateEntity = (entity: string, id: string, updatedItem: any, url?: string) => async (dispatch: AppDispatch) => {
    dispatch(startUpdateEntity({ entity })); // You might want to create a `startUpdateEntity` if desired
    try {
        const response = await axios.patch(`http://localhost:3001/${url || entity}/${id}`, updatedItem);
        const data = await response?.data;
        dispatch(updateEntitySuccess({ entity, updatedItem: data })); // Can use a separate action like `updateEntitySuccess` if needed
    } catch (error) {
        dispatch(createEntityFailed({ entity, error: (error as Error).message }));
    }
};

// Delete entity
export const deleteEntity = (entity: string, id: string) => async (dispatch: AppDispatch) => {
    dispatch(startDeleteEntity({ entity }));
    try {
        await axios.delete(`http://localhost:3001/${entity}/${id}`);
        dispatch(deleteEntitySuccess({ entity, id }));
    } catch (error) {
        dispatch(deleteEntityFailed({ entity, error: (error as Error).message || 'Failed to delete item' }));
    }
};

export const connectToDatabase = (id: string) => async (dispatch: AppDispatch) => {
    console.log(`Connect to database ${id} ...`);
    try {
        const response = await axios.post(`http://localhost:3001/database/${id}/connect`);
        dispatch(setSelectedDatabaseSchema(response.data.schema));
        console.log(response.data);
    } catch (e: any) {
        alert(e.data.message);
    }
};
