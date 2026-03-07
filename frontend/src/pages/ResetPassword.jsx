import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Loader2, CheckCircle } from "lucide-react";
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

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "At least 6 characters";
    if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid reset link");
      return;
    }
    const errs = validate();
    if (Object.keys(errs).length) {
      setError(errs.password || errs.confirmPassword || "");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      await api.post("/auth/reset-password", { token, password });
      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. Please try again.");
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
              Reset Password
            </h2>
            <p style={{ fontSize: "13px", color: "rgba(160,163,177,0.8)" }}>
              Enter a new password for your account
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
              <p>Password reset successful</p>
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
                label="New Password"
                icon={Lock}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error}
              />
              <InputField
                label="Confirm Password"
                icon={Lock}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  "Reset Password"
                )}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}