import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";

const PublicRoute = () => {
  const { user, checkinAuth } = useUserStore();

  if (checkinAuth) return <LoadingSpinner />;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default PublicRoute;