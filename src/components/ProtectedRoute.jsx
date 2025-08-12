import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/store/auth";

export default function ProtectedRoute({ children }) {
  const { isAdmin } = useAuth();
  const location = useLocation();
  if (!isAdmin) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}

