import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Loader2, Eye, EyeOff } from "lucide-react";
import api, { API_BASE } from "../services/api";
import { useAuth } from "../context/AuthContext";

/* ─── Floating decorative shapes ──────────────────────────────── */
const FloatingShape = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-2xl border pointer-events-none ${className}`}
    style={{
      borderColor: "rgba(255,106,0,0.12)",
      background: "rgba(255,106,0,0.04)",
    }}
    animate={{ y: [0, -18, 0], rotate: [0, 4, 0] }}
    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay }}
  />
);

/* ─── Live insight card (left panel) ──────────────────────────── */
const InsightCard = () => (
  <motion.div
    style={{
      background: "rgba(255,255,255,0.04)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "16px",
      padding: "20px",
      maxWidth: "280px",
    }}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
      <div
        style={{
          width: "8px", height: "8px", borderRadius: "50%",
          background: "#4ade80",
          animation: "loginGlowPulse 4s ease-in-out infinite",
        }}
      />
      <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(160,163,177,0.9)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        Live Insight
      </span>
    </div>
    <p style={{ fontSize: "13px", color: "rgba(210,214,225,0.85)", lineHeight: 1.6 }}>
      Your spending impulse score dropped{" "}
      <span style={{ color: "#FF6A00", fontWeight: 700 }}>12%</span> this week.
      Pattern: evening purchases reduced.
    </p>
    <div style={{ marginTop: "12px", display: "flex", gap: "4px", alignItems: "flex-end" }}>
      {[40, 28, 55, 35, 48, 30, 22].map((h, i) => (
        <div
          key={i}
          style={{
            width: "18px", borderRadius: "3px",
            background: "rgba(255,106,0,0.25)",
            height: `${h}px`,
          }}
        />
      ))}
    </div>
  </motion.div>
);

/* ─── Input field with floating label ────────────────────────── */
const InputField = ({ label, icon: Icon, type = "text", value, onChange, error, autoComplete }) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isActive = focused || value !== "";
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "relative", display: "flex", alignItems: "center",
          borderRadius: "12px",
          border: `1px solid ${error ? "rgba(239,68,68,0.5)" : focused ? "rgba(255,106,0,0.5)" : "rgba(255,255,255,0.1)"}`,
          background: "rgba(255,255,255,0.04)",
          transition: "all 0.25s ease",
          boxShadow: focused ? "0 0 0 2px rgba(255,106,0,0.2)" : "none",
        }}
      >
        {Icon && (
          <Icon
            size={16}
            style={{
              position: "absolute", left: "14px",
              color: focused ? "#FF6A00" : "rgba(160,163,177,0.7)",
              transition: "color 0.2s ease",
              flexShrink: 0,
            }}
          />
        )}
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder=""
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            padding: `${isActive ? "20px 14px 8px" : "14px"} 14px`,
            paddingLeft: Icon ? "40px" : "14px",
            paddingRight: isPassword ? "44px" : "14px",
            fontSize: "14px",
            color: "#e8eaf0",
            transition: "padding 0.2s ease",
          }}
        />
        <label
          style={{
            position: "absolute",
            left: Icon ? "40px" : "14px",
            top: isActive ? "6px" : "50%",
            transform: isActive ? "none" : "translateY(-50%)",
            fontSize: isActive ? "10px" : "14px",
            fontWeight: isActive ? 600 : 400,
            color: isActive ? "#FF6A00" : "rgba(160,163,177,0.7)",
            transition: "all 0.2s ease",
            pointerEvents: "none",
          }}
        >
          {label}
        </label>
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            style={{
              position: "absolute", right: "12px",
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(160,163,177,0.7)", padding: "4px",
              display: "flex", alignItems: "center",
            }}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && (
        <p style={{ marginTop: "5px", fontSize: "11px", color: "rgba(239,68,68,0.9)", paddingLeft: "4px" }}>
          {error}
        </p>
      )}
    </div>
  );
};

/* ─── Main Login Component ────────────────────────────────────── */
export default function Login() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const mode = searchParams.get("mode") || "signin";
  const isSignUp = mode === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setError("");
    setFieldErrors({});
  }, [mode]);

  useEffect(() => {
    const handle = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 12,
        y: (e.clientY / window.innerHeight - 0.5) * 12,
      });
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  const handleToggleMode = () => {
    setSearchParams({ mode: isSignUp ? "signin" : "signup" });
  };

  const validate = () => {
    const errs = {};
    if (isSignUp && !name.trim()) errs.name = "Full name is required";
    if (!email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "At least 6 characters";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setFieldErrors({});
    setError("");
    setIsLoading(true);

    try {
      const endpoint = isSignUp ? "/auth/register" : "/auth/login";
      const payload = isSignUp ? { name, email, password } : { email, password };
      const res = await api.post(endpoint, payload);

      if (isSignUp) {
        // Registration success (backend does not return token here)
        if (res.data && res.data.success) {
          setError(""); // clear generic error
          setPassword(""); // clear password for security
          setSearchParams({ mode: "signin" }); // switch to signin mode
          // Show a temporary success message in the error box (hacky but works for now as a notification)
          // A proper toast would be better, but we use what we have in the UI state
          alert("Account created successfully! Please sign in.");
        } else {
          setError("Unexpected response from server during registration");
        }
      } else {
        // Login success
        if (res.data && res.data.token) {
          await login(res.data.token);
          const redirectPath = searchParams.get("redirect") || "/dashboard";
          navigate(redirectPath, { replace: true });
        } else {
          setError("Unexpected response from server during login");
        }
      }
    } catch (err) {
      console.error("Auth Error:", err);
      if (!err.response) {
        setError(`Network error: ${err.message}`);
      } else {
        setError(err.response?.data?.message || `${isSignUp ? "Registration" : "Login"} failed`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* gradient: orange → purple matching Strocter brand */
  const brandGradient = "linear-gradient(135deg, #FF6A00 0%, #6E33B1 100%)";

  return (
    <>
      {/* Inject keyframes once */}
      <style>{`
        @keyframes loginGlowPulse {
          0%, 100% { opacity: 0.5; box-shadow: 0 0 0 0 rgba(74,222,128,0); }
          50% { opacity: 1; box-shadow: 0 0 8px 3px rgba(74,222,128,0.35); }
        }
        @keyframes loginShake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", background: "#0B0D10", overflow: "hidden", position: "relative" }}>

        {/* ── LEFT PANEL (desktop only) ─────────────────── */}
        <div
          style={{
            display: "none",
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
          className="login-left-panel"
        >
          {/* Animated gradient background */}
          <div style={{ position: "absolute", inset: 0 }}>
            <div
              style={{
                position: "absolute", inset: 0, opacity: 0.65,
                background: "radial-gradient(ellipse at 30% 50%, rgba(255,106,0,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(110,51,177,0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(255,106,0,0.08) 0%, transparent 50%)",
              }}
            />
            <motion.div
              style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(circle at 40% 40%, rgba(110,51,177,0.08) 0%, transparent 40%)",
              }}
              animate={{ x: mouse.x, y: mouse.y }}
              transition={{ type: "spring", stiffness: 50, damping: 30 }}
            />
          </div>

          {/* Floating shapes */}
          <FloatingShape className="h-32 w-32 top-[15%] left-[10%] rotate-12" style={{ width: "128px", height: "128px", top: "15%", left: "10%", transform: "rotate(12deg)" }} delay={0} />
          <FloatingShape className="h-20 w-20 top-[60%] left-[15%] -rotate-6" style={{ width: "80px", height: "80px", top: "60%", left: "15%" }} delay={2} />
          <FloatingShape className="h-24 w-24 top-[25%] right-[12%] rotate-45" style={{ width: "96px", height: "96px", top: "25%", right: "12%", transform: "rotate(45deg)" }} delay={1} />
          <FloatingShape className="h-16 w-16 bottom-[20%] right-[20%] rotate-12" style={{ width: "64px", height: "64px", bottom: "20%", right: "20%" }} delay={3} />

          {/* Text content */}
          <div style={{ position: "relative", zIndex: 10, padding: "0 48px", maxWidth: "440px" }}>
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div style={{ marginBottom: "20px" }}>
                <span style={{
                  background: brandGradient,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
                }}>
                  Strocter
                </span>
              </div>
              <h1 style={{ fontSize: "40px", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#e8eaf0", marginBottom: "16px" }}>
                Understand Your
                <br />
                <span style={{
                  background: brandGradient,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  Money Mind.
                </span>
              </h1>
              <p style={{ fontSize: "15px", color: "rgba(160,163,177,0.85)", lineHeight: 1.7, maxWidth: "320px" }}>
                Track behavior. Decode impulses. Build financial discipline.
              </p>
            </motion.div>

            <div style={{ marginTop: "48px" }}>
              <InsightCard />
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL (form) ────────────────────────── */}
        <div style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
          className="login-right-panel"
        >
          <div style={{ width: "100%", maxWidth: "440px" }}>

            {/* Mobile brand */}
            <motion.div
              style={{ marginBottom: "28px" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="login-mobile-brand"
            >
              <span style={{
                background: brandGradient,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: "18px", fontWeight: 700, letterSpacing: "0.05em",
              }}>
                Strocter
              </span>
            </motion.div>

            {/* Glass card form */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              style={{
                animation: shake ? "loginShake 0.5s ease-in-out" : undefined,
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "36px",
                boxShadow: "0 0 60px rgba(255,106,0,0.06)",
              }}
            >
              {/* Header */}
              <div style={{ marginBottom: "28px" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h2 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.01em", color: "#e8eaf0", marginBottom: "4px" }}>
                      {isSignUp ? "Create Account" : "Welcome back"}
                    </h2>
                    <p style={{ fontSize: "13px", color: "rgba(160,163,177,0.8)" }}>
                      {isSignUp
                        ? "Join the next generation of financial intelligence"
                        : "Sign in to your Strocter account"}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Global error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      color: "rgba(239,68,68,0.9)",
                      fontSize: "13px",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      marginBottom: "20px",
                      textAlign: "center",
                    }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

                {/* Name field (sign-up only) */}
                <AnimatePresence mode="popLayout">
                  {isSignUp && (
                    <motion.div
                      key="name-field"
                      initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                      animate={{ opacity: 1, height: "auto", overflow: "visible" }}
                      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                      transition={{ duration: 0.3 }}
                    >
                      <InputField
                        label="Full Name"
                        icon={User}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={fieldErrors.name}
                        autoComplete="name"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <InputField
                  label="Email address"
                  icon={Mail}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={fieldErrors.email}
                  autoComplete="email"
                />

                <InputField
                  label="Password"
                  icon={Lock}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={fieldErrors.password}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                />

                {/* Remember me + Forgot password */}
                {!isSignUp && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "13px", marginTop: "2px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "rgba(160,163,177,0.85)" }}>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ accentColor: "#FF6A00", width: "14px", height: "14px", borderRadius: "3px" }}
                      />
                      Remember me
                    </label>
                    <button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#FF6A00", fontSize: "13px" }}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    marginTop: "6px",
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "none",
                    background: isLoading ? "rgba(255,106,0,0.4)" : brandGradient,
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: isLoading ? "none" : "0 0 24px rgba(255,106,0,0.25)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) e.currentTarget.style.boxShadow = "0 0 40px rgba(255,106,0,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = isLoading ? "none" : "0 0 24px rgba(255,106,0,0.25)";
                  }}
                >
                  {isLoading ? (
                    <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                  ) : (
                    isSignUp ? "Create Account" : "Sign In Securely"
                  )}
                </motion.button>

                {/* Divider */}
                <div style={{ position: "relative", margin: "8px 0" }}>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", width: "100%" }} />
                  <span style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "#0F1118", padding: "0 12px",
                    fontSize: "12px", color: "rgba(160,163,177,0.6)",
                  }}>
                    or
                  </span>
                </div>

                {/* Google */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    window.location.href = `${API_BASE}/auth/google`;
                  }}
                  style={{
                    width: "100%",
                    padding: "13px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#e8eaf0",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </motion.button>
              </form>

              {/* Toggle mode */}
              <p style={{ marginTop: "24px", textAlign: "center", fontSize: "13px", color: "rgba(160,163,177,0.75)" }}>
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={handleToggleMode}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "#FF6A00", fontWeight: 600, fontSize: "13px",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
                >
                  {isSignUp ? "Sign In" : "Create one"}
                </button>
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (min-width: 1024px) {
          .login-left-panel { display: flex !important; width: 50%; }
          .login-right-panel { width: 50% !important; }
          .login-mobile-brand { display: none !important; }
        }
      `}</style>
    </>
  );
}
