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
    createEntityFailed
} from './crud.slice';

// Fetch entities
export const fetchEntities = (entity: string, page = 1, limit = 10) => async (dispatch: AppDispatch) => {
    dispatch(startFetchEntities({ entity }));
    try {
        const response = await axios.get(`http://localhost:3001/${entity}?page=${page}&limit=${limit}`);
        dispatch(fetchEntitiesSuccess({ entity, data: response.data.data, total: response.data.total, page, limit }));
    } catch (error) {
        dispatch(fetchEntitiesFailed({ entity, error: (error as Error).message || 'Failed to fetch data' }));
    }
};

export const createEntity = (entity: string, newItem: any) => async (dispatch: AppDispatch) => {
    dispatch(startCreateEntity({ entity }));
    try {
        const response = await axios.post(`http://localhost:3001/${entity}`, newItem);
        const data = await response.data;
        dispatch(createEntitySuccess({ entity, newItem: data }));
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
        //alert(response.data.message);
        console.log(response.data.message);
    } catch (e: any) {
        alert(e.data.message);
    }
};
