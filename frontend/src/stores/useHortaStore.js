import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "../lib/axios"; // seu axiosInstance com baseURL e interceptors

export const useHortaStore = create(
  devtools((set, get) => ({
    hortas: [],
    hortaSelecionada: null,
    loading: false,
    error: null,

    normalizeHorta: (horta) => ({
      ...horta,
      areaCultivada: Number(horta.areaCultivada) || 0,
      coordenada: horta.coordenada || "",
    }),

    fetchHortas: async () => {
      set({ loading: true, error: null });
      try {
        const response = await axios.get("/horta"); // ou "/api/horta"
        const normalizedHortas = (response.data.hortas || []).map((h) =>
          get().normalizeHorta(h)
        );
        set({ hortas: normalizedHortas });
      } catch (err) {
        console.error("Erro ao buscar hortas:", err);
        set({ error: err.response?.data?.message || "Erro ao buscar hortas" });
      } finally {
        set({ loading: false });
      }
    },

    fetchHortaById: async (id) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.get(`/horta/${id}`);
        set({ hortaSelecionada: get().normalizeHorta(response.data.horta) });
      } catch (err) {
        console.error("Erro ao buscar horta:", err);
        set({ error: err.response?.data?.message || "Erro ao buscar horta" });
      } finally {
        set({ loading: false });
      }
    },

    createHorta: async (data) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.post("/horta", data);
        const horta = get().normalizeHorta(response.data.horta);
        set((state) => ({
          hortas: [...state.hortas, horta],
        }));
        return horta;
      } catch (err) {
        console.error("Erro ao criar horta:", err);
        set({ error: err.response?.data?.message || "Erro ao criar horta" });
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    updateHorta: async (id, data) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.put(`/horta/${id}`, data);
        const horta = get().normalizeHorta(response.data.horta);
        set((state) => ({
          hortas: state.hortas.map((h) => (h.id === id ? horta : h)),
        }));
        return horta;
      } catch (err) {
        console.error("Erro ao atualizar horta:", err);
        set({
          error: err.response?.data?.message || "Erro ao atualizar horta",
        });
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    deleteHorta: async (id) => {
      set({ loading: true, error: null });
      try {
        await axios.delete(`/horta/${id}`);
        set((state) => ({
          hortas: state.hortas.filter((h) => h.id !== id),
        }));
      } catch (err) {
        console.error("Erro ao deletar horta:", err);
        set({ error: err.response?.data?.message || "Erro ao deletar horta" });
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    clearSelectedHorta: () => set({ hortaSelecionada: null }),
  }))
);
