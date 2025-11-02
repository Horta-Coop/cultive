import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useDisponibilidadeStore = create((set) => ({
  disponibilidades: null,
  disponibilidade: null,
  loading: false,
  error: null,

  fetchDisponibilidades: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/api/disponibilidades", { params });
      set({
        disponibilidades: res.data?.disponibilidades ?? [],
        loading: false,
      });
      return res.data?.disponibilidades ?? [];
    } catch (error) {
      set({ loading: false, error });
      toast.error(
        error?.response?.data?.message || "Erro ao listar disponibilidades"
      );
      return [];
    }
  },

  getDisponibilidade: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`/api/disponibilidades/${id}`);
      set({
        disponibilidade: res.data?.disponibilidade ?? null,
        loading: false,
      });
      return res.data?.disponibilidade ?? null;
    } catch (error) {
      set({ loading: false, error });
      toast.error(
        error?.response?.data?.message || "Erro ao obter disponibilidade"
      );
      return null;
    }
  },

  createDisponibilidade: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/api/disponibilidades", payload);
      set({ loading: false });
      return res.data?.disponibilidade ?? null;
    } catch (error) {
      set({ loading: false, error });
      toast.error(
        error?.response?.data?.message || "Erro ao criar disponibilidade"
      );
      return null;
    }
  },

  updateDisponibilidade: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`/api/disponibilidades/${id}`, payload);
      set({ loading: false });
      return res.data?.disponibilidade ?? null;
    } catch (error) {
      set({ loading: false, error });
      toast.error(
        error?.response?.data?.message || "Erro ao atualizar disponibilidade"
      );
      return null;
    }
  },

  deleteDisponibilidade: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.delete(`/api/disponibilidades/${id}`);
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false, error });
      toast.error(
        error?.response?.data?.message || "Erro ao deletar disponibilidade"
      );
      return null;
    }
  },
}));

export default useDisponibilidadeStore;
