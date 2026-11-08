import { useMemo, useState } from "react";
import { deleteCustomer, getCustomers } from "../api/customer.api";
import { useFetch } from "../hooks/useFetch";
import type { Customer } from "../types/customer";
import { getErrorMessage } from "../utils/error";
import { EmptyView, ErrorView, LoadingView } from "../components/StateViews";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import CustomerForm from "../components/CustomerForm";
import type { Notify } from "../components/Toast";

export default function CustomersPage({ notify }: { notify: Notify }) {
  const { data, loading, error, reload, retry } = useFetch(getCustomers);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Customer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [toDelete, setToDelete] = useState<Customer | null>(null);
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return (data ?? []).filter(
      (c) =>
        !keyword ||
        c.name.toLowerCase().includes(keyword) ||
        c.phone.includes(keyword) ||
        c.address.toLowerCase().includes(keyword)
    );
  }, [data, search]);

  if (loading) return <LoadingView text="Memuat pelanggan..." />;
  if (error || !data) return <ErrorView message={error ?? "Data kosong."} onRetry={retry} />;

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      setBusy(true);
      await deleteCustomer(toDelete.id);
      await reload();
      notify("success", `${toDelete.name} dihapus`);
      setToDelete(null);
    } catch (error) {
      notify("error", getErrorMessage(error));
      setToDelete(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Pelanggan</h1>
          <p>
            {data.length} pelanggan. Pelanggan baru otomatis tercatat saat Anda membuat pesanan.
          </p>
        </div>
        <button type="button" className="btn btn--primary" onClick={() => setShowForm(true)}>
          Tambah pelanggan
        </button>
      </div>

      <section className="card">
      <div className="toolbar">
        <input
          className="search"
          type="search"
          placeholder="Cari nama, nomor HP, atau alamat"
          aria-label="Cari pelanggan"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyView
          title={data.length === 0 ? "Belum ada pelanggan" : "Pelanggan tidak ditemukan"}
          text={
            data.length === 0
              ? "Tambahkan pelanggan di sini, atau langsung buat pesanan baru."
              : "Coba gunakan kata kunci lain."
          }
        />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Nomor HP</th>
                <th>Alamat</th>
                <th className="num">Pesanan</th>
                <th aria-label="Aksi" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.phone}</td>
                  <td className="muted">{customer.address || "-"}</td>
                  <td className="num">{customer.order_count ?? 0}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        className="link-btn"
                        onClick={() => {
                          setEditing(customer);
                          setShowForm(true);
                        }}
                      >
                        Ubah
                      </button>
                      <button
                        type="button"
                        className="link-btn link-btn--danger"
                        onClick={() => setToDelete(customer)}
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
        <Modal title={editing ? "Ubah pelanggan" : "Tambah pelanggan"} onClose={closeForm}>
          <CustomerForm
            customer={editing}
            onCancel={closeForm}
            onSaved={async (saved, isEdit) => {
              closeForm();
              await reload();
              notify("success", isEdit ? `${saved.name} diperbarui` : `${saved.name} ditambahkan`);
            }}
          />
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Hapus pelanggan?"
          message={`Data ${toDelete.name} akan dihapus permanen. Pelanggan yang masih punya riwayat pesanan tidak dapat dihapus.`}
          busy={busy}
          onConfirm={() => confirmDelete()}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
