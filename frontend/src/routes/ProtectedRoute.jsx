import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ requirePremium = false }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) return <Navigate to="/login" replace />;

    if (requirePremium && user.subscription !== "premium") {
        return <Navigate to="/pricing" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
