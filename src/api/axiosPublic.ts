// src/api/axiosPublic.ts
import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://eurosociety-back-production-c350.up.railway.app/api",
  // baseURL: "http://localhost:8000/api",
});

export default axiosPublic;
// URL PÚBLICA
//Teste
