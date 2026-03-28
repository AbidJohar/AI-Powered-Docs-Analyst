// PublicRoute.tsx — redirect to app if already authenticated
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return (
        <div className="flex h-screen items-center justify-center bg-[#08060d]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-500" />
        </div>
    );

    return isAuthenticated ? <Navigate to="/chat-panel" replace /> : <Outlet />;
};

export default PublicRoute;