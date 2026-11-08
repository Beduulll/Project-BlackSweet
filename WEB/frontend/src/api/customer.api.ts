import axiosClient from "./axiosClient";
import type { ApiResponse } from "../types/api";
import type { Customer, CustomerInput } from "../types/customer";

export const getCustomers = async (): Promise<Customer[]> => {
  const res = await axiosClient.get<ApiResponse<Customer[]>>("/customers");
  return res.data.data;
};

export const createCustomer = async (data: CustomerInput): Promise<Customer> => {
  const res = await axiosClient.post<ApiResponse<Customer>>("/customers", data);
  return res.data.data;
};

export const updateCustomer = async (
  id: number,
  data: CustomerInput
): Promise<Customer> => {
  const res = await axiosClient.put<ApiResponse<Customer>>(`/customers/${id}`, data);
  return res.data.data;
};

export const deleteCustomer = async (id: number): Promise<void> => {
  await axiosClient.delete(`/customers/${id}`);
};
