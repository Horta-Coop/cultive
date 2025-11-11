import React, { useState, useMemo, useEffect, useRef } from "react";
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
  Eye,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import ResponsiveGrid from "@/components/ui/ResponsiveGrid";
import { toast, Toaster } from "react-hot-toast";
import FloatingButton from "@/components/layout/FloatingActionButton";
import hortaSchema from "@/lib/validation/hortaSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/layout/FormField";
import { FormModal } from "@/components/ui/FormModal";
import { Button } from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useNavigate } from "react-router-dom";
import { useHortaStore } from "@/stores/useHortaStore";
import { useUserStore } from "@/stores/useUserStore";
import { useFamiliaStore } from "@/stores/useFamiliaStore";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { EHortaEnum } from "../../lib/validation/hortaSchema";

const GardenPage = () => {
  const { user, checkinAuth, fetchUsers, users } = useUserStore(
    (state) => state
  );
  const { hortas, fetchHortas, createHorta, updateHorta, deleteHorta } =
    useHortaStore((state) => state);
  const { familias, fetchFamilias } = useFamiliaStore((state) => state);

  const navigate = useNavigate();
  const modalRef = useRef(null);

  const [editingHorta, setEditingHorta] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [viewMode, setViewMode] = useState(isMobile ? "cards" : "table");
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false); // ⬅️ loading do modal

  const form = useForm({
    resolver: zodResolver(hortaSchema),
    defaultValues: {
      nome: "",
      endereco: "",
      coordenada: "",
      areaCultivada: "",
      tipoSolo: "",
      tipoHorta: "",
      descricao: "",
      observacoes: "",
      gestorId: user?.role === "gestor" ? user?.id : "",
      familiaId: "",
    },
    mode: "all",
  });

  const { reset } = form;

  useEffect(() => {
    if (!user && !checkinAuth) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        await fetchHortas();
      } catch {
        toast.error("Erro ao carregar hortas");
      } finally {
        setLoading(false);
      }
    };

    if (user) loadData();
  }, [fetchHortas, user, navigate, checkinAuth]);

  const filteredHortas = useMemo(() => {
    return hortas.filter((h) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        h.nome.toLowerCase().includes(query) ||
        h.endereco.toLowerCase().includes(query) ||
        h.gestor?.nome?.toLowerCase().includes(query);
      const matchesType = typeFilter ? h.tipoHorta === typeFilter : true;
      return matchesSearch && matchesType;
    });
  }, [hortas, searchQuery, typeFilter]);

  const uniqueHortaTypes = useMemo(() => EHortaEnum.options, []);

  const handleOpenModal = async (horta = null) => {
    setModalLoading(true);
    try {
      if (user?.role === "admin") {
        await fetchUsers({ role: "gestor" });
      }
      await fetchFamilias();

      if (horta) {
        setEditingHorta(horta);
      } else {
        setEditingHorta({
          nome: "",
          endereco: "",
          coordenada: "",
          areaCultivada: "",
          tipoSolo: "",
          tipoHorta: "",
          descricao: "",
          observacoes: "",
          gestorId: user?.role === "gestor" ? user.id : "",
          familiaId: "",
        });
      }

      modalRef.current?.open();
    } catch (err) {
      toast.error("Erro ao preparar formulário");
    } finally {
      setModalLoading(false);
    }
  };

  const handleSaveHorta = async (data) => {
    try {
      if (editingHorta?.id) {
        await updateHorta(editingHorta.id, data);
        toast.success("Horta atualizada com sucesso!");
      } else {
        await createHorta(data);
        toast.success("Horta criada com sucesso!");
      }

      await fetchHortas();
      modalRef.current?.close();
      setEditingHorta(null);
    } catch (err) {
      toast.error("Erro ao salvar horta");
    }

    reset();
  };

  const handleViewHorta = (id) => {
    navigate(`/hortas/${id}`);
  };

  const handleDeleteHorta = async (id) => {
    try {
      await deleteHorta(id);
      toast.success("Horta removida com sucesso!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao deletar horta");
    }
  };

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
      <LoadingOverlay loading={loading} message="Carregando hortas..." />
      <LoadingOverlay
        loading={modalLoading}
        message="Preparando formulário..."
      />{" "}
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
        {["admin", "gestor"].includes(user?.role) && (
          <Button onClick={() => handleOpenModal(null)} icon={Plus}>
            Adicionar Horta
          </Button>
        )}
      </div>
      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-base-100/80 backdrop-blur-sm z-50">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <span className="text-lg text-base-content/70 mt-4">
            Carregando hortas...
          </span>
        </div>
      )}
      {!loading && (
        <div>
          {/* Stats */}
          <ResponsiveGrid columns={3}>
            {user?.role === "admin" && (
              <>
                <StatCard
                  title="Hortas Totais"
                  value={hortas.length.toString()}
                  description="Hortas cadastradas no sistema"
                  icon={<LayoutGrid className="h-6 w-6" />}
                />
                <StatCard
                  title="Área Total Cultivada"
                  value={`${hortas
                    .reduce((acc, h) => acc + h.areaCultivada, 0)
                    .toFixed(1)} m²`}
                  description="Somatório da área de todas as hortas"
                  icon={<Sprout className="h-6 w-6" />}
                />
                <StatCard
                  title="Gestores Ativos"
                  value={new Set(
                    hortas.map((h) => h.gestor.nome)
                  ).size.toString()}
                  description="Gestores com hortas registradas"
                  icon={<Tractor className="h-6 w-6" />}
                />
              </>
            )}

            {user?.role === "gestor" && (
              <>
                <StatCard
                  title="Minhas Hortas"
                  value={hortas.length.toString()}
                  description="Hortas sob minha gestão"
                  icon={<LayoutGrid className="h-6 w-6" />}
                />
                <StatCard
                  title="Área Cultivada Total"
                  value={`${hortas
                    .reduce((acc, h) => acc + h.areaCultivada, 0)
                    .toFixed(1)} m²`}
                  description="Soma das áreas das suas hortas"
                  icon={<Sprout className="h-6 w-6" />}
                />
                <StatCard
                  title="Média por Horta"
                  value={`${(
                    hortas.reduce((acc, h) => acc + h.areaCultivada, 0) /
                    (hortas.length || 1)
                  ).toFixed(1)} m²`}
                  description="Média da área cultivada por horta"
                  icon={<AreaChart className="h-6 w-6" />}
                />
              </>
            )}

            {["cultivador", "voluntario"].includes(user?.role) && (
              <>
                <StatCard
                  title="Hortas da Família"
                  value={hortas.length.toString()}
                  description="Hortas em que você atua"
                  icon={<LayoutGrid className="h-6 w-6" />}
                />
                <StatCard
                  title="Área Total Envolvida"
                  value={`${hortas
                    .reduce((acc, h) => acc + h.areaCultivada, 0)
                    .toFixed(1)} m²`}
                  description="Área total cultivada pela família"
                  icon={<Sprout className="h-6 w-6" />}
                />
                <StatCard
                  title="Tipo de Horta Mais Comum"
                  value={
                    hortas.length
                      ? Object.entries(
                          hortas.reduce((acc, h) => {
                            acc[h.tipoHorta] = (acc[h.tipoHorta] || 0) + 1;
                            return acc;
                          }, {})
                        ).sort((a, b) => b[1] - a[1])[0][0]
                      : "—"
                  }
                  description="Tipo predominante entre suas hortas"
                  icon={<LayoutGrid className="h-6 w-6" />}
                />
              </>
            )}
          </ResponsiveGrid>

          {/* Filtros */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 border border-base-300 rounded-lg shadow-sm bg-base-100 w-full">
              <Search className="h-4 w-4 text-primary/70" />
              <input
                type="text"
                className="grow bg-transparent focus:outline-none text-base-content"
                placeholder="Buscar nome, endereço ou gestor..."
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
                <option value="">Todos os Tipos</option>
                {uniqueHortaTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() +
                      type.slice(1).replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-start gap-2 mb-4">
            <button
              className={`btn btn-sm ${
                viewMode === "table"
                  ? "btn-primary"
                  : "btn-outline border-base-300"
              }`}
              onClick={() => setViewMode("table")}
              disabled={isMobile || sidebarOpen}
            >
              <Table className="h-4 w-4 mr-1" /> Tabela
            </button>
            <button
              className={`btn btn-sm ${
                viewMode === "cards"
                  ? "btn-primary"
                  : "btn-outline border-base-300"
              }`}
              onClick={() => setViewMode("cards")}
            >
              <LayoutGrid className="h-4 w-4 mr-1" /> Cards
            </button>
          </div>

          {/* Tabela ou Cards */}
          {viewMode === "table" ? (
            <div className="overflow-x-auto shadow-xl rounded-xl border border-base-200">
              <div className="hidden md:block">
                <table className="table w-full table-zebra table-fixed whitespace-normal break-words">
                  <thead>
                    <tr>
                      {[
                        "Horta",
                        "Tipo",
                        user.role === "gestor" ? null : "Gestor",
                        "Área (m²)",
                        "Solo",
                        "Família",
                        "Ações",
                      ]
                        .filter(Boolean)
                        .map((col) => (
                          <th
                            key={col}
                            className="text-xs uppercase font-semibold tracking-wider whitespace-normal break-words text-center"
                          >
                            {col}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {filteredHortas.length > 0 ? (
                      filteredHortas.map((horta) => (
                        <tr
                          key={horta.id}
                          className="hover:bg-base-100/50 transition-colors text-center"
                        >
                          <td className="align-middle">
                            <div className="font-semibold">{horta.nome}</div>
                            <div className="text-xs opacity-60 flex items-center justify-center gap-1">
                              <MapPin className="h-3 w-3" /> {horta.endereco}
                            </div>
                          </td>

                          <td className="align-middle">
                            <Badge type={horta.tipoHorta}>
                              {horta.tipoHorta}
                            </Badge>
                          </td>

                          {user.role === "admin" && (
                            <td className="align-middle">
                              {horta.gestor.nome}
                            </td>
                          )}

                          <td className="align-middle">
                            <div className="flex items-center justify-center gap-1">
                              <AreaChart className="h-4 w-4 text-info" />{" "}
                              {horta.areaCultivada.toFixed(1)}
                            </div>
                          </td>

                          <td className="align-middle">
                            <Badge type={horta.tipoSolo}>
                              {horta.tipoSolo}
                            </Badge>
                          </td>

                          <td className="align-middle">{horta.familia.nome}</td>

                          <td className="align-middle">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <button
                                className="btn btn-ghost btn-sm text-info/80 hover:text-info"
                                onClick={() => handleViewHorta(horta.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                className="btn btn-ghost btn-sm text-secondary/80 hover:text-primary"
                                onClick={() => handleOpenModal(horta)}
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
                          <Badge type={horta.tipoHorta}>
                            {horta.tipoHorta}
                          </Badge>
                          <Badge type={horta.tipoSolo}>{horta.tipoSolo}</Badge>
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
                          className="btn btn-ghost btn-sm text-info/80 hover:text-info"
                          onClick={() => handleViewHorta(horta.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm text-secondary/80 hover:text-primary"
                          onClick={() => handleOpenModal(horta)}
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
                      className="btn btn-ghost btn-sm text-info/80 hover:text-info"
                      onClick={() => handleViewHorta(horta.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm text-primary/80 hover:text-primary"
                      onClick={() => handleOpenModal(horta)}
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
                    <Badge type={horta.tipoHorta}>{horta.tipoHorta}</Badge>
                    <Badge type={horta.tipoSolo}>{horta.tipoSolo}</Badge>
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
          <FormModal
            ref={modalRef}
            title={editingHorta ? "Editar Horta" : "Adicionar Horta"}
            onSubmit={form.handleSubmit(handleSaveHorta)}
            submitLabel={editingHorta ? "Salvar Alterações" : "Adicionar Horta"}
          >
            <FormField
              type="input"
              placeholder="Nome da Horta"
              name="nome"
              control={form.control}
              className="md:col-span-2"
            />
            <FormField
              type="input"
              placeholder="Endereço"
              name="endereco"
              control={form.control}
              className="md:col-span-2"
            />

            {user?.role === "admin" ? (
              <FormField
                type="searchable-select"
                placeholder="Selecione um Gestor"
                name="gestorId"
                control={form.control}
                options={users
                  .filter((u) => u.role === "gestor")
                  .map((g) => ({
                    value: g.id,
                    label: g.nome,
                  }))}
              />
            ) : (
              <input
                type="text"
                value={user?.nome}
                disabled
                className="input input-bordered w-full bg-base-200 cursor-not-allowed col-span-1"
              />
            )}

            <FormField
              type="searchable-select"
              placeholder="Selecione uma Família"
              name="familiaId"
              control={form.control}
              options={familias.map((f) => ({
                value: f.id,
                label: f.nome,
              }))}
            />

            <FormField
              type="input"
              placeholder="Coordenadas (opcional)"
              name="coordenada"
              control={form.control}
            />
            <FormField
              type="number"
              placeholder="Área cultivada (m²)"
              name="areaCultivada"
              control={form.control}
            />
            <FormField
              type="select"
              placeholder="Tipo de Solo"
              name="tipoSolo"
              control={form.control}
              options={[
                { value: "Argiloso", label: "Argiloso" },
                { value: "Arenoso", label: "Arenoso" },
                { value: "Humoso", label: "Humoso" },
              ]}
            />
            <FormField
              type="select"
              name="tipoHorta"
              control={form.control}
              placeholder="Selecione o tipo de horta"
              options={EHortaEnum.options.map((tipo) => ({
                value: tipo,
                label:
                  tipo.charAt(0).toUpperCase() +
                  tipo.slice(1).replace("_", " "),
              }))}
            />

            <FormField
              type="textarea"
              placeholder="Descrição (opcional)"
              name="descricao"
              control={form.control}
              className="md:col-span-2"
            />
            <FormField
              type="textarea"
              placeholder="Observações (opcional)"
              name="observacoes"
              control={form.control}
              className="md:col-span-2"
            />
          </FormModal>

          {["admin", "gestor"].includes(user?.role) && (
            <FloatingButton
              onClick={() => handleOpenModal(null)}
              tooltip="Adicionar Horta"
              icon={<Plus className="h-6 w-6 md:h-7 md:w-7" />}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default GardenPage;
