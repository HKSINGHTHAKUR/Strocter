import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser]               = useState(null);
    const [token, setToken]             = useState(() => localStorage.getItem("token"));
    const [loading, setLoading]         = useState(true);

    /* ── On app boot: validate any stored token ─────────────────── */
    useEffect(() => {
        const bootstrap = async () => {
            const storedToken = localStorage.getItem("token");
            if (!storedToken) {
                setLoading(false);
                return;
            }

            try {
                const { data } = await api.get("/auth/me");
                setUser(data.user || data);
                setToken(storedToken);
            } catch (err) {
                console.error("Session restore failed:", err.message);
                // Token expired / invalid — clear everything
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
                setToken(null);
            } finally {
                setLoading(false);
            }
        };

        bootstrap();
    }, []);

    /* ── login: called with the raw JWT token from the API ──────── */
    const login = async (rawToken) => {
        localStorage.setItem("token", rawToken);
        setToken(rawToken);

        try {
            const { data } = await api.get("/auth/me");
            setUser(data.user || data);
        } catch (err) {
            // Something went wrong fetching the profile — roll back
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
            throw err;
        }
    };

    /* ── logout ─────────────────────────────────────────────────── */
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
    };

    const isAuthenticated = !!token && !!user;

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
};
