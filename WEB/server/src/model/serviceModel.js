const { run, get, all } = require('../utils/dbAsync');
const { AppError } = require('../utils/appError');

const baseQuery = `
  SELECT
    s.*,
    (SELECT COUNT(*) FROM orders o WHERE o.service_id = s.id) AS order_count
  FROM services s
`;

const getAll = async () => {
  const query = `${baseQuery} ORDER BY s.id ASC`;
  const rows = await all(query);

  return rows;
};

const getById = async (id) => {
  const query = `${baseQuery} WHERE s.id = ?`;
  const row = await get(query, [id]);

  return row;
};

const create = async (body) => {
  const query = 'INSERT INTO services (service_name, price_per_kg, description) VALUES (?, ?, ?)';
  const result = await run(query, [body.service_name, body.price_per_kg, body.description]);

  return getById(result.lastID);
};

const update = async (id, body) => {
  const query = 'UPDATE services SET service_name = ?, price_per_kg = ?, description = ? WHERE id = ?';
  const result = await run(query, [body.service_name, body.price_per_kg, body.description, id]);

  if (result.changes === 0) return null;

  return getById(id);
};

const remove = async (id) => {
  const used = await get('SELECT COUNT(*) AS total FROM orders WHERE service_id = ?', [id]);

  if (used.total > 0) {
    throw new AppError(409, 'Layanan tidak bisa dihapus karena sudah dipakai pada pesanan');
  }

  const result = await run('DELETE FROM services WHERE id = ?', [id]);

  return result.changes > 0;
};

module.exports = { getAll, getById, create, update, remove };
