import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import api from "../services/api";

/* ─── Input field with floating label ────────────────────────── */
const InputField = ({ label, icon, type = "text", value, onChange, error }) => {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value !== "";

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          borderRadius: "12px",
          border: `1px solid ${error ? "rgba(239,68,68,0.5)" : focused ? "rgba(255,106,0,0.5)" : "rgba(255,255,255,0.1)"}`,
          background: "rgba(255,255,255,0.04)",
          transition: "all 0.25s ease",
          boxShadow: focused ? "0 0 0 2px rgba(255,106,0,0.2)" : "none",
        }}
      >
        {icon && (
          <icon
            size={16}
            style={{
              position: "absolute",
              left: "14px",
              color: focused ? "#FF6A00" : "rgba(160,163,177,0.7)",
              transition: "color 0.2s ease",
              flexShrink: 0,
            }}
          />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder=""
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            padding: `${isActive ? "20px 14px 8px" : "14px"} 14px`,
            paddingLeft: icon ? "40px" : "14px",
            fontSize: "14px",
            color: "#e8eaf0",
            transition: "padding 0.2s ease",
          }}
        />
        <label
          style={{
            position: "absolute",
            left: icon ? "40px" : "14px",
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
      </div>
      {error && (
        <p style={{ marginTop: "5px", fontSize: "11px", color: "rgba(239,68,68,0.9)", paddingLeft: "4px" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setError(errs.email || "");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setSuccess(true);
      setEmail("");
    } catch (err) {
      // For security, we still show success message even if backend fails (to avoid email enumeration)
      setSuccess(true);
      setEmail("");
    } finally {
      setIsLoading(false);
    }
  };

  /* gradient: orange → purple matching Strocter brand */
  const brandGradient = "linear-gradient(135deg, #FF6A00 0%, #6E33B1 100%)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0B0D10",
        overflow: "hidden",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "440px" }}>
        {/* Mobile brand */}
        <motion.div style={{ marginBottom: "28px" }}>
          <span
            style={{
              background: brandGradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            Strocter
          </span>
        </motion.div>

        {/* Glass card form */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{
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
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: "#e8eaf0",
                marginBottom: "4px",
              }}
            >
              Forgot Password
            </h2>
            <p style={{ fontSize: "13px", color: "rgba(160,163,177,0.8)" }}>
              Enter your email address to receive a password reset link
            </p>
          </div>

          {/* Success message */}
          {success && (
            <div
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.2)",
                color: "#4ade80",
                fontSize: "13px",
                padding: "10px 14px",
                borderRadius: "10px",
                marginBottom: "20px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <CheckCircle size={20} style={{ color: "#4ade80" }} />
              <p>If an account with that email exists, we have sent a reset link</p>
              <motion.button
                onClick={() => navigate("/login")}
                whileTap={{ scale: 0.97 }}
                style={{
                  marginTop: "8px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: brandGradient,
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Go to Login
              </motion.button>
            </div>
          )}

          {/* Form */}
          {!success && (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <InputField
                label="Email address"
                icon={Mail}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
              />

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
                  "Send Reset Link"
                )}
              </motion.button>

              {/* Divider */}
              <div style={{ position: "relative", margin: "8px 0" }}>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", width: "100%" }} />
                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "#0F1118",
                    padding: "0 12px",
                    fontSize: "12px",
                    color: "rgba(160,163,177,0.6)",
                  }}
                >
                  or
                </span>
              </div>

              {/* Back to login */}
              <motion.button
                type="button"
                onClick={() => navigate("/login")}
                whileTap={{ scale: 0.97 }}
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
                Back to Login
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}