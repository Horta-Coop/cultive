import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useLogStore = create((set) => ({
  logs: null,
  log: null,
  loading: false,
  error: null,

  fetchLogs: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/api/logs", { params });
      set({ logs: res.data?.logs ?? [], loading: false });
      return res.data?.logs ?? [];
    } catch (error) {
      set({ loading: false, error });
      toast.error(error?.response?.data?.message || "Erro ao listar logs");
      return [];
    }
  },

  getLog: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`/api/logs/${id}`);
      set({ log: res.data?.log ?? null, loading: false });
      return res.data?.log ?? null;
    } catch (error) {
      set({ loading: false, error });
      toast.error(error?.response?.data?.message || "Erro ao obter log");
      return null;
    }
  },

  createLog: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/api/logs", payload);
      set({ loading: false });
      return res.data?.log ?? null;
    } catch (error) {
      set({ loading: false, error });
      toast.error(error?.response?.data?.message || "Erro ao criar log");
      return null;
    }
  },

  updateLog: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`/api/logs/${id}`, payload);
      set({ loading: false });
      return res.data?.log ?? null;
    } catch (error) {
      set({ loading: false, error });
      toast.error(error?.response?.data?.message || "Erro ao atualizar log");
      return null;
    }
  },

  deleteLog: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.delete(`/api/logs/${id}`);
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false, error });
      toast.error(error?.response?.data?.message || "Erro ao deletar log");
      return null;
    }
  },
}));

export default useLogStore;
