const { AppError } = require('./appError');

const text = (value) => (typeof value === 'string' ? value.trim() : '');

const parseId = (value) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, 'ID tidak valid');
  }
  return id;
};

const validateCustomer = (body = {}) => {
  const name = text(body.name);
  const phone = text(body.phone);
  const address = text(body.address);

  if (!name || !phone) {
    throw new AppError(400, 'Nama dan nomor HP wajib diisi');
  }
  if (!/^[0-9+\-\s]{8,16}$/.test(phone)) {
    throw new AppError(400, 'Nomor HP tidak valid (8-16 digit angka)');
  }
  return { name, phone, address };
};

const validateService = (body = {}) => {
  const service_name = text(body.service_name);
  const price = Number(body.price_per_kg);
  const description = text(body.description) || null;

  if (!service_name) {
    throw new AppError(400, 'Nama layanan wajib diisi');
  }
  if (!Number.isFinite(price) || price <= 0) {
    throw new AppError(400, 'Harga per kg harus lebih dari 0');
  }
  return { service_name, price_per_kg: price, description };
};

const ORDER_STATUSES = [
  'received',
  'washing',
  'drying',
  'ironing',
  'completed',
  'picked_up',
];

const PAYMENT_METHODS = ['cash', 'transfer', 'qris'];

const isValidDate = (value) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime());

const validateOrder = (body = {}) => {
  const customer_name = text(body.customer_name);
  const customer_phone = text(body.customer_phone);
  const service_id = Number(body.service_id);
  const weight = Number(body.weight);
  const status = body.status ?? 'received';
  const order_date = text(body.order_date) || null;
  const pickup_date = text(body.pickup_date) || null;
  const payment_method = body.payment_method ?? 'cash';
  const notes = text(body.notes) || null;

  if (!customer_name) {
    throw new AppError(400, 'Nama pelanggan wajib diisi');
  }
  if (!/^[0-9+\-\s]{8,16}$/.test(customer_phone)) {
    throw new AppError(400, 'Nomor HP tidak valid (8-16 digit angka)');
  }
  if (!Number.isInteger(service_id) || service_id <= 0) {
    throw new AppError(400, 'Layanan wajib dipilih');
  }
  if (!Number.isFinite(weight) || weight <= 0 || weight > 1000) {
    throw new AppError(400, 'Berat cucian harus antara 0 dan 1000 kg');
  }
  if (!ORDER_STATUSES.includes(status)) {
    throw new AppError(400, 'Status pesanan tidak valid');
  }
  if (!PAYMENT_METHODS.includes(payment_method)) {
    throw new AppError(400, 'Metode pembayaran tidak valid');
  }
  if ((order_date && !isValidDate(order_date)) || (pickup_date && !isValidDate(pickup_date))) {
    throw new AppError(400, 'Format tanggal tidak valid');
  }
  return {
    customer_name, customer_phone, service_id, weight, status,
    order_date, pickup_date, payment_method, notes,
  };
};

module.exports = {
  ORDER_STATUSES,
  PAYMENT_METHODS,
  parseId,
  validateCustomer,
  validateService,
  validateOrder,
};
