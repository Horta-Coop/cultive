import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { familiaSchema } from "@/lib/validation/familiaSchema";
import { useFamiliaStore } from "@/stores/useFamiliaStore";
import { useUserStore } from "@/stores/useUserStore";
import { FormModal } from "@/components/ui/FormModal";
import { FormField } from "@/components/layout/FormField";
import { Button } from "@/components/ui/Button";
import ResponsiveGrid from "@/components/ui/ResponsiveGrid";
import StatCard from "@/components/ui/StatCard";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import Badge from "@/components/ui/Badge";
import FloatingButton from "@/components/layout/FloatingActionButton";
import {
  Users,
  Edit,
  Trash,
  Plus,
  Search,
  Award,
  UserCheck,
  Table,
  LayoutGrid,
  User,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";

const Familias = () => {
  const { user, fetchUsers, users } = useUserStore();
  const {
    familias,
    fetchFamilias,
    createFamilia,
    updateFamilia,
    deleteFamilia,
  } = useFamiliaStore();

  const modalRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingFamilia, setEditingFamilia] = useState(null);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [viewMode, setViewMode] = useState(isMobile ? "cards" : "table");
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(familiaSchema),
    defaultValues: {
      nome: "",
      representante: "",
      qtdMembros: 1,
      descricao: "",
      gestorId: "",
    },
  });

  const { reset, control, handleSubmit } = form;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await fetchFamilias();
      } catch {
        toast.error("Erro ao carregar famílias");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleOpenModal = async (familia = null) => {
    setModalLoading(true);
    try {
      setEditingFamilia(familia);

      if (!usersLoaded) {
        await fetchUsers();
        setUsersLoaded(true);
      }

      reset({
        nome: familia?.nome || "",
        representante: familia?.representante || "",
        qtdMembros: familia?.qtdMembros || 1,
        descricao: familia?.descricao || "",
        gestorId: familia?.gestorId || "",
      });

      modalRef.current?.open();
    } catch {
      toast.error("Erro ao preparar formulário");
    } finally {
      setModalLoading(false);
    }
  };

  const gestores = users.filter((u) => u.role === "gestor");
  const usuarios = users.filter((u) =>
    ["cultivador", "voluntario"].includes(u.role)
  );

  // Se for gestor, mostra só suas famílias
  const visibleFamilias =
    user.role === "gestor"
      ? familias.filter((f) => f.gestorId === user.id)
      : familias;

  const filteredFamilias = visibleFamilias.filter((f) => {
    const query = searchQuery.toLowerCase();
    return (
      f.nome?.toLowerCase().includes(query) ||
      f.representante?.toLowerCase().includes(query)
    );
  });

  const handleSaveFamilia = async (data) => {
    try {
      const payload = {
        ...data,
        gestorId: user.role === "gestor" ? user.id : data.gestorId,
      };

      if (editingFamilia) {
        await updateFamilia(editingFamilia.id, payload);
      } else {
        await createFamilia(payload);
      }

      await fetchFamilias();
      modalRef.current?.close();
      setEditingFamilia(null);
      toast.success("Família salva com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar família:", err);
      toast.error("Erro ao salvar família.");
    }
  };

  const handleDeleteFamilia = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta família?")) return;
    try {
      await deleteFamilia(id);
      await fetchFamilias();
      toast.success("Família removida.");
    } catch {
      toast.error("Erro ao excluir família.");
    }
  };

  const totalFamilias = familias.length;
  const mediaMembros =
    totalFamilias > 0
      ? Math.round(
          familias.reduce((acc, f) => acc + (f.qtdMembros || 0), 0) /
            totalFamilias
        )
      : 0;
  const gestoresComFamilias = [
    ...new Set(familias.map((f) => f.gestor?.id).filter(Boolean)),
  ].length;

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setViewMode("cards");
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

      if (!sidebarOpenState && !isMobile) setViewMode("table");
      if (sidebarOpenState && isMedium) setViewMode("cards");
    };

    window.addEventListener("sidebar-toggle", handleSidebarToggle);
    return () =>
      window.removeEventListener("sidebar-toggle", handleSidebarToggle);
  }, [isMobile]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 relative">
      <LoadingOverlay loading={loading} message="Carregando famílias..." />
      <LoadingOverlay
        loading={modalLoading}
        message="Preparando formulário..."
      />

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Famílias</h1>
          <p className="text-base-content/70 mt-1">
            Gerencie as famílias participantes da horta comunitária.
          </p>
        </div>

        {(user?.role === "admin" || user?.role === "gestor") && (
          <Button onClick={() => handleOpenModal(null)} icon={Plus}>
            Adicionar Família
          </Button>
        )}
      </div>

      {/* Estatísticas */}
      {!loading && (
        <>
          <ResponsiveGrid columns={user.role === "admin" ? 3 : 2}>
            <StatCard
              title="Total"
              value={totalFamilias.toString()}
              description="Famílias cadastradas"
              icon={<Users className="h-6 w-6" />}
            />
            <StatCard
              title="Média de Membros"
              value={mediaMembros.toString()}
              description="Por família"
              icon={<UserCheck className="h-6 w-6" />}
            />
            {user.role === "admin" && (
              <StatCard
                title="Gestores Ativos"
                value={gestoresComFamilias.toString()}
                description="Com famílias vinculadas"
                icon={<Award className="h-6 w-6" />}
              />
            )}
          </ResponsiveGrid>

          {/* Filtro */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 border border-base-300 rounded-lg shadow-sm bg-base-100 w-full">
              <Search className="h-4 w-4 text-primary/70" />
              <input
                type="text"
                className="grow bg-transparent focus:outline-none text-base-content"
                placeholder="Buscar por nome ou representante..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Alternância de visualização */}
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

          {/* Renderização */}
          {viewMode === "table" ? (
            <div className="overflow-x-auto shadow-xl rounded-xl border border-base-200">
              <div className="hidden md:block">
                <table className="table w-full table-zebra table-fixed whitespace-normal break-words">
                  <thead>
                    <tr>
                      {[
                        "Nome",
                        "Representante",
                        "Membros",
                        user?.role === "admin" && "Gestor",
                        "Descrição",
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
                    {filteredFamilias.length > 0 ? (
                      filteredFamilias.map((f) => (
                        <tr
                          key={f.id}
                          className="hover:bg-base-100/50 transition-colors text-center"
                        >
                          <td className="align-middle">{f.nome}</td>
                          <td className="align-middle">{f.representante}</td>
                          <td className="align-middle">{f.qtdMembros}</td>
                          {user.role === "admin" && (
                            <td className="align-middle">
                              {f.gestor?.nome || "-"}
                            </td>
                          )}
                          <td className="align-middle">{f.descricao || "-"}</td>
                          <td className="align-middle">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <button
                                className="btn btn-ghost btn-sm text-info/80 hover:text-info"
                                onClick={() => "#"}
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                className="btn btn-ghost btn-sm text-secondary/80 hover:text-primary"
                                onClick={() => handleOpenModal(f)}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              {(user.role === "admin" ||
                                user.role === "gestor") && (
                                <button
                                  className="btn btn-ghost btn-sm text-error/80 hover:text-error"
                                  onClick={() => handleDeleteFamilia(f.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={user.role === "admin" ? 6 : 5}
                          className="py-6 text-base-content/60 italic"
                        >
                          Nenhuma família encontrada.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFamilias.map((f) => (
                <div
                  key={f.id}
                  className="p-4 border border-base-200 rounded-lg shadow-sm hover:shadow-md transition-shadow relative"
                >
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    <button
                      className="btn btn-ghost btn-sm text-primary/80 hover:text-primary"
                      onClick={() => handleOpenModal(f)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    {(user.role === "admin" || user.role === "gestor") && (
                      <button
                        className="btn btn-ghost btn-sm text-error/80 hover:text-error"
                        onClick={() => handleDeleteFamilia(f.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="font-bold text-lg flex items-center gap-2">
                    <User className="h-4 w-4 text-primary/70" />
                    {f.nome}
                  </div>
                  <div className="text-xs opacity-60">
                    Representante: {f.representante}
                  </div>
                  <div className="mt-2">
                    <Badge type="info">{f.qtdMembros} membros</Badge>
                  </div>
                  {user.role === "admin" && f.gestor && (
                    <div className="mt-1 text-xs opacity-60">
                      Gestor:{" "}
                      <span className="font-medium">{f.gestor.nome}</span>
                    </div>
                  )}
                  {f.descricao && (
                    <p className="mt-2 text-sm text-base-content/70 truncate">
                      {f.descricao}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Modal */}
          {(user?.role === "admin" || user?.role === "gestor") && (
            <FormModal
              ref={modalRef}
              title={
                editingFamilia ? "Editar Família" : "Adicionar Nova Família"
              }
              onSubmit={handleSubmit(handleSaveFamilia)}
              submitLabel={editingFamilia ? "Salvar Alterações" : "Criar"}
            >
              <FormField
                type="input"
                placeholder="Nome da Família"
                name="nome"
                control={control}
              />
              <FormField
                type="searchable-select"
                placeholder="Nome do Representante"
                name="representante"
                control={control}
                options={usuarios.map((u) => ({
                  value: u.nome,
                  label: u.nome,
                }))}
              />
              <FormField
                type="number"
                placeholder="Quantidade de Membros"
                name="qtdMembros"
                control={control}
              />
              <FormField
                type="textarea"
                placeholder="Descrição (opcional)"
                name="descricao"
                control={control}
              />
              {user?.role === "admin" && (
                <FormField
                  type="searchable-select"
                  placeholder="Selecione o Gestor"
                  name="gestorId"
                  control={control}
                  options={gestores.map((g) => ({
                    value: g.id,
                    label: g.nome || g.username,
                  }))}
                />
              )}
            </FormModal>
          )}

          {/* Botão Flutuante */}
          {(user?.role === "admin" || user?.role === "gestor") && (
            <FloatingButton
              onClick={() => handleOpenModal(null)}
              tooltip="Adicionar Família"
              icon={<Plus className="h-6 w-6 md:h-7 md:w-7" />}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Familias;
