import type { OrderStatus, PaymentMethod } from "../types/order";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  received: "Diterima",
  washing: "Dicuci",
  drying: "Dikeringkan",
  ironing: "Disetrika",
  completed: "Siap diambil",
  picked_up: "Sudah diambil",
};

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  cash: "Tunai",
  transfer: "Transfer bank",
  qris: "QRIS",
};
