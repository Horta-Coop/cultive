import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import LoadingSpinner from "../components/LoadingSpinner";
import Header from "../components/Header";

const PublicRoute = () => {
  const { user, checkinAuth } = useUserStore();

  if (checkinAuth) return <LoadingSpinner />;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default PublicRoute;