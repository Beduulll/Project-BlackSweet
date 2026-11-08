export const ORDER_STATUSES = [
  "received",
  "washing",
  "drying",
  "ironing",
  "completed",
  "picked_up",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_METHODS = ["cash", "transfer", "qris"] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export interface Order {
  id: number;
  customer_id: number;
  service_id: number;
  weight: number;
  total_price: number;
  status: OrderStatus;
  order_date: string;
  pickup_date: string | null;
  payment_method: PaymentMethod;
  notes: string | null;
  customer_name: string;
  customer_phone: string;
  service_name: string;
  price_per_kg: number;
}

export interface OrderInput {
  customer_name: string;
  customer_phone: string;
  service_id: number;
  weight: number;
  order_date: string;
  pickup_date?: string;
  payment_method: PaymentMethod;
  notes?: string;
}
