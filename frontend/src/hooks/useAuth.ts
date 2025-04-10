import { create } from "zustand";
import { authApi } from "../services/api";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  user: null,

  login: async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      const { access_token } = response.data;
      localStorage.setItem("token", access_token);
      set({ token: access_token, isAuthenticated: true });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  register: async (email: string, password: string) => {
    try {
      await authApi.register(email, password);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, isAuthenticated: false, user: null });
  },
}));
