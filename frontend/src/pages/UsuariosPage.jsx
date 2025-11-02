import React, { useState, useMemo } from "react";
import {
  Users,
  UserPlus,
  Edit,
  Trash,
  UserCheck,
  Shield,
  X,
  Search,
  Table,
  LayoutGrid,
} from "lucide-react";
import { showToast } from "../lib/toast";
import StatCard from "../components/ui/StatCard";
import ResponsiveGrid from "../components/ui/ResponsiveGrid";

export default function UsuariosPage() {
  // Dados mock
  const [users, setUsers] = useState([
    {
      id: 1,
      nome: "Ana Silva",
      username: "ana.s",
      email: "ana@example.com",
      role: "cultivador",
      status: "active",
      lastLogin: "2023-10-01",
    },
    {
      id: 2,
      nome: "Bruno Costa",
      username: "bruno",
      email: "bruno@example.com",
      role: "gestor",
      status: "active",
      lastLogin: "2023-10-03",
    },
    {
      id: 3,
      nome: "Carla Pereira",
      username: "carla.p",
      email: "carla@example.com",
      role: "admin",
      status: "active",
      lastLogin: "2023-09-21",
    },
    {
      id: 4,
      nome: "Diego Martins",
      username: "diego",
      email: "diego@example.com",
      role: "cultivador",
      status: "inactive",
      lastLogin: "2023-06-15",
    },
    {
      id: 5,
      nome: "Eva Gomes",
      username: "eva.g",
      email: "eva@example.com",
      role: "cultivador",
      status: "pending",
      lastLogin: "2023-05-20",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState("table"); // table ou cards

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.status === "active").length,
      pending: users.filter((u) => u.status === "pending").length,
      admins: users.filter((u) => u.role === "admin").length,
    }),
    [users]
  );

  const filtered = users.filter((u) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesQ =
      !q ||
      [u.nome, u.username, u.email].some((v) =>
        (v || "").toLowerCase().includes(q)
      );
    const matchesStatus = !statusFilter || u.status === statusFilter;
    return matchesQ && matchesStatus;
  });

  const handleEditUser = (u) => {
    const nome = window.prompt("Editar nome:", u.nome);
    if (!nome) return;
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, nome } : x)));
    showToast({
      title: "Usuário atualizado",
      description: `${nome} atualizado.`,
      type: "success",
    });
  };

  const handleDeleteUser = (id) => {
    if (!window.confirm("Remover usuário?")) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
    showToast({ title: "Usuário removido", type: "success" });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Usuários</h1>
          <p className="text-base-content/70 mt-1">
            Lista de todos os usuários cadastrados.
          </p>
        </div>
        <button className="btn btn-primary w-full sm:w-auto">
          <UserPlus className="h-4 w-4 mr-2" /> Adicionar Usuário
        </button>
      </div>

      {/* Stats Cards */}
      <ResponsiveGrid>
        <StatCard
          title="Total de usuários"
          value={stats.total}
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="Ativos"
          value={stats.active}
          icon={<UserCheck className="h-6 w-6" />}
        />
        <StatCard
          title="Administradores"
          value={stats.admins}
          icon={<Shield className="h-6 w-6" />}
        />
        <StatCard
          title="Pendentes"
          value={stats.pending}
          icon={<X className="h-6 w-6" />}
        />
      </ResponsiveGrid>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex items-center gap-2 flex-1 px-4 py-2 border border-base-300 rounded-lg shadow-sm bg-base-100">
          <Search className="h-4 w-4 text-primary/70" />
          <input
            type="search"
            placeholder="Buscar por nome, usuário ou email..."
            className="grow bg-transparent focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="select select-bordered w-full sm:w-[180px] rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos os status</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
          <option value="pending">Pendentes</option>
        </select>
      </div>

      {/* Tabs desktop */}
      <div className="flex justify-start gap-2 mb-4">
        <button
          className={`btn btn-sm ${
            viewMode === "table" ? "btn-primary" : "btn-outline border-base-300"
          }`}
          onClick={() => setViewMode("table")}
        >
          <Table className="h-4 w-4 mr-1" /> Tabela
        </button>
        <button
          className={`btn btn-sm ${
            viewMode === "cards" ? "btn-primary" : "btn-outline border-base-300"
          }`}
          onClick={() => setViewMode("cards")}
        >
          <LayoutGrid className="h-4 w-4 mr-1" /> Cards
        </button>
      </div>

      {/* Conteúdo */}
      {viewMode === "table" ? (
        <div className="overflow-x-auto">
          <div className="hidden md:block">
            <table className="table w-full table-zebra">
              <thead>
                <tr>
                  {[
                    "Nome",
                    "Usuário",
                    "Email",
                    "Papel",
                    "Status",
                    "Último login",
                    "Ações",
                  ].map((col) => (
                    <th
                      key={col}
                      className="bg-base-200 text-xs uppercase font-semibold tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-base-100/50 transition-colors"
                    >
                      <td>{u.nome}</td>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td className="capitalize">{u.role}</td>
                      <td>
                        <span
                          className={`badge ${
                            u.status === "active"
                              ? "badge-success"
                              : u.status === "pending"
                              ? "badge-warning"
                              : "badge-error"
                          }`}
                        >
                          {u.status === "active"
                            ? "Ativo"
                            : u.status === "pending"
                            ? "Pendente"
                            : "Inativo"}
                        </span>
                      </td>
                      <td>{u.lastLogin}</td>
                      <td className="text-right flex gap-2 justify-end">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleEditUser(u)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm text-error"
                          onClick={() => handleDeleteUser(u.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-6 text-base-content/60 italic"
                    >
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="block md:hidden flex-col gap-2">
            {filtered.length > 0 ? (
              filtered.map((u) => (
                <div
                  key={u.id}
                  className="p-4 border border-base-200 rounded-lg flex justify-between items-start"
                >
                  <div className="flex-1">
                    <div className="font-semibold">{u.nome}</div>
                    <div className="text-sm opacity-60">{u.email}</div>
                    <div className="text-sm mt-2 flex flex-wrap gap-2 items-center">
                      <span className="badge badge-ghost capitalize">
                        {u.role}
                      </span>
                      <span
                        className={`badge ${
                          u.status === "active"
                            ? "badge-success"
                            : u.status === "pending"
                            ? "badge-warning"
                            : "badge-error"
                        }`}
                      >
                        {u.status === "active"
                          ? "Ativo"
                          : u.status === "pending"
                          ? "Pendente"
                          : "Inativo"}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 flex-shrink-0 flex flex-col gap-2">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleEditUser(u)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm text-error"
                      onClick={() => handleDeleteUser(u.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-base-content/60 italic">
                Nenhum usuário encontrado.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length > 0 ? (
            filtered.map((u) => (
              <div
                key={u.id}
                className="p-4 border border-base-200 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2 relative"
              >
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleEditUser(u)}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="btn btn-ghost btn-sm text-error"
                    onClick={() => handleDeleteUser(u.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
                <div className="font-bold text-lg">{u.nome}</div>
                <div className="text-xs opacity-60">{u.email}</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="badge badge-ghost capitalize">{u.role}</span>
                  <span
                    className={`badge ${
                      u.status === "active"
                        ? "badge-success"
                        : u.status === "pending"
                        ? "badge-warning"
                        : "badge-error"
                    }`}
                  >
                    {u.status === "active"
                      ? "Ativo"
                      : u.status === "pending"
                      ? "Pendente"
                      : "Inativo"}
                  </span>
                </div>
                <div className="text-xs opacity-50 mt-1">
                  Último login: {u.lastLogin}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-6 text-base-content/60 italic">
              Nenhum usuário encontrado.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
