import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={handleLogin}
                className="bg-card-bg rounded-xl p-8 w-full max-w-sm"
            >
                <h1 className="text-2xl font-bold mb-6">Login</h1>

                {error && (
                    <p className="text-red-400 text-sm mb-4">{error}</p>
                )}

                <label className="block text-zinc-400 text-sm mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-bg-primary border border-zinc-700 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:border-accent"
                />

                <label className="block text-zinc-400 text-sm mb-1">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-bg-primary border border-zinc-700 rounded-lg px-3 py-2 mb-6 focus:outline-none focus:border-accent"
                />

                <button
                    type="submit"
                    className="w-full bg-accent text-white font-semibold rounded-xl py-2 hover:opacity-90 cursor-pointer"
                >
                    Sign In
                </button>
            </form>
        </div>
    );
}
