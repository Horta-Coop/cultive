import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import LoadingSpinner from "../components/LoadingSpinner";
import DashboardLayout from "./DashboardLayout";

const HomePage = lazy(() => import("../pages/HomePage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const SignupPage = lazy(() => import("../pages/SignupPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const HortasPage = lazy(() => import("../pages/GardenPage"));
const PlantingsPage = lazy(() => import("../pages/PlantingsPage"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/hortas" element={<HortasPage />} />
            <Route path="/plantios" element={<PlantingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<div>404 - Não encontrado</div>} />
      </Routes>
    </Suspense>
  );
}
