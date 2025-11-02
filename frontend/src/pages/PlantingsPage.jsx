import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import ResponsiveGrid from "../components/ui/ResponsiveGrid";
import StatCard from "../components/ui/StatCard";
import { Button } from "../components/ui/Button";
import {
  Edit,
  LayoutGrid,
  Plus,
  Search,
  Sprout,
  Tractor,
  Trash,
  X,
  Sun,
  Droplets,
  Thermometer,
  Award,
  Table,
} from "lucide-react";
import { Card } from "../components/ui/Card";

// Dados iniciais
const initialPlantings = [
  {
    id: "1",
    cultura: "Alface Crespa",
    tipoPlantacao: "Orgânico",
    dataInicio: "2023-05-10",
    previsaoColheita: "2023-06-24",
    quantidadePlantada: 10.5,
    unidadeMedida: "kg",
    observacoes: "Plantio em canteiro 3",
    participacaoScore: 80,
    status: "ativo",
    hortaId: "1",
  },
  {
    id: "2",
    cultura: "Cenoura Brasília",
    tipoPlantacao: "Convencional",
    dataInicio: "2023-04-15",
    previsaoColheita: "2023-07-14",
    quantidadePlantada: 20,
    unidadeMedida: "kg",
    observacoes: "",
    participacaoScore: 60,
    status: "ativo",
    hortaId: "2",
  },
];

// Hortas cadastradas
const hortasCadastradas = [
  { id: "1", nome: "Horta Comunitária Central" },
  { id: "2", nome: "Horta Escola ABC" },
  { id: "3", nome: "Horta Bairro Norte" },
];

// Funções de badge
const getStatusBadge = (status) => {
  const colors = {
    ativo: "badge-success",
    inativo: "badge-error",
    pendente: "badge-warning",
  };
  return (
    <span className={`badge ${colors[status] || "badge-ghost"}`}>{status}</span>
  );
};

const getTipoPlantioBadge = (tipo) => {
  const colors = {
    Orgânico: "badge-success",
    Convencional: "badge-primary",
    Hidropônico: "badge-info",
  };
  return (
    <span className={`badge ${colors[tipo] || "badge-ghost"}`}>{tipo}</span>
  );
};

export default function PlantingsPage() {
  const [plantings, setPlantings] = useState(initialPlantings);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [showModal, setShowModal] = useState(false);
  const [editingPlantio, setEditingPlantio] = useState(null);

  const [newPlantio, setNewPlantio] = useState({
    cultura: "",
    tipoPlantacao: "",
    dataInicio: "",
    previsaoColheita: "",
    quantidadePlantada: "",
    unidadeMedida: "kg",
    observacoes: "",
    hortaId: "",
  });

  const [errors, setErrors] = useState({});

  // Abrir modal para adicionar
  const openModalToAdd = () => {
    setEditingPlantio(null);
    setNewPlantio({
      cultura: "",
      tipoPlantacao: "",
      dataInicio: "",
      previsaoColheita: "",
      quantidadePlantada: "",
      unidadeMedida: "kg",
      observacoes: "",
      hortaId: "",
    });
    setErrors({});
    setShowModal(true);
  };

  // Abrir modal para editar
  const openModalToEdit = (plantio) => {
    setEditingPlantio(plantio);
    setNewPlantio({ ...plantio });
    setErrors({});
    setShowModal(true);
  };

  // Submissão do plantio
  const handleSubmitPlantio = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!newPlantio.cultura) newErrors.cultura = "Campo obrigatório";
    if (!newPlantio.tipoPlantacao)
      newErrors.tipoPlantacao = "Campo obrigatório";
    if (!newPlantio.dataInicio) newErrors.dataInicio = "Campo obrigatório";
    if (!newPlantio.previsaoColheita)
      newErrors.previsaoColheita = "Campo obrigatório";
    if (!newPlantio.quantidadePlantada)
      newErrors.quantidadePlantada = "Campo obrigatório";
    if (!newPlantio.hortaId) newErrors.hortaId = "Selecione uma horta";

    if (
      newPlantio.dataInicio &&
      newPlantio.previsaoColheita &&
      new Date(newPlantio.previsaoColheita) < new Date(newPlantio.dataInicio)
    ) {
      newErrors.previsaoColheita = "A previsão não pode ser anterior ao início";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (editingPlantio) {
      setPlantings(
        plantings.map((p) =>
          p.id === editingPlantio.id ? { ...newPlantio } : p
        )
      );
      toast.success("Plantio atualizado com sucesso!");
    } else {
      const newEntry = {
        ...newPlantio,
        id: String(Date.now()),
        participacaoScore: 0,
        status: "ativo",
      };
      setPlantings([newEntry, ...plantings]);
      toast.success("Plantio adicionado com sucesso!");
    }

    setShowModal(false);
    setEditingPlantio(null);
    setNewPlantio({
      cultura: "",
      tipoPlantacao: "",
      dataInicio: "",
      previsaoColheita: "",
      quantidadePlantada: "",
      unidadeMedida: "kg",
      observacoes: "",
      hortaId: "",
    });
  };

  // Deletar plantio
  const handleDeletePlantio = (id) => {
    if (window.confirm("Deseja realmente deletar este plantio?")) {
      setPlantings(plantings.filter((p) => p.id !== id));
      toast.success("Plantio deletado com sucesso!");
    }
  };

  const filteredPlantings = plantings.filter(
    (p) =>
      p.cultura.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (statusFilter ? p.status === statusFilter : true)
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <Toaster position="top-right" />

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-base-content">
            Gerenciamento de Plantios
          </h1>
          <p className="text-base-content/70 mt-1">
            Visualize seus plantios, acompanhe o progresso e receba alertas
            importantes.
          </p>
        </div>
        <Button
          onClick={openModalToAdd}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Adicionar Plantio
        </Button>
      </div>

      {/* Stats */}
      <ResponsiveGrid columns={3}>
        <StatCard
          title="Plantios Totais"
          value={plantings.length.toString()}
          description="Plantios cadastrados"
          icon={<LayoutGrid className="h-6 w-6" />}
        />
        <StatCard
          title="Culturas Diferentes"
          value={new Set(plantings.map((p) => p.cultura)).size.toString()}
          description="Tipos de culturas"
          icon={<Sprout className="h-6 w-6" />}
        />
        <StatCard
          title="Plantios Ativos"
          value={plantings
            .filter((p) => p.status === "ativo")
            .length.toString()}
          description="Plantios em andamento"
          icon={<Tractor className="h-6 w-6" />}
        />
      </ResponsiveGrid>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex items-center gap-2 flex-1 px-4 py-2 border border-base-300 rounded-lg shadow-sm bg-base-100">
          <Search className="h-4 w-4 text-primary/70" />
          <input
            type="text"
            className="grow bg-transparent focus:outline-none text-base-content"
            placeholder="Buscar por cultura..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="select select-bordered w-full sm:w-[180px] rounded-lg text-base-content"
          value={statusFilter || ""}
          onChange={(e) => setStatusFilter(e.target.value || "")}
        >
          <option value="">Filtrar por status</option>
          <option value="ativo">Ativos</option>
          <option value="inativo">Inativos</option>
          <option value="pendente">Pendentes</option>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-auto">
          <div className="bg-base-100 p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-lg">
            <X
              className="absolute top-4 right-4 h-5 w-5 cursor-pointer text-base-content/70 hover:text-base-content transition-colors"
              onClick={() => setShowModal(false)}
            />
            <h2 className="text-xl font-bold mb-4">
              {editingPlantio ? "Editar Plantio" : "Adicionar Plantio"}
            </h2>
            <form
              className="grid grid-cols-1 gap-3"
              onSubmit={handleSubmitPlantio}
            >
              <input
                type="text"
                placeholder="Cultura"
                className={`input input-bordered w-full ${
                  errors.cultura ? "input-error" : ""
                }`}
                value={newPlantio.cultura}
                onChange={(e) =>
                  setNewPlantio({ ...newPlantio, cultura: e.target.value })
                }
              />
              {errors.cultura && (
                <p className="text-error text-xs">{errors.cultura}</p>
              )}

              <select
                className={`select select-bordered w-full ${
                  errors.tipoPlantacao ? "select-error" : ""
                }`}
                value={newPlantio.tipoPlantacao}
                onChange={(e) =>
                  setNewPlantio({
                    ...newPlantio,
                    tipoPlantacao: e.target.value,
                  })
                }
              >
                <option value="">Tipo de Plantio</option>
                <option value="Orgânico">Orgânico</option>
                <option value="Convencional">Convencional</option>
                <option value="Hidropônico">Hidropônico</option>
              </select>
              {errors.tipoPlantacao && (
                <p className="text-error text-xs">{errors.tipoPlantacao}</p>
              )}

              <input
                type="date"
                className={`input input-bordered w-full ${
                  errors.dataInicio ? "input-error" : ""
                }`}
                value={newPlantio.dataInicio}
                onChange={(e) =>
                  setNewPlantio({ ...newPlantio, dataInicio: e.target.value })
                }
              />
              {errors.dataInicio && (
                <p className="text-error text-xs">{errors.dataInicio}</p>
              )}

              <input
                type="date"
                className={`input input-bordered w-full ${
                  errors.previsaoColheita ? "input-error" : ""
                }`}
                value={newPlantio.previsaoColheita}
                onChange={(e) =>
                  setNewPlantio({
                    ...newPlantio,
                    previsaoColheita: e.target.value,
                  })
                }
              />
              {errors.previsaoColheita && (
                <p className="text-error text-xs">{errors.previsaoColheita}</p>
              )}

              <input
                type="number"
                placeholder="Quantidade Plantada"
                className={`input input-bordered w-full ${
                  errors.quantidadePlantada ? "input-error" : ""
                }`}
                value={newPlantio.quantidadePlantada}
                onChange={(e) =>
                  setNewPlantio({
                    ...newPlantio,
                    quantidadePlantada: e.target.value,
                  })
                }
              />
              {errors.quantidadePlantada && (
                <p className="text-error text-xs">
                  {errors.quantidadePlantada}
                </p>
              )}

              <select
                className="select select-bordered w-full"
                value={newPlantio.unidadeMedida}
                onChange={(e) =>
                  setNewPlantio({
                    ...newPlantio,
                    unidadeMedida: e.target.value,
                  })
                }
              >
                <option value="kg">kg</option>
                <option value="unidades">unidades</option>
                <option value="m²">m²</option>
              </select>

              <select
                className={`select select-bordered w-full ${
                  errors.hortaId ? "select-error" : ""
                }`}
                value={newPlantio.hortaId}
                onChange={(e) =>
                  setNewPlantio({ ...newPlantio, hortaId: e.target.value })
                }
              >
                <option value="">Selecione uma Horta</option>
                {hortasCadastradas.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.nome}
                  </option>
                ))}
              </select>
              {errors.hortaId && (
                <p className="text-error text-xs">{errors.hortaId}</p>
              )}

              <textarea
                placeholder="Observações (opcional)"
                className="textarea textarea-bordered w-full"
                value={newPlantio.observacoes}
                onChange={(e) =>
                  setNewPlantio({ ...newPlantio, observacoes: e.target.value })
                }
              />

              <button type="submit" className="btn btn-primary mt-2 w-full">
                {editingPlantio ? "Atualizar Plantio" : "Adicionar Plantio"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tabela ou Cards */}
      <div className="mt-4">
        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  {[
                    "Cultura",
                    "Tipo Plantio",
                    "Início",
                    "Previsão",
                    "Colheita",
                    "Qtd",
                    "Observações",
                    "Status",
                    "Ações",
                  ].map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPlantings.map((p) => (
                  <tr key={p.id}>
                    <td>{p.cultura}</td>
                    <td>{getTipoPlantioBadge(p.tipoPlantacao)}</td>
                    <td>
                      {new Date(p.dataInicio).toLocaleDateString("pt-BR")}
                    </td>
                    <td>
                      {new Date(p.previsaoColheita).toLocaleDateString("pt-BR")}
                    </td>
                    <td>
                      {p.dataColheita
                        ? new Date(p.dataColheita).toLocaleDateString("pt-BR")
                        : "-"}
                    </td>
                    <td>{`${p.quantidadePlantada} ${p.unidadeMedida}`}</td>
                    <td>{p.observacoes || "-"}</td>
                    <td>{getStatusBadge(p.status)}</td>
                    <td className="flex gap-2">
                      <button
                        onClick={() => openModalToEdit(p)}
                        className="btn btn-ghost btn-sm p-1"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePlantio(p.id)}
                        className="btn btn-ghost btn-sm p-1 text-error"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlantings.map((p) => (
              <Card
                key={p.id}
                className="relative p-5 bg-base-100 border border-base-200 shadow hover:shadow-lg transition-shadow rounded-xl"
              >
                {/* Ações */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <button
                    onClick={() => openModalToEdit(p)}
                    className="btn btn-ghost btn-sm p-1 hover:bg-base-200 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePlantio(p.id)}
                    className="btn btn-ghost btn-sm text-error p-1 hover:bg-red-100 transition-colors"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>

                {/* Header do Card */}
                <div className="mb-3">
                  <h3 className="text-lg font-bold">{p.cultura}</h3>
                  <p className="text-xs text-base-content/70">
                    {hortasCadastradas.find((h) => h.id === p.hortaId)?.nome ||
                      "-"}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {getTipoPlantioBadge(p.tipoPlantacao)}
                  {getStatusBadge(p.status)}
                </div>

                {/* Informações do plantio */}
                <div className="grid grid-cols-1 gap-1 text-sm mb-3">
                  <div className="flex items-center gap-1">
                    <Sun className="h-4 w-4 text-yellow-400" />
                    <span>
                      <strong>Início:</strong>{" "}
                      {new Date(p.dataInicio).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Thermometer className="h-4 w-4 text-red-400" />
                    <span>
                      <strong>Previsão:</strong>{" "}
                      {new Date(p.previsaoColheita).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplets className="h-4 w-4 text-blue-400" />
                    <span>
                      <strong>Colheita:</strong>{" "}
                      {p.dataColheita
                        ? new Date(p.dataColheita).toLocaleDateString("pt-BR")
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplets className="h-4 w-4 text-blue-400" />
                    <span>
                      <strong>Qtd:</strong> {p.quantidadePlantada}{" "}
                      {p.unidadeMedida}
                    </span>
                  </div>
                  {p.observacoes && (
                    <div className="flex items-start gap-1">
                      <span className="font-semibold">Obs:</span>{" "}
                      {p.observacoes}
                    </div>
                  )}
                </div>

                {/* Métricas */}
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <Award className="h-4 w-4 text-primary" />
                  <span>Score: {p.participacaoScore}</span>
                  {p.colheitaId && (
                    <span className="text-xs text-success/80 ml-auto">
                      Colheita registrada
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
