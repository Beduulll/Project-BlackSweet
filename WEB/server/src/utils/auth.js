const crypto = require('crypto');

const SECRET = process.env.AUTH_SECRET || 'laundryblacksweet-dev-secret-ganti-di-produksi';
if (!process.env.AUTH_SECRET) {
  console.warn('⚠️  AUTH_SECRET belum diset, memakai secret bawaan (hanya untuk development).');
}

const TOKEN_TTL_SECONDS = 12 * 60 * 60;

const b64 = (input) => Buffer.from(input).toString('base64url');

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

const verifyPassword = (password, stored) => {
  const [salt, hash] = String(stored).split(':');
  if (!salt || !hash) return false;
  const attempt = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  return attempt.length === expected.length && crypto.timingSafeEqual(attempt, expected);
};

const sign = (body) =>
  crypto.createHmac('sha256', SECRET).update(body).digest('base64url');

const signToken = (payload) => {
  const body = b64(
    JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS })
  );
  return `${body}.${sign(body)}`;
};

const verifyToken = (token) => {
  if (typeof token !== 'string') return null;
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;

  const expected = Buffer.from(sign(body));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
};

module.exports = { hashPassword, verifyPassword, signToken, verifyToken };
