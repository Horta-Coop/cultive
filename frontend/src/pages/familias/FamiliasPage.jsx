import React, { useState } from "react";
import { showToast } from "../lib/toast";
import {
  Search,
  UserPlus,
  Edit,
  Trash,
  Award,
  Users,
  UserCheck,
  Clock,
  Table,
  LayoutGrid,
} from "lucide-react";
import ResponsiveGrid from "../components/ui/ResponsiveGrid";
import StatCard from "../components/ui/StatCard";

const FamiliesManager = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // "table" ou "cards"

  // Mock de famílias
  const [families, setFamilies] = useState([
    {
      id: 1,
      name: "Família Silva",
      email: "silva@example.com",
      members: 4,
      joinDate: "2023-01-15",
      status: "active",
      contributionHours: 24,
      activePlots: 2,
      participationScore: 85,
      lastActivity: "2023-05-10",
      notes: "Família muito participativa e sempre presente nos mutirões.",
    },
    {
      id: 2,
      name: "Família Oliveira",
      email: "oliveira@example.com",
      members: 3,
      joinDate: "2023-02-20",
      status: "active",
      contributionHours: 18,
      activePlots: 1,
      participationScore: 72,
      lastActivity: "2023-05-08",
      notes: "",
    },
    {
      id: 3,
      name: "Família Santos",
      email: "santos@example.com",
      members: 5,
      joinDate: "2023-03-05",
      status: "pending",
      contributionHours: 0,
      activePlots: 0,
      participationScore: 0,
      lastActivity: "2023-05-01",
      notes: "Aguardando confirmação de interesse.",
    },
    {
      id: 4,
      name: "Família Costa",
      email: "costa@example.com",
      members: 2,
      joinDate: "2023-01-10",
      status: "inactive",
      contributionHours: 8,
      activePlots: 0,
      participationScore: 45,
      lastActivity: "2023-04-15",
      notes: "Família inativa desde abril de 2023.",
    },
    {
      id: 5,
      name: "Família Pereira",
      email: "pereira@example.com",
      members: 6,
      joinDate: "2023-04-12",
      status: "active",
      contributionHours: 30,
      activePlots: 3,
      participationScore: 90,
      lastActivity: "2023-05-12",
      notes: "Família com grande experiência em horticultura.",
    },
  ]);

  // Estatísticas
  const familyStats = {
    totalFamilies: families.length,
    activeFamilies: families.filter((f) => f.status === "active").length,
    totalHours: families.reduce((sum, f) => sum + f.contributionHours, 0),
    avgParticipation:
      families.length > 0
        ? Math.round(
            families.reduce((sum, f) => sum + f.participationScore, 0) /
              families.length
          )
        : 0,
  };

  // Filtrar famílias
  const filteredFamilies = families.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? f.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // Ações
  const handleAddFamily = () => {
    setEditingFamily(null);
    setIsModalOpen(true);
  };

  const handleEditFamily = (family) => {
    setEditingFamily(family);
    setIsModalOpen(true);
  };

  const handleDeleteFamily = (familyId) => {
    if (window.confirm("Tem certeza que deseja remover esta família?")) {
      setFamilies((prev) => prev.filter((f) => f.id !== familyId));
      showToast({
        title: "Família removida",
        description: "A família foi removida com sucesso.",
        type: "success",
      });
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      active: "badge-success",
      inactive: "badge-error",
      pending: "badge-warning",
    };
    return (
      <span className={`badge ${map[status] || "badge-neutral"} text-xs`}>
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-base-content">
            Gerenciamento de Famílias
          </h1>
          <p className="text-base-content/70 mt-1">
            Gerencie todas as famílias participantes da sua horta comunitária.
          </p>
        </div>
        <button
          className="btn btn-primary w-full sm:w-auto flex items-center gap-2"
          onClick={handleAddFamily}
        >
          <UserPlus className="h-4 w-4" /> Adicionar Família
        </button>
      </div>

      {/* Stats */}
      <ResponsiveGrid>
        <StatCard
          title="Total de Famílias"
          value={familyStats.totalFamilies}
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="Famílias Ativas"
          value={familyStats.activeFamilies}
          description={`${Math.round(
            (familyStats.activeFamilies / familyStats.totalFamilies) * 100
          )}% do total`}
          icon={<UserCheck className="h-6 w-6" />}
        />
        <StatCard
          title="Horas Contribuídas"
          value={`${familyStats.totalHours}h`}
          description={`Média por ativa: ${
            familyStats.activeFamilies > 0
              ? (familyStats.totalHours / familyStats.activeFamilies).toFixed(1)
              : 0
          }h`}
          icon={<Clock className="h-6 w-6" />}
        />
        <StatCard
          title="Pontuação Média"
          value={`${familyStats.avgParticipation}%`}
          icon={<Award className="h-6 w-6" />}
        />
      </ResponsiveGrid>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex items-center gap-2 flex-1 px-4 py-2 border border-base-300 rounded-lg bg-base-100">
          <Search className="h-4 w-4 text-primary/70" />
          <input
            type="text"
            className="grow bg-transparent focus:outline-none"
            placeholder="Buscar por nome ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="select select-bordered w-full sm:w-[180px] rounded-lg"
          value={statusFilter || ""}
          onChange={(e) => setStatusFilter(e.target.value || null)}
        >
          <option value="">Filtrar por status</option>
          <option value="active">Ativas</option>
          <option value="inactive">Inativas</option>
          <option value="pending">Pendentes</option>
        </select>
      </div>

      {/* Tabs */}
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
        <div className="overflow-x-auto hidden md:block">
          <table className="table w-full table-zebra">
            <thead>
              <tr>
                {[
                  "Nome",
                  "Membros",
                  "Entrada",
                  "Status",
                  "Pontuação",
                  "Última Atividade",
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
              {filteredFamilies.length > 0 ? (
                filteredFamilies.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <div className="font-semibold">{f.name}</div>
                      <div className="text-sm opacity-50">{f.email}</div>
                    </td>
                    <td>{f.members}</td>
                    <td>{new Date(f.joinDate).toLocaleDateString("pt-BR")}</td>
                    <td>{getStatusBadge(f.status)}</td>
                    <td className="flex items-center gap-1">
                      <span className="font-semibold">
                        {f.participationScore}
                      </span>
                      <Award className="h-4 w-4 text-primary" />
                    </td>
                    <td>
                      {new Date(f.lastActivity).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="flex gap-2 justify-end">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleEditFamily(f)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm text-error"
                        onClick={() => handleDeleteFamily(f.id)}
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
                    Nenhuma família encontrada com os filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFamilies.length > 0 ? (
            filteredFamilies.map((f) => (
              <div
                key={f.id}
                className="p-4 border border-base-200 rounded-lg shadow-sm flex flex-col gap-2 relative"
              >
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleEditFamily(f)}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="btn btn-ghost btn-sm text-error"
                    onClick={() => handleDeleteFamily(f.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
                <div className="font-bold text-lg">{f.name}</div>
                <div className="text-xs opacity-60">{f.email}</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="badge badge-ghost">{f.members} membros</span>
                  {getStatusBadge(f.status)}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{f.participationScore}</span>
                </div>
                <div className="text-xs opacity-50 mt-1">
                  Última atividade:{" "}
                  {new Date(f.lastActivity).toLocaleDateString("pt-BR")}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-6 text-base-content/60 italic">
              Nenhuma família encontrada com os filtros aplicados.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FamiliesManager;
