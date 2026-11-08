import axiosClient from "./axiosClient";
import type { ApiResponse } from "../types/api";
import type { Stats } from "../types/stats";

export const getStats = async (): Promise<Stats> => {
  const res = await axiosClient.get<ApiResponse<Stats>>("/stats");
  return res.data.data;
};
