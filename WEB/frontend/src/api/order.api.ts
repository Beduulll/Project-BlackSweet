import axiosClient from "./axiosClient";
import type { ApiResponse } from "../types/api";
import type { Order, OrderInput, OrderStatus } from "../types/order";

export const getOrders = async (): Promise<Order[]> => {
  const res = await axiosClient.get<ApiResponse<Order[]>>("/orders");
  return res.data.data;
};

export const createOrder = async (data: OrderInput): Promise<Order> => {
  const res = await axiosClient.post<ApiResponse<Order>>("/orders", data);
  return res.data.data;
};

export const updateOrderStatus = async (
  id: number,
  status: OrderStatus
): Promise<Order> => {
  const res = await axiosClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, {
    status,
  });
  return res.data.data;
};

export const deleteOrder = async (id: number): Promise<void> => {
  await axiosClient.delete(`/orders/${id}`);
};
