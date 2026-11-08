import { useState } from "react";
import { deleteService, getServices } from "../api/service.api";
import { useFetch } from "../hooks/useFetch";
import type { Service } from "../types/service";
import { formatRupiah } from "../utils/format";
import { getErrorMessage } from "../utils/error";
import { EmptyView, ErrorView, LoadingView } from "../components/StateViews";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import ServiceForm from "../components/ServiceForm";
import type { Notify } from "../components/Toast";

export default function ServicesPage({ notify }: { notify: Notify }) {
  const { data, loading, error, reload, retry } = useFetch(getServices);
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [toDelete, setToDelete] = useState<Service | null>(null);
  const [busy, setBusy] = useState(false);

  if (loading) return <LoadingView text="Memuat layanan..." />;
  if (error || !data) return <ErrorView message={error ?? "Data kosong."} onRetry={retry} />;

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      setBusy(true);
      await deleteService(toDelete.id);
      await reload();
      notify("success", `${toDelete.service_name} dihapus`);
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
          <h1>Layanan</h1>
          <p>Daftar layanan dan harga per kilogram.</p>
        </div>
        <button type="button" className="btn btn--primary" onClick={() => setShowForm(true)}>
          Tambah layanan
        </button>
      </div>

      <section className="card">
      {data.length === 0 ? (
        <EmptyView title="Belum ada layanan" text="Tambahkan layanan pertama, misalnya Cuci Setrika." />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Layanan</th>
                <th>Keterangan</th>
                <th className="num">Harga per kg</th>
                <th className="num">Pesanan</th>
                <th aria-label="Aksi" />
              </tr>
            </thead>
            <tbody>
              {data.map((service) => (
                <tr key={service.id}>
                  <td>{service.service_name}</td>
                  <td className="muted">{service.description || "-"}</td>
                  <td className="num">{formatRupiah(service.price_per_kg)}</td>
                  <td className="num">{service.order_count ?? 0}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        className="link-btn"
                        onClick={() => {
                          setEditing(service);
                          setShowForm(true);
                        }}
                      >
                        Ubah
                      </button>
                      <button
                        type="button"
                        className="link-btn link-btn--danger"
                        onClick={() => setToDelete(service)}
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
        <Modal title={editing ? "Ubah layanan" : "Tambah layanan"} onClose={closeForm}>
          <ServiceForm
            service={editing}
            onCancel={closeForm}
            onSaved={async (saved, isEdit) => {
              closeForm();
              await reload();
              notify(
                "success",
                isEdit ? `${saved.service_name} diperbarui` : `${saved.service_name} ditambahkan`
              );
            }}
          />
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Hapus layanan?"
          message={`Layanan ${toDelete.service_name} akan dihapus permanen. Layanan yang sudah dipakai pada pesanan tidak dapat dihapus.`}
          busy={busy}
          onConfirm={() => confirmDelete()}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
