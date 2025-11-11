import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/stores/useUserStore";
import { useFamiliaStore } from "@/stores/useFamiliaStore";
import { FormModal } from "@/components/ui/FormModal";
import { FormField } from "@/components/layout/FormField";
import { Button } from "@/components/ui/Button";
import FloatingButton from "@/components/layout/FloatingActionButton";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import ResponsiveGrid from "@/components/ui/ResponsiveGrid";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import {
  Users,
  Edit,
  Trash,
  Plus,
  Search,
  Shield,
  Table,
  LayoutGrid,
} from "lucide-react";
import { usuarioSchemaUpdate } from "@/lib/validation/usuarioSchema";

const Usuarios = () => {
  const {
    user,
    users,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    loading,
  } = useUserStore();
  const { familias, fetchFamilias } = useFamiliaStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [viewMode, setViewMode] = useState(isMobile ? "cards" : "table");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingFamilias, setLoadingFamilias] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const modalRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(usuarioSchemaUpdate),
    mode: "all",
    reValidateMode: "all",
    defaultValues: {
      name: "",
      username: "",
      email: "",
      telefone: "",
      endereco: "",
      role: "cultivador",
      familiaId: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users
    .filter((u) => u && typeof u === "object") // garante que não é undefined
    .filter((u) => {
      const query = searchQuery.toLowerCase();
      const visibleToGestor =
        user?.role === "admin" ||
        (user?.role === "gestor" &&
          u.familia &&
          u.familia.gestorId === user?.id);
      const matchesQuery =
        u.nome?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query) ||
        u.username?.toLowerCase().includes(query);
      return visibleToGestor && matchesQuery;
    });

  const handleOpenModal = async (userData = null) => {
    setEditingUser(userData);

    if (!familias || familias.length === 0) {
      setLoadingFamilias(true);
      await fetchFamilias();
      setLoadingFamilias(false);
    }

    reset({
      name: userData?.nome || "",
      username: userData?.username || "",
      email: userData?.email || "",
      telefone: userData?.telefone || "",
      endereco: userData?.endereco || "",
      role: userData?.role || "cultivador",
      familiaId: userData?.familiaId || "",
    });

    modalRef.current?.open();
  };

  const handleSaveUser = async (data) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, data);
      } else {
        await createUser(data);
      }
      await fetchUsers();
      modalRef.current?.close();
      setEditingUser(null);
    } catch (err) {
      console.error("Erro ao salvar usuário:", err);
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este usuário?"
    );
    if (!confirmDelete) return;

    try {
      await deleteUser(id);
      await fetchUsers();
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
    }
  };

  // 📱 Responsividade
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
      <LoadingOverlay loading={loading} message="Carregando usuários..." />
      <LoadingOverlay
        loading={loadingFamilias}
        message="Carregando famílias..."
      />

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Usuários</h1>
          <p className="text-base-content/70 mt-1">
            Gerencie e acompanhe os usuários cadastrados no sistema.
          </p>
        </div>
        {user?.role === "admin" && (
          <Button onClick={() => handleOpenModal(null)} icon={Plus}>
            Adicionar Usuário
          </Button>
        )}
      </div>

      {/* Estatísticas */}
      {!loading && (
        <>
          <ResponsiveGrid columns={3}>
            <StatCard
              title="Total de Usuários"
              value={users.length.toString()}
              description="Usuários cadastrados"
              icon={<Users className="h-6 w-6" />}
            />
            <StatCard
              title="Gestores"
              value={users.filter((u) => u.role === "gestor").length.toString()}
              description="Usuários com função de gestor"
              icon={<Shield className="h-6 w-6" />}
            />
            <StatCard
              title="Cultivadores"
              value={users
                .filter((u) => u.role === "cultivador")
                .length.toString()}
              description="Usuários comuns"
              icon={<Users className="h-6 w-6" />}
            />
          </ResponsiveGrid>

          {/* Filtro */}
          <div className="flex items-center gap-2 px-4 py-2 border border-base-300 rounded-lg shadow-sm bg-base-100 w-full mt-6 mb-4">
            <Search className="h-4 w-4 text-primary/70" />
            <input
              type="text"
              className="grow bg-transparent focus:outline-none text-base-content"
              placeholder="Buscar por nome, e-mail ou usuário..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Botões de visualização */}
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

          {/* Renderização da lista */}
          {viewMode === "table" ? (
            // 🧾 Tabela
            <div className="overflow-x-auto shadow-xl rounded-xl border border-base-200">
              <table className="table w-full table-zebra">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Usuário</th>
                    <th>E-mail</th>
                    <th>Telefone</th>
                    <th>Função</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td>{u.nome}</td>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                        <td>{u.telefone || "-"}</td>
                        <td>
                          <Badge type={u.role}>{u.role}</Badge>
                        </td>
                        <td>
                          <div className="flex justify-center gap-2">
                            <button
                              className="btn btn-ghost btn-sm text-secondary/80 hover:text-primary"
                              onClick={() => handleOpenModal(u)}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              className="btn btn-ghost btn-sm text-error/80 hover:text-error"
                              onClick={() => handleDeleteUser(u.id)}
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
                        colSpan={6}
                        className="py-6 text-base-content/60 italic"
                      >
                        Nenhum usuário encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            // 🧱 Cards
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className="p-4 border border-base-200 rounded-lg shadow-sm hover:shadow-md transition-shadow relative"
                >
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    <button
                      className="btn btn-ghost btn-sm text-primary/80 hover:text-primary"
                      onClick={() => handleOpenModal(u)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm text-error/80 hover:text-error"
                      onClick={() => handleDeleteUser(u.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="font-bold text-lg">{u.nome}</div>
                  <div className="text-xs opacity-60">@{u.username}</div>
                  <div className="text-sm">{u.email}</div>

                  <div className="mt-2">
                    <Badge type={u.role}>{u.role}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 🔹 Modal (oculta senha se estiver editando) */}
          {user?.role === "admin" && (
            <FormModal
              ref={modalRef}
              title={editingUser ? "Editar Usuário" : "Adicionar Usuário"}
              onSubmit={form.handleSubmit(handleSaveUser)}
              submitLabel={editingUser ? "Salvar Alterações" : "Criar Usuário"}
            >
              {loadingFamilias ? (
                <p className="text-center text-base-content/60 italic py-4">
                  Carregando famílias...
                </p>
              ) : (
                <>
                  <FormField
                    type="input"
                    placeholder="Nome completo"
                    name="name"
                    control={form.control}
                  />
                  <FormField
                    type="input"
                    placeholder="Nome de usuário"
                    name="username"
                    control={form.control}
                  />
                  <FormField
                    type="input"
                    placeholder="E-mail"
                    name="email"
                    control={form.control}
                  />

                  <FormField
                    type="input"
                    placeholder="Telefone"
                    name="telefone"
                    control={form.control}
                  />
                  <FormField
                    type="input"
                    placeholder="Endereço"
                    name="endereco"
                    control={form.control}
                  />
                  <FormField
                    type="select"
                    placeholder="Função"
                    name="role"
                    control={form.control}
                    options={[
                      { value: "admin", label: "Administrador" },
                      { value: "gestor", label: "Gestor" },
                      { value: "cultivador", label: "Cultivador" },
                      { value: "voluntario", label: "Voluntário" },
                    ]}
                  />
                  <FormField
                    type="searchable-select"
                    placeholder="Família (opcional)"
                    name="familiaId"
                    control={form.control}
                    options={familias.map((f) => ({
                      value: f.id,
                      label: f.nome,
                    }))}
                  />
                </>
              )}
            </FormModal>
          )}

          {/* Floating Button */}
          {user?.role === "admin" && (
            <FloatingButton
              onClick={() => handleOpenModal(null)}
              tooltip="Adicionar Usuário"
              icon={<Plus className="h-6 w-6 md:h-7 md:w-7" />}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Usuarios;
