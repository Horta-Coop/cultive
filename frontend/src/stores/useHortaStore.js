import axios from "axios";
import { create } from "zustand";

export const useHortaStore = create((set) => ({
  gardens: null,
  loading: false,
  error: null,

  fetchGardens: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/horta", {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const gardens = data.hortas ?? data.gardens ?? null;
      set({ gardens, loading: false });
    } catch (err) {
      set({ error: err.message || String(err), loading: false });
    }
  },

  setGardens: (gardens) => set({ gardens }),
}));