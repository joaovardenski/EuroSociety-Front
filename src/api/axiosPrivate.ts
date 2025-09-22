// src/api/axiosPrivate.ts
import axios from "axios";

const axiosPrivate = axios.create({
  // baseURL: "https://eurosociety-back-production-c350.up.railway.app/api",
   baseURL: "http://localhost:8000/api",
});

axiosPrivate.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosPrivate;
