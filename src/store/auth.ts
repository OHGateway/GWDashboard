import { create } from "zustand";

interface AuthState {
  isAdmin: boolean;
  lastLoginAt?: string;
  error?: string;
  login: (id: string, password: string) => boolean;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAdmin: false,
  lastLoginAt: undefined,
  error: undefined,
  login: (id: string, password: string) => {
    const ok = id === "ccsgateway" && password === "GWAdmin!1";
    if (ok) {
      set({ isAdmin: true, error: undefined, lastLoginAt: new Date().toISOString() });
    } else {
      set({ isAdmin: false, error: "아이디 또는 비밀번호가 올바르지 않습니다." });
    }
    return ok;
  },
  logout: () => set({ isAdmin: false }),
}));
