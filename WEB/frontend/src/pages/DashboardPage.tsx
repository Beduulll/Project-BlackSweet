import { getStats } from "../api/stats.api";
import { getOrders } from "../api/order.api";
import { useFetch } from "../hooks/useFetch";
import { EmptyView, ErrorView, LoadingView } from "../components/StateViews";
import StatusBadge from "../components/StatusBadge";
import { formatDate, formatRupiah } from "../utils/format";

const fetchDashboard = () => Promise.all([getStats(), getOrders()]);

const monthName = (offset: number): string => {
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() + offset);
  return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
};

export default function DashboardPage() {
  const { data, loading, error, retry } = useFetch(fetchDashboard);

  if (loading) return <LoadingView text="Memuat beranda..." />;
  if (error || !data) return <ErrorView message={error ?? "Data kosong."} onRetry={retry} />;

  const [stats, orders] = data;
  const recent = orders.slice(0, 8);

  const revenue = [
    { label: "Pendapatan hari ini", value: formatRupiah(stats.today_revenue), hint: formatDate(new Date().toISOString().slice(0, 10)) },
    { label: "Pendapatan bulan ini", value: formatRupiah(stats.month_revenue), hint: monthName(0), featured: true },
    { label: "Pendapatan bulan lalu", value: formatRupiah(stats.last_month_revenue), hint: monthName(-1) },
  ];

  const counts = [
    { label: "Sedang diproses", value: String(stats.active_orders) },
    { label: "Siap diambil", value: String(stats.ready_orders) },
    { label: "Pelanggan", value: String(stats.total_customers) },
  ];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Beranda</h1>
          <p>Keadaan laundry Anda hari ini.</p>
        </div>
      </div>

      <div className="stat-grid">
        {revenue.map((item) => (
          <div key={item.label} className={`card stat ${item.featured ? "stat--featured" : ""}`}>
            <div className="stat__label">{item.label}</div>
            <div className="stat__value">{item.value}</div>
            <div className="stat__hint">{item.hint}</div>
          </div>
        ))}
      </div>

      <div className="stat-grid">
        {counts.map((item) => (
          <div key={item.label} className="card stat">
            <div className="stat__label">{item.label}</div>
            <div className="stat__value">{item.value}</div>
          </div>
        ))}
      </div>

      <section className="card">
        <h2 className="card__title">Pesanan terbaru</h2>
        {recent.length === 0 ? (
          <EmptyView title="Belum ada pesanan" text="Pesanan yang dibuat akan tampil di sini." />
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
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((order) => (
                  <tr key={order.id}>
                    <td className="muted">#{order.id}</td>
                    <td>{formatDate(order.order_date)}</td>
                    <td>{order.customer_name}</td>
                    <td>{order.service_name}</td>
                    <td className="num">{formatRupiah(order.total_price)}</td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
