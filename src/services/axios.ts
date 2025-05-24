import axios, { AxiosInstance } from "axios";
import config from "../config/config";
import { AuthApi, UsersApi, QueriesApi, DatabaseApi } from "./backend";
import { getTokenFromLocalStorage } from "../utils/token";

const baseUrl = config.apiUrl;

const axiosInstance: AxiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Cache-Control': 'no-cache'
    }
});


axiosInstance.interceptors.request.use((config) => {
    const token = getTokenFromLocalStorage();

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

const apis = {
    authApi: new AuthApi(undefined, baseUrl, axiosInstance),
    userApi: new UsersApi(undefined, baseUrl, axiosInstance),
    queryApi: new QueriesApi(undefined, baseUrl, axiosInstance),
    databaseApi: new DatabaseApi(undefined, baseUrl, axiosInstance),
};

export default apis;