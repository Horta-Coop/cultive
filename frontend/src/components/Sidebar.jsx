import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Home,
  Globe,
  Sprout,
  PieChart,
  Calendar,
  Package,
  MessageSquare,
  Users,
  Settings,
  Bell,
  HelpCircle,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const Sidebar = ({ user, isOpen, onToggle }) => {
  const { logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // fechar o menu mobile (se houver)
    if (onToggle) onToggle();
    // redirecionar para login
    navigate("/login");
  };

  // tornar acesso a role seguro e nome consistente
  const role = user?.role ?? "cultivador";
  const displayName = user?.nome || user?.name || "Usuário";

  const menuItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/hortas", icon: Globe, label: "Hortas" },
    { path: "/plantios", icon: Sprout, label: "Plantios" },
    { path: "/comunicacao", icon: MessageSquare, label: "Comunicação" },
    // Condicionais baseadas na role do usuário
    ...(role === "admin"
      ? [{ path: "/usuarios", icon: Users, label: "Usuários" }]
      : []),
    ...(["gestor", "admin"].includes(role)
      ? [{ path: "/familias", icon: Users, label: "Famílias" }]
      : []),
    { path: "/configuracoes", icon: Settings, label: "Configurações" },
    { path: "/notificacoes", icon: Bell, label: "Notificações" },
    { path: "/ajuda", icon: HelpCircle, label: "Ajuda" },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:flex`}
    >
      <div className="flex flex-col bg-base-100 border-r border-base-300 h-full relative transition-all duration-300 ease-in-out w-64">
        {/* Cabeçalho */}
        <div className="p-4 border-b border-base-300 flex items-center justify-between">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
            </svg>
            <span className="ml-2 text-xl font-semibold text-base-content">
              Cultive
            </span>
          </div>
          <button
            className="p-1 rounded-full hover:bg-base-300 transition-colors md:hidden"
            onClick={onToggle}
          >
            <ChevronLeft className="h-5 w-5 text-base-content/70" />
          </button>
        </div>

        {/* Navegação */}
        <div className="py-4 flex-grow overflow-y-auto">
          <nav className="px-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-base-content/70 hover:bg-base-300 hover:text-base-content"
                    }`
                  }
                >
                  <div className="mr-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Perfil do usuário */}
        <div className="p-4 border-t border-base-300">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center font-medium">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-base-content truncate">
                {displayName}
              </p>
              <p className="text-xs text-base-content/70 truncate">
                {role}
              </p>
            </div>
          </div>

          {/* Menu de perfil */}
          <div className="space-y-1">
            <Link
              to="/perfil"
              className="flex items-center px-3 py-2 text-sm rounded-md text-base-content/70 hover:bg-base-300 transition-colors"
            >
              <Settings className="h-4 w-4 mr-3" />
              Meu Perfil
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm rounded-md text-error hover:bg-base-300 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
