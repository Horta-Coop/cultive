import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useFaqStore = create((set) => ({
  faqs: null,
  faq: null,
  loading: false,
  error: null,

  fetchFaqs: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/api/faqs", { params });
      set({ faqs: res.data?.faqs ?? [], loading: false });
      return res.data?.faqs ?? [];
    } catch (error) {
      set({ loading: false, error });
      toast.error(error?.response?.data?.message || "Erro ao listar FAQs");
      return [];
    }
  },

  getFaq: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`/api/faqs/${id}`);
      set({ faq: res.data?.faq ?? null, loading: false });
      return res.data?.faq ?? null;
    } catch (error) {
      set({ loading: false, error });
      toast.error(error?.response?.data?.message || "Erro ao obter FAQ");
      return null;
    }
  },

  createFaq: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/api/faqs", payload);
      set({ loading: false });
      return res.data?.faq ?? null;
    } catch (error) {
      set({ loading: false, error });
      toast.error(error?.response?.data?.message || "Erro ao criar FAQ");
      return null;
    }
  },

  updateFaq: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`/api/faqs/${id}`, payload);
      set({ loading: false });
      return res.data?.faq ?? null;
    } catch (error) {
      set({ loading: false, error });
      toast.error(error?.response?.data?.message || "Erro ao atualizar FAQ");
      return null;
    }
  },

  deleteFaq: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.delete(`/api/faqs/${id}`);
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false, error });
      toast.error(error?.response?.data?.message || "Erro ao deletar FAQ");
      return null;
    }
  },
}));

export default useFaqStore;
