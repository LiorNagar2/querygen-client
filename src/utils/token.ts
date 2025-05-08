
const tokenKey = 'apiKey';

export const saveTokenToLocalStorage: (token: string) => void = (
    token: string
) => {
    localStorage.setItem(tokenKey, token);
};

export const getTokenFromLocalStorage: () => string | undefined = () => {
    return localStorage.getItem(tokenKey) || undefined;
};

export const deleteTokenFromLocalStorage: () => void = () => {
    localStorage.removeItem(tokenKey);
};