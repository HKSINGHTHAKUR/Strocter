import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/common/Logo";

export default function Login() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    // Auth Mode: "signin" or "signup"
    const mode = searchParams.get("mode") || "signin";
    const isSignUp = mode === "signup";

    // Form State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // UI State
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Clear errors when mode switches
    useEffect(() => {
        setError("");
    }, [mode]);

    const handleToggleMode = () => {
        setSearchParams({ mode: isSignUp ? "signin" : "signup" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const endpoint = isSignUp ? "/auth/register" : "/auth/login";
            const payload = isSignUp ? { name, email, password } : { email, password };

            const res = await api.post(endpoint, payload);

            // Expected response: { success: true, token: "..." }
            if (res.data && res.data.token) {
                // We use the context login method to hydrate user state globally
                await login(res.data.token);

                // Support redirect param
                const redirectPath = searchParams.get("redirect") || "/dashboard";
                navigate(redirectPath, { replace: true });
            } else {
                setError("Invalid response from server");
            }
        } catch (err) {
            console.error("Auth Error details:", err);
            if (!err.response) {
                setError(`Network Error: ${err.message}. Can't reach the server.`);
            } else {
                setError(err.response?.data?.message || `${isSignUp ? "Registration" : "Login"} failed`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative bg-background overflow-hidden relative">
            {/* Ambient Background glow for luxury feel */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md p-8 md:p-12 glass-panel-elevated rounded-3xl"
            >
                <div className="flex flex-col items-center mb-8">
                    <Logo />
                    <h1 className="text-2xl font-light mt-6 text-foreground">
                        {isSignUp ? "Create Account" : "Welcome Back"}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        {isSignUp ? "Join the next generation of financial intelligence" : "Access your behavioral capital dashboard"}
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-6 text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <AnimatePresence mode="popLayout">
                        {isSignUp && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col gap-1.5"
                            >
                                <label className="text-xs tracking-wide text-muted-foreground uppercase">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required={isSignUp}
                                    className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                                    placeholder="John Doe"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs tracking-wide text-muted-foreground uppercase">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 mb-2">
                        <label className="text-xs tracking-wide text-muted-foreground uppercase">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3.5 rounded-xl font-medium tracking-wide text-sm transition-all duration-300 mt-2 flex items-center justify-center ${isSignUp
                                ? 'bg-accent-orange text-white hover:opacity-90 shadow-[0_0_20px_-5px_var(--color-accent-orange)]'
                                : 'bg-primary text-primary-foreground hover:shadow-[0_0_30px_-5px_color-mix(in_srgb,var(--color-primary)_50%,transparent)]'
                            } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            isSignUp ? "Sign Up" : "Sign In"
                        )}
                    </button>

                    <div className="text-center mt-6">
                        <button
                            type="button"
                            onClick={handleToggleMode}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
