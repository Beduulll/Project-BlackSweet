export interface Service {
  id: number;
  service_name: string;
  price_per_kg: number;
  description: string | null;
  created_at?: string;
  order_count?: number;
}

export interface ServiceInput {
  service_name: string;
  price_per_kg: number;
  description: string;
}
