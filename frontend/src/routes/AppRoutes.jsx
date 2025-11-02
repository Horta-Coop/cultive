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
const FamiliesPage = lazy(() => import("../pages/FamiliasPage"));
const UsuariosPage = lazy(() => import("../pages/UsuariosPage"));
const ComunicacaoPage = lazy(() => import("../pages/ComunicacaoPage"));
const ColheitasPage = lazy(() => import("../pages/ColheitasPage"));
const HelpPage = lazy(() => import("../pages/HelpPage"));
const NotificationsPage = lazy(() => import("../pages/NotificationPage"));
const PerfilPage = lazy(() => import("../pages/ProfilePage"));

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
            <Route path="/colheitas" element={<ColheitasPage />} />
            <Route path="/familias" element={<FamiliesPage />} />
            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/comunicacao" element={<ComunicacaoPage />} />
            <Route path="/ajuda" element={<HelpPage />} />
            <Route path="/notificacoes" element={<NotificationsPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
          </Route>
        </Route>

        <Route path="*" element={<div>404 - Não encontrado</div>} />
      </Routes>
    </Suspense>
  );
}
