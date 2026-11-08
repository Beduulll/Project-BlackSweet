export interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
  created_at?: string;
  order_count?: number;
}

export type CustomerInput = Pick<Customer, "name" | "phone" | "address">;
