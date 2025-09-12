import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkinAuth: true,

  signup: async ({ name, username, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
        set({ loading: false });
      return toast.error("As senhas não coincidem");
    }

    try{
        const res = await axios.post("/auth/signup", {nome: name, username, email, senha: password});
        set({user: res.data.user, loading: false});
    } catch (error) {
        set({ loading: false });
        toast.error(error.response.data.message || "Erro ao criar conta");
    }
  },
}));
