import axios from "axios";

// Base URL: VITE_API_URL must NOT include /api suffix — it is appended here.
// Local:  http://127.0.0.1:5000/api
// Prod:   https://your-backend.onrender.com/api
const BASE = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, "")}/api`
    : "http://127.0.0.1:5000/api";

const api = axios.create({
    baseURL: BASE,
    timeout: 15000,
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Global 401 handler — clear token and redirect to login on expired/invalid session
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Only redirect if not already on login/register pages
            const path = window.location.pathname;
            if (path !== "/login" && path !== "/register") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
