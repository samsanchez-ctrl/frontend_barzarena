import axios from "axios";

const API_BASE_URL = "https://frontend-barzarena.onrender.com/";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para enviar JWT si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
