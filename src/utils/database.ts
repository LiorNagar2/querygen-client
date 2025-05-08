
const selectedDatabaseKey = 'selectedDatabaseId';

export const setSelectedDatabaseLocalStorage = (dbId: string) => {
    localStorage.setItem(selectedDatabaseKey, dbId);
};

export const getSelectedDatabaseLocalStorage = () => {
    return localStorage.getItem(selectedDatabaseKey);
};
