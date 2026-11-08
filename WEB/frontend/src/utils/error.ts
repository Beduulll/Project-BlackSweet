import axios from "axios";

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) return String(error.response.data.message);
    if (error.code === "ECONNABORTED") return "Server terlalu lama merespons.";
    return "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.";
  }
  return error instanceof Error ? error.message : "Terjadi kesalahan.";
};
