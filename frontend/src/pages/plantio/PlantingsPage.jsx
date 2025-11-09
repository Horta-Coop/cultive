import { toast, Toaster } from "react-hot-toast";
import ResponsiveGrid from "../../components/ui/ResponsiveGrid";
import StatCard from "../../components/ui/StatCard";
import { Button } from "../../components/ui/Button";
import {
  Edit,
  LayoutGrid,
  Plus,
  Search,
  Sprout,
  Tractor,
  Trash,
  Table,
} from "lucide-react";
import FloatingButton from "../../components/layout/FloatingActionButton";
import { FormModal } from "../../components/ui/FormModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import plantioSchema from "../../lib/validation/plantioSchema";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormField } from "../../components/layout/FormField";
import Badge from "../../components/ui/Badge";

// Funções de badge
// Retorna a variant do badge para status do plantio
const getStatusVariant = (status) => {
  if (!status) return "outline";

  const lower = status.toLowerCase();

  if (lower.includes("ativo")) return "success";
  if (lower.includes("inativo")) return "error";
  if (lower.includes("pendente")) return "warning";

  return "outline";
};

// Retorna a variant do badge para tipo de plantio
const getTipoPlantioVariant = (tipo) => {
  if (!tipo) return "outline";

  const lower = tipo.toLowerCase();

  if (lower.includes("orgânico") || lower.includes("organico"))
    return "success";
  if (lower.includes("convencional")) return "primary";
  if (lower.includes("hidropônico") || lower.includes("hidroponico"))
    return "info";

  return "outline";
};

const PlantiosPage = () => {
  const modalRef = useRef(null);
  const [plantios, setPlantios] = useState([
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
  ]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [viewMode, setViewMode] = useState(isMobile ? "cards" : "table");

  // Hortas cadastradas
  const hortasCadastradas = [
    { id: "1", nome: "Horta Comunitária Central" },
    { id: "2", nome: "Horta Escola ABC" },
    { id: "3", nome: "Horta Bairro Norte" },
  ];

  const form = useForm({
    resolver: zodResolver(plantioSchema),
    defaultValues: {
      cultura: "",
      tipoPlantacao: "",
      dataInicio: "",
      previsaoColheita: "",
      quantidadePlantada: "",
      unidadeMedida: "kg",
      observacoes: "",
      hortaId: "",
    },
    mode: "all",
  });

  const { reset } = form;

  const handleAddPlantio = (data) => {
    const hortaSelecionada = hortasCadastradas.find(
      (h) => h.id === data.hortaId
    );

    const novoPlantio = {
      id: crypto.randomUUID(),
      ...data,
      quantidadePlantada: parseFloat(data.quantidadePlantada),
      unidadeMedida: data.unidadeMedida || "kg",
      participacaoScore: 0,
      status: "ativo",
      horta: hortaSelecionada,
    };

    setPlantios([...plantios, novoPlantio]);
    toast.success("Plantio adicionado com sucesso!");
    reset();
    modalRef.current?.close();
  };

  const filteredPlantios = useMemo(() => {
    return plantios.filter((p) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        p.cultura.toLowerCase().includes(query) ||
        p.tipoPlantacao.toLowerCase().includes(query) ||
        p.horta?.nome?.toLowerCase().includes(query);

      // Aplica o filtro de status, se houver
      const matchesStatus = typeFilter ? p.status === typeFilter : true;

      return matchesSearch && matchesStatus;
    });
  }, [plantios, searchQuery, typeFilter]);

  const uniquePlantioStatus = useMemo(
    () => [...new Set(plantios.map((p) => p.status).filter(Boolean))],
    [plantios]
  );

  const handleEditPlantio = (plantio) =>
    console.log("Editar plantio:", plantio);

  const handleDeletePlantio = (id) =>
    setPlantios(plantios.filter((p) => p.id !== id));

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setViewMode("cards");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleSidebarToggle = (e) => {
      const sidebarOpenState = e.detail;
      setSidebarOpen(sidebarOpenState);

      const isMedium = window.innerWidth < 1024;

      if (!sidebarOpenState && !isMobile) {
        setViewMode("table");
      }

      if (sidebarOpenState && isMedium) {
        setViewMode("cards");
      }
    };

    window.addEventListener("sidebar-toggle", handleSidebarToggle);
    return () =>
      window.removeEventListener("sidebar-toggle", handleSidebarToggle);
  }, [isMobile, setViewMode]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 relative">
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
        <Button onClick={() => modalRef.current?.open()} icon={Plus}>
          Adicionar Plantio
        </Button>
      </div>

      {/* Stats */}
      <ResponsiveGrid>
        <StatCard
          title="Plantios Totais"
          value={plantios.length.toString()}
          description="Plantios cadastrados"
          icon={<LayoutGrid className="h-6 w-6" />}
        />
        <StatCard
          title="Culturas Diferentes"
          value={new Set(plantios.map((p) => p.cultura)).size.toString()}
          description="Tipos de culturas"
          icon={<Sprout className="h-6 w-6" />}
        />
        <StatCard
          title="Plantios Ativos"
          value={plantios.filter((p) => p.status === "ativo").length.toString()}
          description="Plantios em andamento"
          icon={<Tractor className="h-6 w-6" />}
        />
        <StatCard
          title="Plantios Ativos"
          value={plantios.filter((p) => p.status === "ativo").length.toString()}
          description="Plantios em andamento"
          icon={<Tractor className="h-6 w-6" />}
        />
        <StatCard
          title="Plantios Ativos"
          value={plantios.filter((p) => p.status === "ativo").length.toString()}
          description="Plantios em andamento"
          icon={<Tractor className="h-6 w-6" />}
        />
      </ResponsiveGrid>

      {/* Filtros */}
      <div className="flex flex-col gap-4 mb-6">
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

        <div className="flex flex-wrap gap-2">
          <select
            className="select select-bordered flex-1 w-full sm:w-auto rounded-lg"
            value={typeFilter || ""}
            onChange={(e) => setTypeFilter(e.target.value || "")}
          >
            <option value="">Filtrar por status</option>
            {uniquePlantioStatus.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-start gap-2 mb-4">
        <button
          className={`btn btn-sm ${
            viewMode === "table" ? "btn-primary" : "btn-outline border-base-300"
          }`}
          onClick={() => setViewMode("table")}
          disabled={isMobile || sidebarOpen}
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
        <div className="w-full overflow-x-auto shadow-xl rounded-xl border border-base-200">
          <div className="hidden md:block">
            <table className="table w-full table-zebra table-fixed whitespace-normal break-words">
              <thead>
                <tr>
                  <th className="text-xs uppercase font-semibold tracking-wider whitespace-normal break-words text-center">
                    Cultura
                  </th>

                  <th className="hidden lg:table-cell text-xs uppercase font-semibold tracking-wider whitespace-normal break-words text-center">
                    Tipo Plantio
                  </th>
                  {[
                    "Data Início",
                    "Previsão Colheita",
                    "Data Colheita",
                    "Quantidade",
                    "Status",
                    "Observações",
                    "Ações",
                  ].map((col) => (
                    <th
                      key={col}
                      className="text-xs uppercase font-semibold tracking-wider whitespace-normal break-words text-center"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredPlantios.length > 0 ? (
                  filteredPlantios.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-base-100/50 transition-colors"
                    >
                      <td>
                        <div className="font-semibold">{p.cultura}</div>
                        <div className="text-xs opacity-60 flex items-center gap-1">
                          <span>{p.horta?.nome}</span>
                        </div>
                        {/* Badge para visualização em telas pequenas */}
                        <div className="mt-2 block md:block lg:hidden">
                          <Badge
                            variant={getTipoPlantioVariant(p.tipoPlantacao)}
                          >
                            {p.tipoPlantacao}
                          </Badge>
                        </div>
                      </td>
                      <td className="hidden lg:table-cell text-center">
                        <Badge variant={getTipoPlantioVariant(p.tipoPlantacao)}>
                          {p.tipoPlantacao}
                        </Badge>
                      </td>

                      <td>
                        {new Date(p.dataInicio).toLocaleDateString("pt-BR")}
                      </td>
                      <td>
                        {new Date(p.previsaoColheita).toLocaleDateString(
                          "pt-BR"
                        )}
                      </td>
                      <td>
                        {p.dataColheita
                          ? new Date(p.dataColheita).toLocaleDateString("pt-BR")
                          : "-"}
                      </td>
                      <td>{`${p.quantidadePlantada} ${p.unidadeMedida}`}</td>
                      <td className="text-center">
                        <Badge variant={getStatusVariant(p.status)}>
                          {p.status}
                        </Badge>
                      </td>

                      <td className="truncate max-w-[150px]">
                        {p.observacoes || "-"}
                      </td>
                      <td className="flex flex-col  items-center gap-2">
                        <button
                          className="btn btn-ghost btn-sm text-primary/80 hover:text-primary"
                          onClick={() => handleEditPlantio(p)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm text-error/80 hover:text-error"
                          onClick={() => handleDeletePlantio(p.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center py-6 text-base-content/60 italic"
                    >
                      Nenhum plantio encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards responsivos */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlantios.length > 0 ? (
            filteredPlantios.map((p) => (
              <div
                key={p.id}
                className="p-4 border border-base-200 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2 relative"
              >
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <button
                    className="btn btn-ghost btn-sm text-primary/80 hover:text-primary"
                    onClick={() => handleEditPlantio(p)}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="btn btn-ghost btn-sm text-error/80 hover:text-error"
                    onClick={() => handleDeletePlantio(p.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
                <div className="font-bold text-lg">{p.cultura}</div>
                <div className="text-xs opacity-60 flex items-center gap-1">
                  {p.horta?.nome}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant={getTipoPlantioVariant(p.tipoPlantacao)}>
                    {p.tipoPlantacao}
                  </Badge>
                  <Badge variant={getStatusVariant(p.status)}>{p.status}</Badge>
                </div>

                <div className="flex flex-col gap-1 text-sm mt-2">
                  <div className="flex gap-1">
                    <span className="font-medium">Início:</span>{" "}
                    {new Date(p.dataInicio).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="flex gap-1">
                    <span className="font-medium">Previsão:</span>{" "}
                    {new Date(p.previsaoColheita).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="flex gap-1">
                    <span className="font-medium">Colheita:</span>{" "}
                    {p.dataColheita
                      ? new Date(p.dataColheita).toLocaleDateString("pt-BR")
                      : "-"}
                  </div>
                  <div className="flex gap-1">
                    <span className="font-medium">Qtd:</span>{" "}
                    {p.quantidadePlantada} {p.unidadeMedida}
                  </div>
                  {p.observacoes && (
                    <div className="flex gap-1">
                      <span className="font-medium">Obs:</span> {p.observacoes}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-6 text-base-content/60 italic">
              Nenhum plantio encontrado.
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <FormModal
        ref={modalRef}
        title="Adicionar Plantio"
        onSubmit={form.handleSubmit(handleAddPlantio)}
        submitLabel="Salvar Plantio"
      >
        <FormField
          type="input"
          placeholder="Cultura"
          name="cultura"
          control={form.control}
          className="md:col-span-2"
        />
        <FormField
          type="select"
          placeholder="Tipo de Plantio"
          name="tipoPlantacao"
          control={form.control}
          options={[
            { value: "Orgânico", label: "Orgânico" },
            { value: "Convencional", label: "Convencional" },
            { value: "Hidropônico", label: "Hidropônico" },
          ]}
        />
        <FormField
          type="date"
          placeholder="Data de Início"
          name="dataInicio"
          control={form.control}
        />
        <FormField
          type="date"
          placeholder="Previsão de Colheita"
          name="previsaoColheita"
          control={form.control}
        />
        <FormField
          type="number"
          placeholder="Quantidade Plantada"
          name="quantidadePlantada"
          control={form.control}
        />
        <FormField
          type="select"
          placeholder="Unidade de Medida"
          name="unidadeMedida"
          control={form.control}
          options={[
            { value: "kg", label: "kg" },
            { value: "un", label: "un" },
            { value: "m²", label: "m²" },
          ]}
        />
        <FormField
          type="select"
          placeholder="Selecione a Horta"
          name="hortaId"
          control={form.control}
          options={hortasCadastradas.map((h) => ({
            value: h.id,
            label: h.nome,
          }))}
        />
        <FormField
          type="textarea"
          placeholder="Observações (opcional)"
          name="observacoes"
          control={form.control}
          className="md:col-span-2"
        />
      </FormModal>

      <FloatingButton
        onClick={() => modalRef.current?.open()}
        tooltip="Adicionar Plantio"
        icon={<Plus className="h-6 w-6 md:h-7 md:w-7" />}
      />
    </div>
  );
};

export default PlantiosPage;
