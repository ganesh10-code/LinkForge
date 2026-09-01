import axios from "axios";

const getBaseUrl = () => {
    if (import.meta.env.VITE_BACKEND_URL) {
        return import.meta.env.VITE_BACKEND_URL;
    }
    return ''; // relative path defaults to current origin (handled by vite proxy or nginx)
};

const api = axios.create({
    baseURL: getBaseUrl(),
});

export default api;