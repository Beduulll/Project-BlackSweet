import { useState } from "react";
import type { FormEvent } from "react";
import type { Customer } from "../types/customer";
import { createCustomer, updateCustomer } from "../api/customer.api";
import { getErrorMessage } from "../utils/error";

interface CustomerFormProps {
  customer?: Customer | null;
  onSaved: (customer: Customer, isEdit: boolean) => void;
  onCancel: () => void;
}

export default function CustomerForm({ customer, onSaved, onCancel }: CustomerFormProps) {
  const isEdit = Boolean(customer);
  const [name, setName] = useState(customer?.name ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [address, setAddress] = useState(customer?.address ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const payload = { name: name.trim(), phone: phone.trim(), address: address.trim() };

    if (!payload.name || !payload.phone) {
      setError("Nama dan nomor HP wajib diisi.");
      return;
    }
    if (!/^[0-9+\-\s]{8,16}$/.test(payload.phone)) {
      setError("Nomor HP tidak valid (8-16 digit angka).");
      return;
    }

    try {
      setSaving(true);
      const saved = customer
        ? await updateCustomer(customer.id, payload)
        : await createCustomer(payload);
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
        <label htmlFor="cust-name">Nama pelanggan</label>
        <input
          id="cust-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
                    autoFocus
        />
      </div>

      <div className="field">
        <label htmlFor="cust-phone">Nomor HP</label>
        <input
          id="cust-phone"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="081234567890"
        />
      </div>

      <div className="field">
        <label htmlFor="cust-address">Alamat (opsional)</label>
        <textarea
          id="cust-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Untuk antar-jemput"
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={saving}>
          Batal
        </button>
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? "Menyimpan..." : isEdit ? "Simpan perubahan" : "Tambah pelanggan"}
        </button>
      </div>
    </form>
  );
}
