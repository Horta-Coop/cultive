import React, { useState, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash,
  Calendar,
  Sprout,
  Scale,
  Truck,
  Search,
  Table,
  LayoutGrid,
} from "lucide-react";
import StatCard from "../components/ui/StatCard";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

const initialHarvests = [
  {
    id: "1",
    cultura: "Alface",
    dataColheita: "2023-04-01",
    quantidadeColhida: 10,
    unidadeMedida: "kg",
    destinoColheita: "Consumo interno",
    observacoes: "Folhas saudáveis e frescas",
  },
  {
    id: "2",
    cultura: "Tomate",
    dataColheita: "2023-03-10",
    quantidadeColhida: 5,
    unidadeMedida: "kg",
    destinoColheita: "Venda local",
    observacoes: "Alguns frutos com pequenas manchas",
  },
  {
    id: "3",
    cultura: "Cenoura",
    dataColheita: "2023-02-20",
    quantidadeColhida: 20,
    unidadeMedida: "maços",
    destinoColheita: "Doação",
    observacoes: "Raízes firmes e uniformes",
  },
];

export default function HarvestsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState("table");

  const filteredHarvests = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return initialHarvests
      .filter(
        (h) =>
          h.cultura.toLowerCase().includes(q) ||
          h.destinoColheita.toLowerCase().includes(q) ||
          (h.observacoes || "").toLowerCase().includes(q)
      )
      .filter((h) =>
        statusFilter
          ? h.destinoColheita.toLowerCase() === statusFilter.toLowerCase()
          : true
      );
  }, [searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = filteredHarvests.length;
    const totalQuantidade = filteredHarvests.reduce(
      (sum, h) => sum + Number(h.quantidadeColhida),
      0
    );
    const ultimaData =
      filteredHarvests.length > 0
        ? filteredHarvests
            .map((h) => new Date(h.dataColheita))
            .sort((a, b) => b - a)[0]
            .toISOString()
            .split("T")[0]
        : "-";
    return { total, totalQuantidade, ultimaData };
  }, [filteredHarvests]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-base-content">
            Registro de Colheitas
          </h1>
          <p className="text-base-content/70 mt-1">
            Acompanhe e registre as colheitas realizadas nas hortas
            comunitárias.
          </p>
        </div>
        <Button className="btn btn-primary">
          <Plus className="h-4 w-4 mr-2" /> Nova Colheita
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Colheitas Totais"
          value={stats.total}
          icon={<Sprout className="h-6 w-6 text-primary" />}
        />
        <StatCard
          title="Quantidade Total"
          value={`${stats.totalQuantidade}`}
          icon={<Scale className="h-6 w-6 text-secondary" />}
        />
        <StatCard
          title="Última Colheita"
          value={stats.ultimaData}
          icon={<Calendar className="h-6 w-6 text-accent" />}
          smallValue
        />

        <StatCard
          title="Destinos Diferentes"
          value={new Set(filteredHarvests.map((h) => h.destinoColheita)).size}
          icon={<Truck className="h-6 w-6 text-info" />}
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2 flex-1 px-4 py-2 border border-base-300 rounded-lg shadow-sm bg-base-100">
          <Search className="h-4 w-4 text-base-content/70" />
          <input
            type="text"
            placeholder="Buscar por cultura, destino ou observações..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="grow bg-transparent focus:outline-none text-base-content"
          />
        </div>

        <select
          value={statusFilter || ""}
          onChange={(e) => setStatusFilter(e.target.value || "")}
          className="select select-bordered w-full sm:w-[220px] rounded-lg"
        >
          <option value="">Filtrar por destino</option>
          {[...new Set(initialHarvests.map((h) => h.destinoColheita))].map(
            (dest) => (
              <option key={dest} value={dest}>
                {dest}
              </option>
            )
          )}
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
        <div className="overflow-x-auto border border-base-300 rounded-xl">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                {[
                  "Cultura",
                  "Data da Colheita",
                  "Quantidade",
                  "Unidade",
                  "Destino",
                  "Observações",
                  "Ações",
                ].map((col) => (
                  <th
                    key={col}
                    className="text-xs uppercase font-semibold tracking-wider text-base-content"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredHarvests.map((h) => (
                <tr key={h.id}>
                  <td className="font-semibold">{h.cultura}</td>
                  <td>{h.dataColheita}</td>
                  <td>{h.quantidadeColhida}</td>
                  <td>{h.unidadeMedida}</td>
                  <td>{h.destinoColheita}</td>
                  <td>{h.observacoes || "-"}</td>
                  <td className="flex gap-2 justify-center">
                    <button className="btn btn-ghost btn-sm p-1">
                      <Edit className="h-4 w-4 text-base-content/80" />
                    </button>
                    <button className="btn btn-ghost btn-sm p-1">
                      <Trash className="h-4 w-4 text-error" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHarvests.map((h) => (
            <Card
              key={h.id}
              className="p-5 rounded-xl border border-base-300 shadow-md bg-base-100"
            >
              <div className="absolute top-2 right-2 flex gap-1">
                <button className="btn btn-ghost btn-sm">
                  <Edit className="h-4 w-4 text-base-content/80" />
                </button>
                <button className="btn btn-ghost btn-sm">
                  <Trash className="h-4 w-4 text-error" />
                </button>
              </div>

              <div className="font-bold text-lg text-base-content mb-1">
                {h.cultura}
              </div>
              <div className="text-sm opacity-60 mb-3">
                {new Date(h.dataColheita).toLocaleDateString("pt-BR")}
              </div>

              <div className="text-sm mb-1">
                <strong>Quantidade:</strong> {h.quantidadeColhida}{" "}
                {h.unidadeMedida}
              </div>
              <div className="text-sm mb-1">
                <strong>Destino:</strong> {h.destinoColheita}
              </div>
              <div className="text-sm mb-1">
                <strong>Observações:</strong> {h.observacoes || "-"}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
