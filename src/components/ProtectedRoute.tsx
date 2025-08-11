import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/store/auth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  const location = useLocation();
  if (!isAdmin) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }
  return <>{children}</>;
}
