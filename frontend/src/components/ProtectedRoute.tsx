import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-[#08060d]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-500" />
    </div>
  );

  return isAuthenticated ? <Outlet /> : <Navigate to="/google-login" replace />;
};

export default ProtectedRoute;