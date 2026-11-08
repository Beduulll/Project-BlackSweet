const { run, get, all } = require('../utils/dbAsync');
const { AppError } = require('../utils/appError');
const CustomerModel = require('./customerModel');

const baseQuery = `
  SELECT
    o.*,
    c.name AS customer_name,
    c.phone AS customer_phone,
    s.service_name AS service_name,
    s.price_per_kg AS price_per_kg
  FROM orders o
  JOIN customers c ON o.customer_id = c.id
  JOIN services s ON o.service_id = s.id
`;

const getAll = async () => {
  const query = `${baseQuery} ORDER BY o.id DESC`;
  const rows = await all(query);

  return rows;
};

const getById = async (id) => {
  const query = `${baseQuery} WHERE o.id = ?`;
  const row = await get(query, [id]);

  return row;
};

const create = async (body) => {
  const service = await get('SELECT price_per_kg FROM services WHERE id = ?', [body.service_id]);

  if (!service) throw new AppError(404, 'Layanan tidak ditemukan');

  const customerId = await CustomerModel.findOrCreate({
    name: body.customer_name,
    phone: body.customer_phone,
  });

  const totalPrice = Math.round(service.price_per_kg * body.weight);

  const query = `
    INSERT INTO orders
      (customer_id, service_id, weight, total_price, status, order_date, pickup_date, payment_method, notes)
    VALUES (?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP), ?, ?, ?)
  `;

  const values = [
    customerId,
    body.service_id,
    body.weight,
    totalPrice,
    body.status,
    body.order_date,
    body.pickup_date,
    body.payment_method,
    body.notes,
  ];

  const result = await run(query, values);

  return getById(result.lastID);
};

const updateStatus = async (id, status) => {
  const result = await run('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

  if (result.changes === 0) return null;

  return getById(id);
};

const remove = async (id) => {
  const result = await run('DELETE FROM orders WHERE id = ?', [id]);

  return result.changes > 0;
};

module.exports = { getAll, getById, create, updateStatus, remove };
