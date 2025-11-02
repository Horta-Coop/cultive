import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useNotificacaoStore = create((set) => ({
  notificacoes: null,
  notificacao: null,
  loading: false,
  error: null,

  fetchNotificacoes: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/api/notificacoes", { params });
      set({ notificacoes: res.data?.notificacoes ?? [], loading: false });
      return res.data?.notificacoes ?? [];
    } catch (error) {
      set({ loading: false, error });
      toast.error(
        error?.response?.data?.message || "Erro ao listar notificações"
      );
      return [];
    }
  },

  getNotificacao: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`/api/notificacoes/${id}`);
      set({ notificacao: res.data?.notificacao ?? null, loading: false });
      return res.data?.notificacao ?? null;
    } catch (error) {
      set({ loading: false, error });
      toast.error(
        error?.response?.data?.message || "Erro ao obter notificação"
      );
      return null;
    }
  },

  createNotificacao: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/api/notificacoes", payload);
      set({ loading: false });
      return res.data?.notificacao ?? null;
    } catch (error) {
      set({ loading: false, error });
      toast.error(
        error?.response?.data?.message || "Erro ao criar notificação"
      );
      return null;
    }
  },

  updateNotificacao: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`/api/notificacoes/${id}`, payload);
      set({ loading: false });
      return res.data?.notificacao ?? null;
    } catch (error) {
      set({ loading: false, error });
      toast.error(
        error?.response?.data?.message || "Erro ao atualizar notificação"
      );
      return null;
    }
  },

  deleteNotificacao: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.delete(`/api/notificacoes/${id}`);
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false, error });
      toast.error(
        error?.response?.data?.message || "Erro ao deletar notificação"
      );
      return null;
    }
  },
}));

export default useNotificacaoStore;
