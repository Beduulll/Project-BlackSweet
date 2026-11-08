const { run, get, all } = require('../utils/dbAsync');
const { AppError } = require('../utils/appError');

const baseQuery = `
  SELECT
    c.*,
    (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) AS order_count
  FROM customers c
`;

const getAll = async () => {
  const query = `${baseQuery} ORDER BY c.id DESC`;
  const rows = await all(query);

  return rows;
};

const getById = async (id) => {
  const query = `${baseQuery} WHERE c.id = ?`;
  const row = await get(query, [id]);

  return row;
};

const create = async (body) => {
  const query = 'INSERT INTO customers (name, phone, address) VALUES (?, ?, ?)';
  const result = await run(query, [body.name, body.phone, body.address]);

  return getById(result.lastID);
};

const findOrCreate = async (body) => {
  const query = 'SELECT id FROM customers WHERE phone = ? AND lower(name) = lower(?)';
  const existing = await get(query, [body.phone, body.name]);

  if (existing) return existing.id;

  const result = await run(
    "INSERT INTO customers (name, phone, address) VALUES (?, ?, '')",
    [body.name, body.phone]
  );

  return result.lastID;
};

const update = async (id, body) => {
  const query = 'UPDATE customers SET name = ?, phone = ?, address = ? WHERE id = ?';
  const result = await run(query, [body.name, body.phone, body.address, id]);

  if (result.changes === 0) return null;

  return getById(id);
};

const remove = async (id) => {
  const used = await get('SELECT COUNT(*) AS total FROM orders WHERE customer_id = ?', [id]);

  if (used.total > 0) {
    throw new AppError(409, 'Pelanggan tidak bisa dihapus karena masih memiliki riwayat pesanan');
  }

  const result = await run('DELETE FROM customers WHERE id = ?', [id]);

  return result.changes > 0;
};

module.exports = { getAll, getById, create, findOrCreate, update, remove };
