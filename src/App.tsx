import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, type ReactNode } from "react";
import Login from "./modules/user/pages/login";
import Dashboard from "./modules/user/pages/dashboard"; // <-- usa el de tu módulo
import ProtectedRoute from "./modules/user/protectedRoute";
import { UserCtx, type User } from "./modules/user/context";
import { loginReq, registerReq } from "./modules/user/api";
import { useUser } from "./modules/user/context";

function UserProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<User>(
    token ? { username: localStorage.getItem("username") || "" } : null
  );

  interface LoginResponse {
    access?: string;
    token?: string;
    user?: { username: string; [key: string]: unknown };
    [key: string]: unknown;
  }

  async function login(username: string, password: string) {
    const data: LoginResponse = await loginReq({ username, password });
    const access = data?.access ?? data?.token;
    if (!access) throw new Error("Sin token");
    localStorage.setItem("token", access);
    localStorage.setItem("username", data.user?.username || username);
    setToken(access);
    setUser(data.user || { username });
  }

  async function register(username: string, email: string, password: string) {
    await registerReq({ username, email, password });
    await login(username, password);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUser(null);
  }

  const value = { user, token, login, register, logout };
  return <UserCtx.Provider value={value}>{children}</UserCtx.Provider>;
}

function HomeRedirect() {
  const { token } = useUser();
  return <Navigate to={token ? "/dashboard" : "/login"} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}
