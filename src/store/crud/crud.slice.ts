import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the structure of entity state
interface EntityState {
    data: any[];
    total: number;
    page: number;
    limit: number;
    loading: boolean;
    error: string | null;
}

// Define the overall state structure
interface CrudState {
    selectedDatabaseId?: string; // Explicitly define this property
    entities: { [key: string]: EntityState }; // Store entities separately
}

// Define the initial state
const initialState: CrudState = {
    selectedDatabaseId: undefined,
    entities: {}
};

// Create the slice
const crudSlice = createSlice({
    name: 'crud',
    initialState,
    reducers: {
        setSelectedDatabase: (state, action: PayloadAction<string>) => {
            state.selectedDatabaseId = action.payload;
        },

        // Fetch Entities
        startFetchEntities: (state, action: PayloadAction<{ entity: string }>) => {
            const { entity } = action.payload;
            if (!state.entities[entity]) {
                state.entities[entity] = { data: [], total: 0, page: 1, limit: 10, loading: false, error: null };
            }
            state.entities[entity].loading = true;
            state.entities[entity].error = null;
        },
        fetchEntitiesSuccess: (
            state,
            action: PayloadAction<{ entity: string; data: any[]; total: number; page: number; limit: number }>
        ) => {
            const { entity, data, total, page, limit } = action.payload;
            state.entities[entity] = { data, total, page, limit, loading: false, error: null };
        },
        fetchEntitiesFailed: (state, action: PayloadAction<{ entity: string; error: string }>) => {
            const { entity, error } = action.payload;
            if (state.entities[entity]) {
                state.entities[entity].loading = false;
                state.entities[entity].error = error;
            }
        },

        // Create Entity
        startCreateEntity: (state, action: PayloadAction<{ entity: string }>) => {
            const { entity } = action.payload;
            if (!state.entities[entity]) {
                state.entities[entity] = { data: [], total: 0, page: 1, limit: 10, loading: false, error: null };
            }
            state.entities[entity].loading = true;
            state.entities[entity].error = null;
        },
        createEntitySuccess: (state, action: PayloadAction<{ entity: string; newItem: any }>) => {
            const { entity, newItem } = action.payload;
            if (state.entities[entity]) {
                state.entities[entity].data = [newItem, ...state.entities[entity].data]; // Add the new item at the beginning
                state.entities[entity].total += 1;
                state.entities[entity].loading = false;
            }
        },
        createEntityFailed: (state, action: PayloadAction<{ entity: string; error: string }>) => {
            const { entity, error } = action.payload;
            if (state.entities[entity]) {
                state.entities[entity].loading = false;
                state.entities[entity].error = error;
            }
        },

        // Delete Entity
        startDeleteEntity: (state, action: PayloadAction<{ entity: string }>) => {
            const { entity } = action.payload;
            if (state.entities[entity]) {
                state.entities[entity].loading = true;
                state.entities[entity].error = null;
            }
        },
        deleteEntitySuccess: (state, action: PayloadAction<{ entity: string; id: string }>) => {
            const { entity, id } = action.payload;
            if (state.entities[entity]) {
                state.entities[entity].data = state.entities[entity].data.filter((item) => item._id !== id);
                state.entities[entity].total -= 1;
                state.entities[entity].loading = false;
            }
        },
        deleteEntityFailed: (state, action: PayloadAction<{ entity: string; error: string }>) => {
            const { entity, error } = action.payload;
            if (state.entities[entity]) {
                state.entities[entity].loading = false;
                state.entities[entity].error = error;
            }
        },
    },
});

// Export actions
export const {
    setSelectedDatabase,
    startFetchEntities,
    fetchEntitiesSuccess,
    fetchEntitiesFailed,
    startCreateEntity,
    createEntitySuccess,
    createEntityFailed,
    startDeleteEntity,
    deleteEntitySuccess,
    deleteEntityFailed,
} = crudSlice.actions;

// Export reducer
export default crudSlice.reducer;
