import type { OrderStatus } from "../types/order";
import { STATUS_LABEL } from "../utils/orderStatus";

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`badge badge--${status}`}>{STATUS_LABEL[status]}</span>;
}
