import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import LoadingSpinner from "../components/LoadingSpinner";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthLoading } = useUserStore();

  if (isAuthLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // redireciona para página 403 Forbidden
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;