import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const { data } = await api.get("/auth/me");
                setUser(data.user || data);
            } catch (error) {
                console.error("Auth fetch failed:", error);
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (token) => {
        localStorage.setItem("token", token);
        try {
            const { data } = await api.get("/auth/me");
            setUser(data.user || data);
        } catch (error) {
            console.error("Login session fetch failed:", error);
            localStorage.removeItem("token");
            setUser(null);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
