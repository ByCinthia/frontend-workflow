import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "./context";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useUser();
  const loc = useLocation();
  if (!token) return <Navigate to="/login" state={{ from: loc }} replace />;
  return <>{children}</>;
}
