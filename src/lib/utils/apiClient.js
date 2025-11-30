import axios from "axios";
import { getSession } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

apiClient.interceptors.request.use(async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

const _get = (url, config = {}) => {
    return apiClient.get(url, config);
}

const _delete = (url, config = {}) => {
    return apiClient.delete(url, config);
}

const _put = (url, data = {}, config = {}) => {
    return apiClient.put(url, data, config);
}

const _post = (url, data = {}, config = {}) => {
    return apiClient.post(url, data, config);
}

export { _get, _delete, _put, _post };