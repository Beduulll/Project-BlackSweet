import { useState } from "react";
import type { FormEvent } from "react";
import type { Customer } from "../types/customer";
import type { Service } from "../types/service";
import { PAYMENT_METHODS } from "../types/order";
import type { Order, PaymentMethod } from "../types/order";
import { createOrder } from "../api/order.api";
import { getErrorMessage } from "../utils/error";
import { formatRupiah, todayISO } from "../utils/format";
import { PAYMENT_LABEL } from "../utils/orderStatus";

interface OrderFormProps {
  customers: Customer[];
  services: Service[];
  onSaved: (order: Order) => void;
  onCancel: () => void;
}

export default function OrderForm({ customers, services, onSaved, onCancel }: OrderFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [weight, setWeight] = useState("");
  const [orderDate, setOrderDate] = useState(todayISO);
  const [pickupDate, setPickupDate] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("cash");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedService = services.find((s) => String(s.id) === serviceId);
  const estimatedTotal =
    selectedService && Number(weight) > 0
      ? Math.round(selectedService.price_per_kg * Number(weight))
      : null;

  const handleNameChange = (value: string) => {
    setName(value);
    if (phone) return;
    const matches = customers.filter((c) => c.name.toLowerCase() === value.trim().toLowerCase());
    if (matches.length === 1) setPhone(matches[0].phone);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Nama pelanggan wajib diisi.");
      return;
    }
    if (!/^[0-9+\-\s]{8,16}$/.test(phone.trim())) {
      setError("Nomor HP tidak valid (8-16 digit angka).");
      return;
    }
    if (!serviceId) {
      setError("Pilih layanan terlebih dahulu.");
      return;
    }
    if (!(Number(weight) > 0)) {
      setError("Berat cucian harus lebih dari 0 kg.");
      return;
    }
    if (!orderDate) {
      setError("Tanggal masuk wajib diisi.");
      return;
    }

    try {
      setSaving(true);
      const order = await createOrder({
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        service_id: Number(serviceId),
        weight: Number(weight),
        order_date: orderDate,
        pickup_date: pickupDate || undefined,
        payment_method: payment,
        notes: notes.trim() || undefined,
      });
      onSaved(order);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  if (services.length === 0) {
    return (
      <div>
        <p className="confirm-text">Tambahkan minimal satu layanan sebelum membuat pesanan.</p>
        <div className="form-actions">
          <button type="button" className="btn btn--primary" onClick={onCancel}>
            Mengerti
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="field-row">
        <div className="field">
          <label htmlFor="ord-name">Nama pelanggan</label>
          <input
            id="ord-name"
            list="ord-customers"
            autoComplete="off"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            autoFocus
          />
          <datalist id="ord-customers">
            {customers.map((c) => (
              <option key={c.id} value={c.name}>
                {c.phone}
              </option>
            ))}
          </datalist>
        </div>

        <div className="field">
          <label htmlFor="ord-phone">Nomor HP</label>
          <input
            id="ord-phone"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="081234567890"
          />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="ord-service">Layanan</label>
          <select id="ord-service" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
            <option value="">Pilih layanan</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.service_name} ({formatRupiah(s.price_per_kg)}/kg)
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="ord-weight">Berat (kg)</label>
          <input
            id="ord-weight"
            type="number"
            min="0"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="ord-date">Tanggal masuk</label>
          <input
            id="ord-date"
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="ord-pickup">Estimasi diambil</label>
          <input
            id="ord-pickup"
            type="date"
            value={pickupDate}
            min={orderDate}
            onChange={(e) => setPickupDate(e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="ord-payment">Metode pembayaran</label>
        <select
          id="ord-payment"
          value={payment}
          onChange={(e) => setPayment(e.target.value as PaymentMethod)}
        >
          {PAYMENT_METHODS.map((method) => (
            <option key={method} value={method}>
              {PAYMENT_LABEL[method]}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="ord-notes">Catatan (opsional)</label>
        <textarea
          id="ord-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Misalnya: pisahkan pakaian putih"
        />
      </div>

      <div className="total-preview">
        <span>Total</span>
        <strong>{estimatedTotal !== null ? formatRupiah(estimatedTotal) : "-"}</strong>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={saving}>
          Batal
        </button>
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan pesanan"}
        </button>
      </div>
    </form>
  );
}
