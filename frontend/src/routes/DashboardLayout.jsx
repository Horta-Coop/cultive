import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

export default function DashboardLayout() {
  const { user, checkAuth } = useUserStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user == null && typeof checkAuth === "function") {
      checkAuth();
    }
  }, [user, checkAuth]);

  return (
    <div className="flex min-h-screen bg-base-100">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        {/* Header mobile */}
        <header className="md:hidden p-3 border-b border-base-300 bg-base-100 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="btn btn-ghost btn-square"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {/* Área principal scrollável */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
