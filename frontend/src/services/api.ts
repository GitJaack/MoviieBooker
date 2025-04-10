import axios from "axios";

const API_URL = "https://moviiebooker-0eje.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  register: (email: string, password: string) =>
    api.post("/auth/register", { email, password }),
};

export const moviesApi = {
  getNowPlaying: (page: number = 1) =>
    api.get(`/movies/now-playing?page=${page}`),
  search: (title: string) => api.get(`/movies/search?title=${title}`),
  getMovie: (id: number) => api.get(`/movies/movie/${id}`),
};

export const reservationsApi = {
  create: (movieId: number, startTime: string) =>
    api.post("/reservations", { movieId, startTime }),
  getAll: () => api.get("/reservations"),
  cancel: (id: number) => api.delete(`/reservations/${id}`),
};

export default api;
