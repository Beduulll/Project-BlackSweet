const { verifyToken } = require('../utils/auth');
const { AppError } = require('../utils/appError');

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const payload = verifyToken(token);

  if (!payload) {
    return next(new AppError(401, 'Sesi berakhir, silakan login kembali'));
  }

  req.user = { id: payload.id, username: payload.username, full_name: payload.full_name };
  next();
};

module.exports = { requireAuth };
