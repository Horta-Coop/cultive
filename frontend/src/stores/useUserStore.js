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
        toast.error(error?.response?.data?.message || "Erro ao criar conta");
    }
  },
  login: async (username, password) => {
    set({ loading: true }); 

    try{
        const res = await axios.post("/auth/login", {username, senha: password});
        set({user: res.data.user, loading: false});
    } catch (error) {
        set({ loading: false });
        toast.error(error?.response?.data?.message || "Erro ao fazer login");
    }
  },

  logout: async () => {
    try{
        await axios.get("/auth/logout");
        set({user: null});
    } catch (error) {
        toast.error(error?.response?.data?.message || "Erro ao fazer logout");
    }
  },

  checkAuth: async () => {
    set({ checkinAuth: true });
    try {
        const res = await axios.get("/auth/me");
        set({user: res.data.user, checkinAuth: false});
    }catch (error) {
        set({ checkinAuth: false, user: null });
    }
  },
}));
