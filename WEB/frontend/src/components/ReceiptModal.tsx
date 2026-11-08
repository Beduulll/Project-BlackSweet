import Modal from "./Modal";
import type { Order } from "../types/order";
import { SHOP } from "../utils/shop";
import { PAYMENT_LABEL, STATUS_LABEL } from "../utils/orderStatus";
import { formatDate, formatRupiah, formatWeight } from "../utils/format";

interface ReceiptModalProps {
  order: Order;
  onClose: () => void;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="receipt__row">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export default function ReceiptModal({ order, onClose }: ReceiptModalProps) {
  return (
    <Modal title={`Struk pesanan #${order.id}`} onClose={onClose}>
      <div className="receipt receipt-print">
        <div className="receipt__head">
          <h3>{SHOP.name}</h3>
          <p>{SHOP.address}</p>
          <p>Telp. {SHOP.phone}</p>
        </div>

        <div className="receipt__dash" />

        <Row label="No. Pesanan" value={`#${order.id}`} />
        <Row label="Tanggal masuk" value={formatDate(order.order_date)} />
        <Row label="Pelanggan" value={order.customer_name} />
        <Row label="No. HP" value={order.customer_phone} />
        <Row label="Estimasi diambil" value={formatDate(order.pickup_date)} />
        <Row label="Pembayaran" value={PAYMENT_LABEL[order.payment_method] ?? "-"} />

        <div className="receipt__dash" />

        <div className="receipt__item">
          <strong>{order.service_name}</strong>
          <div className="receipt__row">
            <span>
              {formatWeight(order.weight)} × {formatRupiah(order.price_per_kg)}
            </span>
            <span>{formatRupiah(order.total_price)}</span>
          </div>
        </div>

        <div className="receipt__dash" />

        <div className="receipt__row receipt__total">
          <span>TOTAL</span>
          <span>{formatRupiah(order.total_price)}</span>
        </div>
        <Row label="Status" value={STATUS_LABEL[order.status]} />
        {order.notes && <Row label="Catatan" value={order.notes} />}

        <div className="receipt__dash" />

        <p className="receipt__foot">
          Terima kasih telah mempercayakan cucian Anda kepada kami.
          <br />
          Simpan struk ini untuk pengambilan cucian.
        </p>
      </div>

      <div className="form-actions no-print">
        <button type="button" className="btn btn--ghost" onClick={onClose}>
          Tutup
        </button>
        <button type="button" className="btn btn--primary" onClick={() => window.print()}>
          Cetak struk
        </button>
      </div>
    </Modal>
  );
}
