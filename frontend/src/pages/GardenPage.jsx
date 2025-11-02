import React, { useState, useMemo, useEffect } from "react";
import {
  LayoutGrid,
  Sprout,
  Tractor,
  Edit,
  Trash,
  MapPin,
  AreaChart,
  Search,
  Plus,
  Table,
  X,
} from "lucide-react";
import StatCard from "../components/ui/StatCard";
import ResponsiveGrid from "../components/ui/ResponsiveGrid";
import { toast, Toaster } from "react-hot-toast";

// --- Funções auxiliares ---
const getStatusBadge = (text, badgeClass = "badge-info") => (
  <span className={`badge text-xs ${badgeClass} text-white`}>{text}</span>
);

const getHortaBadgeColor = (tipoHorta) => {
  switch (tipoHorta) {
    case "Comunitária":
      return "badge-success";
    case "Familiar":
      return "badge-info";
    case "Escolar":
      return "badge-primary";
    default:
      return "badge-secondary";
  }
};

const getSoloBadgeColor = (tipoSolo) => {
  switch (tipoSolo) {
    case "Argiloso":
      return "badge-warning";
    case "Arenoso":
      return "badge-info";
    case "Humoso":
      return "badge-success";
    default:
      return "badge-secondary";
  }
};

// --- Simulação de usuário logado ---
const currentUser = {
  id: "g2",
  nome: "João Souza",
  role: "gestor", // ou "admin"
};

const GardenPage = () => {
  const [hortas, setHortas] = useState([
    {
      id: "1",
      nome: "Horta Comunitária Central",
      endereco: "Rua das Flores, 123",
      coordenada: "-23.5505, -46.6333",
      areaCultivada: 250.5,
      tipoSolo: "Argiloso",
      tipoHorta: "Comunitária",
      gestor: { id: "g1", nome: "Maria Oliveira" },
      familia: { id: "f1", nome: "Família Silva" },
    },
  ]);

  const [gestoresCadastrados] = useState([
    { id: "g1", nome: "Maria Oliveira" },
    { id: "g2", nome: "João Souza" },
    { id: "g3", nome: "Ana Santos" },
  ]);

  const [familiasCadastradas] = useState([
    { id: "f1", nome: "Família Silva" },
    { id: "f2", nome: "Família Pereira" },
    { id: "f3", nome: "Família Barbosa" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [showModal, setShowModal] = useState(false);

  const [newHorta, setNewHorta] = useState({
    nome: "",
    endereco: "",
    coordenada: "",
    areaCultivada: "",
    tipoSolo: "",
    tipoHorta: "",
    descricao: "",
    observacoes: "",
    gestorId: currentUser.role === "gestor" ? currentUser.id : "",
    familiaId: "",
  });

  const [errors, setErrors] = useState({});

  // Validação dos campos
  useEffect(() => {
    const newErrors = {};
    if (!newHorta.nome.trim()) newErrors.nome = "Nome da horta é obrigatório";
    if (!newHorta.endereco.trim())
      newErrors.endereco = "Endereço é obrigatório";
    if (!newHorta.tipoHorta)
      newErrors.tipoHorta = "Tipo da horta é obrigatório";
    if (!newHorta.tipoSolo) newErrors.tipoSolo = "Tipo de solo é obrigatório";
    if (!newHorta.familiaId) newErrors.familiaId = "Selecione uma família";
    if (currentUser.role === "admin" && !newHorta.gestorId)
      newErrors.gestorId = "Selecione um gestor";
    setErrors(newErrors);
  }, [newHorta]);

  const handleAddHorta = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return;

    const gestor =
      currentUser.role === "gestor"
        ? gestoresCadastrados.find((g) => g.id === currentUser.id)
        : gestoresCadastrados.find((g) => g.id === newHorta.gestorId);

    const familia = familiasCadastradas.find(
      (f) => f.id === newHorta.familiaId
    );

    const novaHorta = {
      id: crypto.randomUUID(),
      ...newHorta,
      areaCultivada: parseFloat(newHorta.areaCultivada) || 0,
      gestor,
      familia,
    };

    setHortas([...hortas, novaHorta]);
    setNewHorta({
      nome: "",
      endereco: "",
      coordenada: "",
      areaCultivada: "",
      tipoSolo: "",
      tipoHorta: "",
      descricao: "",
      observacoes: "",
      gestorId: currentUser.role === "gestor" ? currentUser.id : "",
      familiaId: "",
    });
    setShowModal(false);
    toast.success("Horta adicionada com sucesso!");
  };

  const filteredHortas = useMemo(() => {
    return hortas.filter((h) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        h.nome.toLowerCase().includes(query) ||
        h.endereco.toLowerCase().includes(query) ||
        h.gestor.nome.toLowerCase().includes(query);
      const matchesType = typeFilter ? h.tipoHorta === typeFilter : true;
      return matchesSearch && matchesType;
    });
  }, [hortas, searchQuery, typeFilter]);

  const uniqueHortaTypes = useMemo(
    () => [...new Set(hortas.map((h) => h.tipoHorta))],
    [hortas]
  );

  const handleEditHorta = (horta) => console.log("Editar horta:", horta);
  const handleDeleteHorta = (id) =>
    setHortas(hortas.filter((h) => h.id !== id));

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <Toaster position="top-right" />

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-base-content">
            Minhas Hortas
          </h1>
          <p className="text-base-content/70 mt-1">
            Gerencie seus canteiros, acompanhe o progresso e receba alertas
            importantes.
          </p>
        </div>
        <button
          className="btn btn-primary w-full sm:w-auto flex items-center gap-1"
          onClick={() => setShowModal(true)}
        >
          <Plus className="h-4 w-4" /> Adicionar Horta
        </button>
      </div>

      {/* Stats */}
      <ResponsiveGrid columns={3}>
        <StatCard
          title="Hortas Totais"
          value={hortas.length.toString()}
          description="Hortas cadastradas"
          icon={<LayoutGrid className="h-6 w-6" />}
        />
        <StatCard
          title="Área Total"
          value={`${hortas
            .reduce((acc, h) => acc + h.areaCultivada, 0)
            .toFixed(1)} m²`}
          description="Área total cultivada"
          icon={<Sprout className="h-6 w-6" />}
        />
        <StatCard
          title="Gestores Únicos"
          value={new Set(hortas.map((h) => h.gestor.nome)).size.toString()}
          description="Gestores cadastrados"
          icon={<Tractor className="h-6 w-6" />}
        />
      </ResponsiveGrid>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex items-center gap-2 flex-1 px-4 py-2 border border-base-300 rounded-lg shadow-sm bg-base-100">
          <Search className="h-4 w-4 text-primary/70" />
          <input
            type="text"
            className="grow bg-transparent focus:outline-none"
            placeholder="Buscar nome, endereço ou gestor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="select select-bordered w-full sm:w-[180px] rounded-lg"
          value={typeFilter || ""}
          onChange={(e) => setTypeFilter(e.target.value || "")}
        >
          <option value="">Todos os Tipos</option>
          {uniqueHortaTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
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

      {/* Tabela ou Cards */}
      {viewMode === "table" ? (
        <div className="overflow-x-auto">
          <div className="hidden md:block">
            <table className="table w-full table-zebra">
              <thead>
                <tr>
                  {[
                    "Horta",
                    "Tipo",
                    "Gestor",
                    "Área (m²)",
                    "Solo",
                    "Família",
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
                {filteredHortas.length > 0 ? (
                  filteredHortas.map((horta) => (
                    <tr
                      key={horta.id}
                      className="hover:bg-base-100/50 transition-colors"
                    >
                      <td>
                        <div className="font-semibold">{horta.nome}</div>
                        <div className="text-xs opacity-60 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {horta.endereco}
                        </div>
                      </td>
                      <td>
                        {getStatusBadge(
                          horta.tipoHorta,
                          getHortaBadgeColor(horta.tipoHorta)
                        )}
                      </td>
                      <td>{horta.gestor.nome}</td>
                      <td className="flex items-center gap-1">
                        <AreaChart className="h-4 w-4 text-info" />{" "}
                        {horta.areaCultivada.toFixed(1)}
                      </td>
                      <td>
                        {getStatusBadge(
                          horta.tipoSolo,
                          getSoloBadgeColor(horta.tipoSolo)
                        )}
                      </td>
                      <td>{horta.familia.nome}</td>
                      <td className="text-right flex gap-1">
                        <button
                          className="btn btn-ghost btn-sm text-primary/80 hover:text-primary"
                          onClick={() => handleEditHorta(horta)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm text-error/80 hover:text-error"
                          onClick={() => handleDeleteHorta(horta.id)}
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
                      Nenhuma horta encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="block md:hidden flex-col gap-2">
            {filteredHortas.length > 0 ? (
              filteredHortas.map((horta) => (
                <div
                  key={horta.id}
                  className="p-4 border border-base-200 rounded-lg flex justify-between items-start"
                >
                  <div className="flex-1">
                    <div className="font-semibold">{horta.nome}</div>
                    <div className="text-xs opacity-60 flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> {horta.endereco}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {getStatusBadge(
                        horta.tipoHorta,
                        getHortaBadgeColor(horta.tipoHorta)
                      )}
                      {getStatusBadge(
                        horta.tipoSolo,
                        getSoloBadgeColor(horta.tipoSolo)
                      )}
                    </div>
                    <div className="flex flex-col gap-1 text-sm mt-2">
                      <div className="flex gap-1">
                        <span className="font-medium">Gestor:</span>{" "}
                        {horta.gestor.nome}
                      </div>
                      <div className="flex gap-1">
                        <span className="font-medium">Área:</span>{" "}
                        {horta.areaCultivada.toFixed(1)} m²
                      </div>
                      <div className="flex gap-1">
                        <span className="font-medium">Família:</span>{" "}
                        {horta.familia.nome}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4 flex-shrink-0">
                    <button
                      className="btn btn-ghost btn-sm text-primary/80 hover:text-primary"
                      onClick={() => handleEditHorta(horta)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm text-error/80 hover:text-error"
                      onClick={() => handleDeleteHorta(horta.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-base-content/60 italic">
                Nenhuma horta encontrada.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHortas.map((horta) => (
            <div
              key={horta.id}
              className="p-4 border border-base-200 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2 relative"
            >
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                <button
                  className="btn btn-ghost btn-sm text-primary/80 hover:text-primary"
                  onClick={() => handleEditHorta(horta)}
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  className="btn btn-ghost btn-sm text-error/80 hover:text-error"
                  onClick={() => handleDeleteHorta(horta.id)}
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
              <div className="font-bold text-lg">{horta.nome}</div>
              <div className="text-xs opacity-60 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {horta.endereco}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {getStatusBadge(
                  horta.tipoHorta,
                  getHortaBadgeColor(horta.tipoHorta)
                )}
                {getStatusBadge(
                  horta.tipoSolo,
                  getSoloBadgeColor(horta.tipoSolo)
                )}
              </div>
              <div className="flex flex-col gap-1 text-sm mt-2">
                <div className="flex gap-1">
                  <span className="font-medium">Gestor:</span>{" "}
                  {horta.gestor.nome}
                </div>
                <div className="flex gap-1">
                  <span className="font-medium">Área:</span>{" "}
                  {horta.areaCultivada.toFixed(1)} m²
                </div>
                <div className="flex gap-1">
                  <span className="font-medium">Família:</span>{" "}
                  {horta.familia.nome}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de adicionar Horta */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-auto">
          <div className="bg-base-100 p-6 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-lg">
            {/* Botão de fechar */}
            <X
              className="absolute top-4 right-4 h-5 w-5 cursor-pointer text-base-content/70 hover:text-base-content transition-colors"
              onClick={() => setShowModal(false)}
            />

            {/* Título */}
            <h2 className="text-xl font-bold mb-4">Adicionar Horta</h2>

            {/* Formulário */}
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={handleAddHorta}
            >
              {/* Nome */}
              <div className="col-span-1 md:col-span-2">
                <input
                  type="text"
                  placeholder="Nome da Horta"
                  className={`input input-bordered w-full ${
                    errors.nome ? "input-error" : ""
                  }`}
                  value={newHorta.nome}
                  onChange={(e) =>
                    setNewHorta({ ...newHorta, nome: e.target.value })
                  }
                  required
                />
                {errors.nome && (
                  <p className="text-error text-xs">{errors.nome}</p>
                )}
              </div>

              {/* Endereço */}
              <div className="col-span-1 md:col-span-2">
                <input
                  type="text"
                  placeholder="Endereço"
                  className={`input input-bordered w-full ${
                    errors.endereco ? "input-error" : ""
                  }`}
                  value={newHorta.endereco}
                  onChange={(e) =>
                    setNewHorta({ ...newHorta, endereco: e.target.value })
                  }
                  required
                />
                {errors.endereco && (
                  <p className="text-error text-xs">{errors.endereco}</p>
                )}
              </div>

              {/* Gestor */}
              <div className="col-span-1">
                {currentUser.role === "admin" ? (
                  <select
                    className={`select select-bordered w-full ${
                      errors.gestorId ? "select-error" : ""
                    }`}
                    value={newHorta.gestorId}
                    onChange={(e) =>
                      setNewHorta({ ...newHorta, gestorId: e.target.value })
                    }
                    required
                  >
                    <option value="">Selecione um Gestor</option>
                    {gestoresCadastrados.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.nome}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={currentUser.nome}
                    disabled
                    className="input input-bordered w-full bg-base-200 cursor-not-allowed"
                  />
                )}
                {errors.gestorId && (
                  <p className="text-error text-xs">{errors.gestorId}</p>
                )}
              </div>

              {/* Família */}
              <div className="col-span-1">
                <select
                  className={`select select-bordered w-full ${
                    errors.familiaId ? "select-error" : ""
                  }`}
                  value={newHorta.familiaId}
                  onChange={(e) =>
                    setNewHorta({ ...newHorta, familiaId: e.target.value })
                  }
                  required
                >
                  <option value="">Selecione uma Família</option>
                  {familiasCadastradas.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nome}
                    </option>
                  ))}
                </select>
                {errors.familiaId && (
                  <p className="text-error text-xs">{errors.familiaId}</p>
                )}
              </div>

              {/* Coordenadas */}
              <div className="col-span-1 md:col-span-1">
                <input
                  type="text"
                  placeholder="Coordenadas (opcional)"
                  className="input input-bordered w-full"
                  value={newHorta.coordenada}
                  onChange={(e) =>
                    setNewHorta({ ...newHorta, coordenada: e.target.value })
                  }
                />
              </div>

              {/* Área */}
              <div className="col-span-1 md:col-span-1">
                <input
                  type="number"
                  placeholder="Área cultivada (m²)"
                  className="input input-bordered w-full"
                  value={newHorta.areaCultivada}
                  onChange={(e) =>
                    setNewHorta({ ...newHorta, areaCultivada: e.target.value })
                  }
                />
              </div>

              {/* Tipo de Solo */}
              <div className="col-span-1 md:col-span-1">
                <select
                  className={`select select-bordered w-full ${
                    errors.tipoSolo ? "select-error" : ""
                  }`}
                  value={newHorta.tipoSolo}
                  onChange={(e) =>
                    setNewHorta({ ...newHorta, tipoSolo: e.target.value })
                  }
                  required
                >
                  <option value="">Tipo de Solo</option>
                  <option value="Argiloso">Argiloso</option>
                  <option value="Arenoso">Arenoso</option>
                  <option value="Humoso">Humoso</option>
                </select>
                {errors.tipoSolo && (
                  <p className="text-error text-xs">{errors.tipoSolo}</p>
                )}
              </div>

              {/* Tipo de Horta */}
              <div className="col-span-1 md:col-span-1">
                <select
                  className={`select select-bordered w-full ${
                    errors.tipoHorta ? "select-error" : ""
                  }`}
                  value={newHorta.tipoHorta}
                  onChange={(e) =>
                    setNewHorta({ ...newHorta, tipoHorta: e.target.value })
                  }
                  required
                >
                  <option value="">Tipo de Horta</option>
                  <option value="Comunitária">Comunitária</option>
                  <option value="Familiar">Familiar</option>
                  <option value="Escolar">Escolar</option>
                </select>
                {errors.tipoHorta && (
                  <p className="text-error text-xs">{errors.tipoHorta}</p>
                )}
              </div>

              {/* Descrição */}
              <div className="col-span-1 md:col-span-2">
                <textarea
                  placeholder="Descrição (opcional)"
                  className="textarea textarea-bordered w-full"
                  value={newHorta.descricao}
                  onChange={(e) =>
                    setNewHorta({ ...newHorta, descricao: e.target.value })
                  }
                />
              </div>

              {/* Observações */}
              <div className="col-span-1 md:col-span-2">
                <textarea
                  placeholder="Observações (opcional)"
                  className="textarea textarea-bordered w-full"
                  value={newHorta.observacoes}
                  onChange={(e) =>
                    setNewHorta({ ...newHorta, observacoes: e.target.value })
                  }
                />
              </div>

              {/* Botão */}
              <div className="col-span-1 md:col-span-2">
                <button type="submit" className="btn btn-primary mt-2 w-full">
                  Adicionar Horta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GardenPage;
