import axiosPublic from "../api/axiosPublic";

export async function requestPasswordReset(email: string) {
  return axiosPublic.post("/forgot-password", { email });
}

export async function resetPassword(token: string, password: string, password_confirmation: string) {
  return axiosPublic.post("/reset-password", { token, password, password_confirmation });
}