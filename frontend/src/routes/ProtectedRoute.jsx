import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ requirePremium = false }) => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div style={{
            minHeight: "100vh", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: "#0B0D10", gap: "16px",
        }}>
            <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                border: "3px solid rgba(255,106,0,0.15)",
                borderTopColor: "#FF6A00",
                animation: "spin 0.8s linear infinite",
            }} />
            <span style={{ fontSize: "13px", color: "rgba(160,163,177,0.6)", letterSpacing: "0.05em" }}>
                Verifying session…
            </span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (!user) return <Navigate to="/login" replace />;

    if (requirePremium && user.subscription !== "premium") {
        return <Navigate to="/pricing" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
