import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useFamiliaStore = create((set) => ({
  familias: null,
  familia: null,
  loading: false,
  error: null,

  fetchFamilias: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/api/familias", { params });
      set({ familias: res.data?.familias ?? [], loading: false });
      return res.data?.familias ?? [];
    } catch (error) {
      set({ loading: false, error });
      toast.error(error?.response?.data?.message || "Erro ao listar famílias");
      return [];
    }
  },

  getFamilia: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`/api/familias/${id}`);
      set({ familia: res.data?.familia ?? null, loading: false });
      return res.data?.familia ?? null;
    } catch (error) {
      set({ loading: false, error });
      toast.error(error?.response?.data?.message || "Erro ao obter família");
      return null;
    }
  },

  createFamilia: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/api/familias", payload);
      // optionally refresh list
      set({ loading: false });
      return res.data?.familia ?? null;
    } catch (error) {
      set({ loading: false, error });
      toast.error(error?.response?.data?.message || "Erro ao criar família");
      return null;
    }
  },

  updateFamilia: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`/api/familias/${id}`, payload);
      set({ loading: false });
      return res.data?.familia ?? null;
    } catch (error) {
      set({ loading: false, error });
      toast.error(
        error?.response?.data?.message || "Erro ao atualizar família"
      );
      return null;
    }
  },

  deleteFamilia: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.delete(`/api/familias/${id}`);
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false, error });
      toast.error(error?.response?.data?.message || "Erro ao deletar família");
      return null;
    }
  },
}));

export default useFamiliaStore;
