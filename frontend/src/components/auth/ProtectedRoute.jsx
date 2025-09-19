import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/authHelper";

export default function ProtectedRoute({ children, requiredRole }) {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = isAuthenticated();
    if (!auth) {
      navigate("/login", { replace: true });
      return;
    }

    if (requiredRole && auth.user.role !== requiredRole) {
      // redirect based on actual role
      navigate(
        auth.user.role === "admin"
          ? "/adminPanel"
          : auth.user.role === "expert"
          ? "/expertPanel"
          : "/clientPanel",
        { replace: true }
      );
    }
  }, [navigate, requiredRole]);

  const auth = isAuthenticated();
  if (auth && (!requiredRole || auth.user.role === requiredRole)) {
    return <>{children}</>;
  }

  return null; // while redirecting
}
