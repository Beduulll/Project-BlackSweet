import { useState } from "react";
import type { FormEvent } from "react";
import type { Service } from "../types/service";
import { createService, updateService } from "../api/service.api";
import { getErrorMessage } from "../utils/error";

interface ServiceFormProps {
  service?: Service | null;
  onSaved: (service: Service, isEdit: boolean) => void;
  onCancel: () => void;
}

export default function ServiceForm({ service, onSaved, onCancel }: ServiceFormProps) {
  const isEdit = Boolean(service);
  const [name, setName] = useState(service?.service_name ?? "");
  const [price, setPrice] = useState(service ? String(service.price_per_kg) : "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!name.trim() || !price.trim()) {
      setError("Nama layanan dan harga wajib diisi.");
      return;
    }
    if (!(Number(price) > 0)) {
      setError("Harga harus lebih dari 0.");
      return;
    }

    const payload = {
      service_name: name.trim(),
      price_per_kg: Number(price),
      description: description.trim(),
    };

    try {
      setSaving(true);
      const saved = service
        ? await updateService(service.id, payload)
        : await createService(payload);
      onSaved(saved, isEdit);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="svc-name">Nama layanan</label>
        <input
          id="svc-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>

      <div className="field">
        <label htmlFor="svc-price">Harga per kg (Rp)</label>
        <input
          id="svc-price"
          type="number"
          min="0"
          step="500"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="8000"
        />
      </div>

      <div className="field">
        <label htmlFor="svc-desc">Deskripsi (opsional)</label>
        <textarea
          id="svc-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Isi layanan dan estimasi pengerjaan"
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={saving}>
          Batal
        </button>
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? "Menyimpan..." : isEdit ? "Simpan perubahan" : "Tambah layanan"}
        </button>
      </div>
    </form>
  );
}
