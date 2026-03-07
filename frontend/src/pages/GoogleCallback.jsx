import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      // Handle error from backend
      navigate(`/login?error=${error}`, { replace: true });
      return;
    }

    if (token) {
      // Login with the token received from Google OAuth
      login(token)
        .then(() => {
          // Redirect to dashboard or the intended page
          const redirect = searchParams.get("redirect") || "/dashboard";
          navigate(redirect, { replace: true });
        })
        .catch((err) => {
          console.error("Google callback login failed:", err);
          navigate("/login?error=auth_failed", { replace: true });
        });
    } else {
      // No token, redirect to login
      navigate("/login?error=invalid_request", { replace: true });
    }
  }, [navigate, searchParams, login]);

  return null; // This component doesn't render anything, it just handles the redirect
}