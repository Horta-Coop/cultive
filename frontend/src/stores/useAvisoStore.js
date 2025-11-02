import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useAvisoStore = create((set) => ({
  avisos: null,
  aviso: null,
  loading: false,
  error: null,

  fetchAvisos: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/api/avisos", { params });
      set({ avisos: res.data?.avisos ?? [], loading: false });
      return res.data?.avisos ?? [];
    } catch (error) {
      set({ loading: false, error });
      toast.error(error?.response?.data?.message || "Erro ao listar avisos");
      return [];
    }
  },

  getAviso: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`/api/avisos/${id}`);
      set({ aviso: res.data?.aviso ?? null, loading: false });
      return res.data?.aviso ?? null;
    } catch (error) {
      set({ loading: false, error });
      toast.error(error?.response?.data?.message || "Erro ao obter aviso");
      return null;
    }
  },

  createAviso: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/api/avisos", payload);
      set({ loading: false });
      return res.data?.aviso ?? null;
    } catch (error) {
      set({ loading: false, error });
      toast.error(error?.response?.data?.message || "Erro ao criar aviso");
      return null;
    }
  },

  updateAviso: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`/api/avisos/${id}`, payload);
      set({ loading: false });
      return res.data?.aviso ?? null;
    } catch (error) {
      set({ loading: false, error });
      toast.error(error?.response?.data?.message || "Erro ao atualizar aviso");
      return null;
    }
  },

  deleteAviso: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.delete(`/api/avisos/${id}`);
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false, error });
      toast.error(error?.response?.data?.message || "Erro ao deletar aviso");
      return null;
    }
  },
}));

export default useAvisoStore;
