import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("access");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export async function registerReq(data: any) {
  return api.post("/api/register/", data);
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
}

export async function refreshToken() {
  const r = localStorage.getItem("refresh");
  if (!r) return null;
  const { data } = await api.post("/api/token/refresh/", { refresh: r });
  localStorage.setItem("access", data.access);
  return data.access;
}

api.interceptors.response.use(undefined, async (err) => {
  if (err.response?.status === 401) {
    const newAccess = await refreshToken();
    if (newAccess) {
      err.config.headers.Authorization = `Bearer ${newAccess}`;
      return api.request(err.config);
    }
  }
  throw err;
});
