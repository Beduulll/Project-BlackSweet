const { AppError } = require('../utils/appError');

const notFound = (req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
};

const errorHandler = (err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Format JSON tidak valid' });
  }

  if (err instanceof AppError) {
    return res.status(err.status).json({ message: err.message });
  }

  console.error('❌ Server error:', err);
  res.status(500).json({ message: 'Terjadi kesalahan pada server' });
};

module.exports = { notFound, errorHandler };
