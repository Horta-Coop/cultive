import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useUserStore } from "../stores/useUserStore";
import { Menu } from "lucide-react";

export default function DashboardLayout() {
  const { user } = useUserStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-base-100">
      <Sidebar user={user} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />

      <div className="flex-1 flex flex-col">
        <header className="md:hidden p-3 border-b border-base-300 bg-base-100">
          <button
            onClick={() => setSidebarOpen(true)}
            className="btn btn-ghost btn-square"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}