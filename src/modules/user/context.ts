import { createContext, useContext } from "react";

export type User = { username: string; email?: string } | null;

export type Ctx = {
  user: User;
  token: string | null;
  login: (u: string, p: string) => Promise<void>;
  register: (u: string, e: string, p: string) => Promise<void>;
  logout: () => void;
};

export const UserCtx = createContext<Ctx | null>(null);

export function useUser() {
  const ctx = useContext(UserCtx);
  if (!ctx) throw new Error("useUser fuera de UserProvider");
  return ctx;
}
