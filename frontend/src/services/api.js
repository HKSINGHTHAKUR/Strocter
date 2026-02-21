import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
