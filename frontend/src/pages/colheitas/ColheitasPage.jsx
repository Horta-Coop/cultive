import React, { useState, useMemo, useRef, useEffect } from "react";
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
import StatCard from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormModal } from "@/components/ui/FormModal";
import { FormField } from "@/components/layout/FormField";
import colheitaSchema from "@/lib/validation/colheitaSchema";
import ResponsiveGrid from "@/components/ui/ResponsiveGrid";
import FloatingButton from "@/components/layout/FloatingActionButton";
import Badge from "@/components/ui/Badge";

// dentro de ColheitasPage
const getDestinoVariant = (destino) => {
  if (!destino) return "outline";

  const lower = destino.toLowerCase();

  if (lower.includes("consumo")) return "primary";
  if (lower.includes("doação") || lower.includes("doacao")) return "success";
  if (lower.includes("venda")) return "warning";

  return "outline";
};

const ColheitasPage = () => {
  const modalRef = useRef(null);
  const [colheitas, setColheitas] = useState([
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
  ]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [culturaFilter, setCulturaFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [viewMode, setViewMode] = useState(isMobile ? "cards" : "table");

  const plantiosCadastrados = useMemo(
    () => [
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
    ],
    []
  );

  const form = useForm({
    resolver: zodResolver(colheitaSchema),
    defaultValues: {
      cultura: "",
      dataColheita: "",
      quantidadeColhida: "",
      unidadeMedida: "",
      destinoColheita: "",
      observacoes: "",
      plantioId: "",
    },
    mode: "all",
    reValidateMode: "all",
  });

  const { reset } = form;

  const handleAddColheita = (data) => {
    const plantioSelecionado = plantiosCadastrados.find(
      (p) => p.id === data.plantioId
    );

    const novaColheita = {
      id: crypto.randomUUID(),
      ...data,
      cultura: data.cultura || plantioSelecionado.cultura,
      dataColheita: data.dataColheita
        ? new Date(data.dataColheita)
        : new Date(),
      quantidadeColhida: parseFloat(data.quantidadeColhida),
      unidadeMedida:
        data.unidadeMedida || plantioSelecionado.unidadeMedida || "kg",
      destinoColheita: data.destinoColheita || "consumo",
      observacoes: data.observacoes || "",
      plantioId: plantioSelecionado.id,
      plantio: plantioSelecionado,
    };

    setColheitas((prev) => [...prev, novaColheita]);
    toast.success("Colheita registrada com sucesso!");
    reset();
    modalRef.current?.close();
  };

  const filteredColheitas = useMemo(() => {
    return colheitas.filter((c) => {
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        c.cultura.toLowerCase().includes(query) ||
        c.destinoColheita.toLowerCase().includes(query) ||
        c.unidadeMedida.toLowerCase().includes(query) ||
        c.plantio?.horta?.nome?.toLowerCase().includes(query);

      const matchesCultura = culturaFilter
        ? c.cultura.toLowerCase() === culturaFilter.toLowerCase()
        : true;

      const matchesDate = dateFilter
        ? new Date(c.dataColheita).toISOString().split("T")[0] === dateFilter
        : true;

      const matchesDestino = typeFilter
        ? c.destinoColheita.toLowerCase() === typeFilter.toLowerCase()
        : true;

      return matchesSearch && matchesCultura && matchesDate && matchesDestino;
    });
  }, [colheitas, searchQuery, typeFilter, culturaFilter, dateFilter]);

  const handleEditColheita = (plantio) =>
    console.log("Editar plantio:", plantio);

  const handleDeleteColheita = (id) =>
    setColheitas(colheitas.filter((p) => p.id !== id));

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

  const plantioSelecionadoId = form.watch("plantioId");
  useEffect(() => {
    if (!plantioSelecionadoId) {
      form.setValue("cultura", "", { shouldValidate: true });
      return;
    }

    const plantio = plantiosCadastrados.find(
      (p) => p.id === plantioSelecionadoId
    );

    if (plantio) {
      form.setValue("cultura", plantio.cultura, { shouldValidate: true });
    }
  }, [plantioSelecionadoId, form, plantiosCadastrados]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 relative">
      <Toaster position="top-right" />
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-base-content">
            Registro de Colheitas
          </h1>
          <p className="text-base-content/70 mt-1">
            Acompanhe e registre as colheitas realizadas nas hortas
            comunitárias.
          </p>
        </div>
        <Button onClick={() => modalRef.current?.open()} icon={Plus}>
          Adicionar Colheita
        </Button>
      </div>

      {/* Stats */}
      <ResponsiveGrid>
        <StatCard
          title="Colheitas Totais"
          value={colheitas.length}
          description="Quantidade de colheitas registradas"
          icon={<Sprout className="h-6 w-6 text-primary" />}
        />

        <StatCard
          title="Quantidade Total"
          value={`${colheitas.reduce(
            (acc, c) => acc + (c.quantidadeColhida || 0),
            0
          )} ${colheitas[0]?.unidadeMedida || "kg"}`}
          description="Quantidade total colhida"
          icon={<Scale className="h-6 w-6 text-primary" />}
        />

        <StatCard
          title="Última Colheita"
          value={
            colheitas.length > 0
              ? new Date(
                  Math.max(...colheitas.map((c) => new Date(c.dataColheita)))
                ).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "—"
          }
          icon={<Calendar className="h-6 w-6 text-primary" />}
          smallValue
        />

        <StatCard
          title="Destinos Diferentes"
          value={new Set(colheitas.map((c) => c.destinoColheita)).size}
          description="Quantidade de destinos diferentes"
          icon={<Truck className="h-6 w-6 text-primary" />}
        />
      </ResponsiveGrid>

      {/* Filtros */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 border border-base-300 rounded-lg shadow-sm bg-base-100 w-full">
          <Search className="h-4 w-4 text-primary/70" />
          <input
            type="text"
            placeholder="Buscar por cultura, destino ou observações..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="grow bg-base-100 focus:outline-none text-base-content"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            type="date"
            className="input input-bordered flex-1 w-full sm:w-auto rounded-lg"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />

          <select
            className="select select-bordered flex-1 w-full sm:w-auto rounded-lg"
            value={culturaFilter || ""}
            onChange={(e) => setCulturaFilter(e.target.value || "")}
          >
            <option value="">Filtrar por cultura</option>
            {[...new Set(colheitas.map((c) => c.cultura))].map((cultura) => (
              <option key={cultura} value={cultura}>
                {cultura}
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

      {/* Conteúdo */}
      {viewMode === "table" ? (
        <div className="w-full overflow-x-auto shadow-xl rounded-xl border border-base-200">
          <div className="hidden md:block">
            <table className="table w-full table-zebra table-fixed whitespace-normal break-words">
              <thead>
                <tr>
                  {[
                    "Cultura",
                    "Destino",
                    "Data Colheita",
                    "Quantidade",
                    "Unidade",
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
                {filteredColheitas.length > 0 ? (
                  filteredColheitas.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-base-100/50 transition-colors"
                    >
                      <td className="font-semibold">{c.cultura}</td>
                      <td>
                        <Badge
                          variant={getDestinoVariant(c.destinoColheita)}
                          size="sm"
                        >
                          {c.destinoColheita}
                        </Badge>
                      </td>

                      <td>
                        {new Date(c.dataColheita).toLocaleDateString("pt-BR")}
                      </td>
                      <td>{c.quantidadeColhida}</td>
                      <td>{c.unidadeMedida}</td>
                      <td className="truncate max-w-[150px]">
                        {c.observacoes || "-"}
                      </td>

                      <td className="flex flex-col items-center gap-2">
                        <button
                          className="btn btn-ghost btn-sm text-primary/80 hover:text-primary"
                          onClick={() => handleEditColheita(c)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm text-error/80 hover:text-error"
                          onClick={() => handleDeleteColheita(c.id)}
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
                      Nenhuma colheita encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredColheitas.length > 0 ? (
            filteredColheitas.map((c) => (
              <div
                key={c.id}
                className="p-4 border border-base-200 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col gap-2 relative bg-base-100"
              >
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <button
                    className="btn btn-ghost btn-sm text-primary/80 hover:text-primary"
                    onClick={() => handleEditColheita(c)}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="btn btn-ghost btn-sm text-error/80 hover:text-error"
                    onClick={() => handleDeleteColheita(c.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>

                <div className="font-bold text-lg">{c.cultura}</div>
                <div className="text-xs opacity-60 flex items-center gap-1">
                  {c.plantio?.horta?.nome}
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge
                    variant={getDestinoVariant(c.destinoColheita)}
                  >
                    {c.destinoColheita}
                  </Badge>
                </div>

                <div className="flex flex-col gap-1 text-sm mt-2">
                  <div className="flex gap-1">
                    <span className="font-medium">Data Colheita:</span>{" "}
                    {new Date(c.dataColheita).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="flex gap-1">
                    <span className="font-medium">Quantidade:</span>{" "}
                    {c.quantidadeColhida} {c.unidadeMedida}
                  </div>
                  {c.observacoes && (
                    <div className="flex gap-1">
                      <span className="font-medium">Obs:</span> {c.observacoes}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-6 text-base-content/60 italic">
              Nenhuma colheita encontrada.
            </div>
          )}
        </div>
      )}

      <FormModal
        ref={modalRef}
        title="Adicionar Colheita"
        onSubmit={form.handleSubmit(handleAddColheita)}
        submitLabel="Registrar Colheita"
      >
        <FormField
          type="searchable-select"
          placeholder="Selecione o Plantio"
          name="plantioId"
          control={form.control}
          options={plantiosCadastrados.map((p) => ({
            value: p.id,
            label: p.cultura, // nome da cultura
          }))}
        />

        {/* Cultura colhida */}
        <FormField
          type="input"
          placeholder="Cultura (preenchida pelo plantio)"
          name="cultura"
          control={form.control}
          className="md:col-span-2"
          disabled // não permite edição
        />

        {/* Data da colheita */}
        <FormField
          type="date"
          placeholder="Data da Colheita"
          name="dataColheita"
          control={form.control}
        />

        {/* Quantidade colhida */}
        <FormField
          type="number"
          placeholder="Quantidade Colhida"
          name="quantidadeColhida"
          control={form.control}
        />

        {/* Unidade de medida */}
        <FormField
          type="select"
          placeholder="Unidade de Medida"
          name="unidadeMedida"
          control={form.control}
          options={[
            { value: "kg", label: "kg" },
            { value: "maços", label: "maços" },
            { value: "unidades", label: "unidades" },
          ]}
        />

        {/* Destino da colheita */}
        <FormField
          type="select"
          placeholder="Destino da Colheita"
          name="destinoColheita"
          control={form.control}
          options={[
            { value: "Consumo", label: "Consumo" },
            { value: "Doação", label: "Doação" },
            { value: "Venda", label: "Venda" },
          ]}
        />

        {/* Observações */}
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

export default ColheitasPage;
