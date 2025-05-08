import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Select the entire entity state
export const selectEntityState = (state: RootState, entity: string) => state.crud.entities[entity] || false;

// Select loading state
export const selectEntityLoading = (state: RootState, entity: string) =>
    selectEntityState(state, entity)?.loading ?? false;

// Select error state
export const selectEntityError = (state: RootState, entity: string) =>
    selectEntityState(state, entity)?.error ?? null;

// Select entity data
export const selectEntityData = (state: RootState, entity: string) =>
    selectEntityState(state, entity)?.data ?? [];

// Select entity pagination info
export const selectEntityPagination = (state: RootState, entity: string) => ({
    total: selectEntityState(state, entity)?.total ?? 0,
    page: selectEntityState(state, entity)?.page ?? 1,
    limit: selectEntityState(state, entity)?.limit ?? 10,
});

// Select the currently selected database
export const selectSelectedDatabaseId = (state: RootState): string => state.crud.selectedDatabaseId || '';

export const selectDatabases = (state: RootState) => state.crud.entities['database'] || [];

export const selectSelectedDatabase = (state: RootState) => {
    return state.crud.entities['database']?.data.find((db) => db._id == state.crud?.selectedDatabaseId);
};
