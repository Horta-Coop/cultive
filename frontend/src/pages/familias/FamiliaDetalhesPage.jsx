"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFamiliaStore } from "@/stores/useFamiliaStore";
import { useUserStore } from "@/stores/useUserStore";
import { FormModal } from "@/components/ui/FormModal";
import { FormField } from "@/components/layout/FormField";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import {
  ArrowLeft,
  Users,
  Sprout,
  ClipboardList,
  UserCog,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

const FamiliaDetalhesPage = () => {
  const { id } = useParams();
  const { selectedFamilia, getFamiliaById, loading } = useFamiliaStore();
  const { fetchUsers, updateUser, user } = useUserStore();

  const addMemberModalRef = useRef(null);
  const userForm = useForm({ defaultValues: { userIds: [] } });

  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) getFamiliaById(id);
  }, [id]);

  if (loading) {
    return <LoadingOverlay loading={loading} message="Carregando família..." />;
  }

  if (!selectedFamilia) {
    return (
      <div className="text-center mt-20 text-base-content/70">
        Família não encontrada.
      </div>
    );
  }

  const familia = selectedFamilia;

  const handleOpenAddMemberModal = async () => {
    setLoadingUsers(true);
    try {
      await fetchUsers();
      const updatedUsers = useUserStore.getState().users;
      const available = updatedUsers.filter(
        (u) =>
          !["admin"].includes(u.role) &&
          u.familiaId !== familia.id &&
          u.id !== user.id
      );

      setAvailableUsers(available);

      userForm.reset({ userIds: [] });

      addMemberModalRef.current?.open();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar usuários.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAddMembers = async (data) => {
    const userIds = data.userIds.map((u) => u.value);
    if (userIds.length === 0) {
      toast.error("Selecione ao menos um usuário.");
      return;
    }

    try {
      setSubmitting(true);
      await Promise.all(
        userIds.map((uid) => updateUser(uid, { familiaId: familia.id }))
      );
      toast.success("Membros adicionados com sucesso!");
      addMemberModalRef.current?.close();
      userForm.reset({ userIds: [] });
      getFamiliaById(id);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao adicionar membros.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 relative">
      {/* Loading geral */}
      <LoadingOverlay loading={loading} message="Carregando família..." />
      <LoadingOverlay loading={loadingUsers} message="Carregando usuarios..." />

      {/* Voltar */}
      <div>
        <Link to="/familias" className="btn btn-ghost btn-sm gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
      </div>

      {/* Cabeçalho */}
      <div className="mb-4">
        <h1 className="text-4xl font-bold text-base-content mb-1">
          {familia.nome}
        </h1>
        <p className="text-base-content/70">
          {familia.descricao || "Sem descrição"}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Gestor */}
        {familia.gestor && (
          <div className="card bg-primary/10 border border-primary shadow-md p-4 rounded-lg">
            <div className="flex items-center gap-4 mb-3">
              <UserCog className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-semibold text-primary">
                Gestor Responsável
              </h2>
            </div>
            <p>
              <span className="font-semibold">{familia.gestor.nome}</span> —{" "}
              <span className="text-base-content/60 capitalize">
                {familia.gestor.role}
              </span>
            </p>
          </div>
        )}

        {/* Membros */}
        <div className="card bg-base-100 border border-base-200 shadow-md p-4 rounded-lg relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-secondary" />
              <h2 className="text-lg font-semibold text-secondary">
                Membros ({familia.membros?.length || 0})
              </h2>
            </div>

            {(user.role === "admin" || user.role === "gestor") && (
              <button
                className="btn btn-sm btn-success gap-1"
                onClick={handleOpenAddMemberModal}
              >
                <Plus className="h-4 w-4" /> Adicionar
              </button>
            )}
          </div>

          <ul className="space-y-2 text-sm max-h-64 overflow-y-auto">
            {familia.membros?.map((m) => (
              <li
                key={m.id}
                className="flex justify-between border-b border-base-200 pb-1"
              >
                <span>{m.nome || m.username}</span>
                <span className="text-base-content/60 capitalize">
                  {m.role}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Hortas */}
        <div className="md:col-span-2 card bg-base-100 border border-base-200 shadow-md p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Sprout className="h-5 w-5 text-success" />
            <h2 className="text-lg font-semibold text-success">
              Hortas Associadas
            </h2>
          </div>
          <ul className="space-y-2 text-sm max-h-64 overflow-y-auto">
            {familia.hortas?.map((h) => (
              <li key={h.id} className="border-b pb-1">
                <strong>{h.nome}</strong> — {h.tipoHorta || "N/A"}
              </li>
            ))}
          </ul>
        </div>

        {/* Plantios */}
        <div className="md:col-span-2 card bg-base-100 border border-base-200 shadow-md p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <ClipboardList className="h-5 w-5 text-warning" />
            <h2 className="text-lg font-semibold text-warning">
              Plantios Ativos
            </h2>
          </div>

          {familia.hortas?.flatMap((h) => h.plantios || []).length > 0 ? (
            <div className="grid md:grid-cols-2 gap-3">
              {familia.hortas
                .flatMap((h) => h.plantios || [])
                .map((p) => (
                  <div key={p.id} className="border rounded-md p-2 shadow-sm">
                    <p className="font-semibold">{p.cultura}</p>
                    <p className="text-sm text-base-content/70">
                      {p.tipoPlantacao || "N/A"} — {p.quantidadePlantada || "0"}{" "}
                      {p.unidadeMedida || ""}
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-base-content/60 text-sm">
              Nenhum plantio registrado.
            </p>
          )}
        </div>
      </div>

      {/* Modal Adicionar Membros */}
      <FormModal
        ref={addMemberModalRef}
        title={`Adicionar Membros à ${familia.nome}`}
        submitLabel="Adicionar"
        onSubmit={userForm.handleSubmit(handleAddMembers)}
      >
        {!loadingUsers && !submitting && (
          <FormField
            type="user-list"
            name="userIds"
            className="col-span-2 w-full"
            placeholder="Pesquise ou selecione usuários"
            control={userForm.control}
            options={availableUsers.map((u) => ({
              value: u.id,
              label: u.nome || u.username,
            }))}
          />
        )}
      </FormModal>
    </div>
  );
};

export default FamiliaDetalhesPage;
