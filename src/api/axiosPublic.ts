// src/api/axiosPublic.ts
import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://eurosociety-back-production-c350.up.railway.app/api",
});

export default axiosPublic;
