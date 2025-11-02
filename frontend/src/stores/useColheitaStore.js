import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useColheitaStore = create((set) => ({
  colheitas: null,
  colheita: null,
  loading: false,
  error: null,

  fetchColheitas: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/api/colheitas", { params });
      set({ colheitas: res.data?.colheitas ?? [], loading: false });
      return res.data?.colheitas ?? [];
    } catch (error) {
      set({ loading: false, error });
      toast.error(error?.response?.data?.message || "Erro ao listar colheitas");
      return [];
    }
  },

  getColheita: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`/api/colheitas/${id}`);
      set({ colheita: res.data?.colheita ?? null, loading: false });
      return res.data?.colheita ?? null;
    } catch (error) {
      set({ loading: false, error });
      toast.error(error?.response?.data?.message || "Erro ao obter colheita");
      return null;
    }
  },

  createColheita: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/api/colheitas", payload);
      set({ loading: false });
      return res.data?.colheita ?? null;
    } catch (error) {
      set({ loading: false, error });
      toast.error(error?.response?.data?.message || "Erro ao criar colheita");
      return null;
    }
  },

  updateColheita: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`/api/colheitas/${id}`, payload);
      set({ loading: false });
      return res.data?.colheita ?? null;
    } catch (error) {
      set({ loading: false, error });
      toast.error(
        error?.response?.data?.message || "Erro ao atualizar colheita"
      );
      return null;
    }
  },

  deleteColheita: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.delete(`/api/colheitas/${id}`);
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false, error });
      toast.error(error?.response?.data?.message || "Erro ao deletar colheita");
      return null;
    }
  },
}));

export default useColheitaStore;
