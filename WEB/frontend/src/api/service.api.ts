import axiosClient from "./axiosClient";
import type { ApiResponse } from "../types/api";
import type { Service, ServiceInput } from "../types/service";

export const getServices = async (): Promise<Service[]> => {
  const res = await axiosClient.get<ApiResponse<Service[]>>("/services");
  return res.data.data;
};

export const createService = async (data: ServiceInput): Promise<Service> => {
  const res = await axiosClient.post<ApiResponse<Service>>("/services", data);
  return res.data.data;
};

export const updateService = async (
  id: number,
  data: ServiceInput
): Promise<Service> => {
  const res = await axiosClient.put<ApiResponse<Service>>(`/services/${id}`, data);
  return res.data.data;
};

export const deleteService = async (id: number): Promise<void> => {
  await axiosClient.delete(`/services/${id}`);
};
