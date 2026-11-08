import { useMemo, useState } from "react";
import { getOrders, updateOrderStatus, deleteOrder } from "../api/order.api";
import { getCustomers } from "../api/customer.api";
import { getServices } from "../api/service.api";
import { useFetch } from "../hooks/useFetch";
import { ORDER_STATUSES } from "../types/order";
import type { Order, OrderStatus } from "../types/order";
import { PAYMENT_LABEL, STATUS_LABEL } from "../utils/orderStatus";
import { formatDate, formatRupiah, formatWeight } from "../utils/format";
import { getErrorMessage } from "../utils/error";
import { EmptyView, ErrorView, LoadingView } from "../components/StateViews";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import OrderForm from "../components/OrderForm";
import ReceiptModal from "../components/ReceiptModal";
import type { Notify } from "../components/Toast";

const fetchOrdersData = () => Promise.all([getOrders(), getCustomers(), getServices()]);

type Filter = "all" | OrderStatus;

export default function OrdersPage({ notify }: { notify: Notify }) {
  const { data, loading, error, reload, retry } = useFetch(fetchOrdersData);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [showForm, setShowForm] = useState(false);
  const [toDelete, setToDelete] = useState<Order | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const orders = data?.[0];

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return (orders ?? []).filter((order) => {
      if (filter !== "all" && order.status !== filter) return false;
      if (!keyword) return true;
      return (
        order.customer_name.toLowerCase().includes(keyword) ||
        order.customer_phone.includes(keyword) ||
        order.service_name.toLowerCase().includes(keyword) ||
        `#${order.id}`.includes(keyword)
      );
    });
  }, [orders, search, filter]);

  if (loading) return <LoadingView text="Memuat pesanan..." />;
  if (error || !data) return <ErrorView message={error ?? "Data kosong."} onRetry={retry} />;

  const [allOrders, customers, services] = data;

  const changeStatus = async (order: Order, status: OrderStatus) => {
    if (status === order.status) return;
    try {
      setUpdatingId(order.id);
      await updateOrderStatus(order.id, status);
      await reload();
      notify("success", `Pesanan #${order.id}: ${STATUS_LABEL[status]}`);
    } catch (error) {
      notify("error", getErrorMessage(error));
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      setBusy(true);
      await deleteOrder(toDelete.id);
      await reload();
      notify("success", `Pesanan #${toDelete.id} dihapus`);
      setToDelete(null);
    } catch (error) {
      notify("error", getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Pesanan</h1>
          <p>Catat cucian masuk dan pantau pengerjaannya.</p>
        </div>
        <button type="button" className="btn btn--primary" onClick={() => setShowForm(true)}>
          Pesanan baru
        </button>
      </div>

      <section className="card">
      <div className="toolbar">
        <input
          className="search"
          type="search"
          placeholder="Cari nama, nomor HP, layanan, atau nomor pesanan"
          aria-label="Cari pesanan"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="filter"
          aria-label="Filter status"
          value={filter}
          onChange={(e) => setFilter(e.target.value as Filter)}
        >
          <option value="all">Semua status</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABEL[status]}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyView
          title={allOrders.length === 0 ? "Belum ada pesanan" : "Pesanan tidak ditemukan"}
          text={
            allOrders.length === 0
              ? "Pilih “Pesanan baru” untuk mencatat cucian pertama."
              : "Coba ubah kata kunci atau filter status."
          }
        />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Tanggal</th>
                <th>Pelanggan</th>
                <th>Layanan</th>
                <th className="num">Total</th>
                <th>Pembayaran</th>
                <th>Status</th>
                <th aria-label="Aksi" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id}>
                  <td className="muted">#{order.id}</td>
                  <td>{formatDate(order.order_date)}</td>
                  <td>
                    {order.customer_name}
                    <div className="muted small">{order.customer_phone}</div>
                  </td>
                  <td>
                    {order.service_name}
                    <div className="muted small">{formatWeight(order.weight)}</div>
                  </td>
                  <td className="num">{formatRupiah(order.total_price)}</td>
                  <td>{PAYMENT_LABEL[order.payment_method] ?? "-"}</td>
                  <td>
                    <select
                      className="status-select"
                      aria-label={`Status pesanan ${order.id}`}
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => changeStatus(order, e.target.value as OrderStatus)}
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABEL[status]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button type="button" className="link-btn" onClick={() => setReceiptOrder(order)}>
                        Struk
                      </button>
                      <button
                        type="button"
                        className="link-btn link-btn--danger"
                        onClick={() => setToDelete(order)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      </section>

      {showForm && (
        <Modal title="Pesanan baru" onClose={() => setShowForm(false)}>
          <OrderForm
            customers={customers}
            services={services}
            onCancel={() => setShowForm(false)}
            onSaved={async (order) => {
              setShowForm(false);
              await reload();
              notify("success", `Pesanan #${order.id} atas nama ${order.customer_name} disimpan`);
              setReceiptOrder(order);
            }}
          />
        </Modal>
      )}

      {receiptOrder && (
        <ReceiptModal order={receiptOrder} onClose={() => setReceiptOrder(null)} />
      )}

      {toDelete && (
        <ConfirmDialog
          title="Hapus pesanan?"
          message={`Pesanan #${toDelete.id} atas nama ${toDelete.customer_name} akan dihapus permanen.`}
          busy={busy}
          onConfirm={() => confirmDelete()}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
