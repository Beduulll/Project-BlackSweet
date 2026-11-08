const UserModel = require('../model/userModel');
const { AppError } = require('../utils/appError');
const { hashPassword, verifyPassword, signToken } = require('../utils/auth');

const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

const checkRateLimit = (ip, action) => {
  const key = `${action}:${ip}`;
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now - entry.start > WINDOW_MS) {
    attempts.set(key, { start: now, count: 1 });
    return;
  }

  entry.count += 1;

  if (entry.count > MAX_ATTEMPTS) {
    throw new AppError(429, 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.');
  }
};

const text = (value) => (typeof value === 'string' ? value.trim() : '');
const normalizeAnswer = (value) => text(value).toLowerCase();

const validatePassword = (password) => {
  if (typeof password !== 'string' || password.length < 6) {
    throw new AppError(400, 'Password minimal 6 karakter');
  }
};

const toProfile = (user) => {
  return { id: user.id, username: user.username, full_name: user.full_name };
};

const login = async (req, res, next) => {
  try {
    checkRateLimit(req.ip, 'login');

    const body = req.body || {};
    const username = text(body.username);
    const password = typeof body.password === 'string' ? body.password : '';

    if (!username || !password) {
      throw new AppError(400, 'Username dan password wajib diisi');
    }

    const user = await UserModel.findByUsername(username);

    if (!user || !verifyPassword(password, user.password_hash)) {
      throw new AppError(401, 'Username atau password salah');
    }

    const profile = toProfile(user);

    res.json({
      message: 'Login berhasil',
      data: { token: signToken(profile), user: profile },
    });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    checkRateLimit(req.ip, 'register');

    const body = req.body || {};
    const username = text(body.username);
    const full_name = text(body.full_name);
    const password = body.password;
    const security_question = text(body.security_question);
    const answer = normalizeAnswer(body.security_answer);

    if (!full_name) throw new AppError(400, 'Nama lengkap wajib diisi');

    if (!/^[a-zA-Z0-9_.]{3,30}$/.test(username)) {
      throw new AppError(400, 'Username 3-30 karakter: huruf, angka, titik, atau garis bawah');
    }

    validatePassword(password);

    if (!security_question || !answer) {
      throw new AppError(400, 'Pertanyaan dan jawaban keamanan wajib diisi');
    }

    if (await UserModel.findByUsername(username)) {
      throw new AppError(409, 'Username sudah dipakai');
    }

    const user = await UserModel.create({
      username,
      full_name,
      password_hash: hashPassword(password),
      security_question,
      security_answer_hash: hashPassword(answer),
    });

    const profile = toProfile(user);

    res.status(201).json({
      message: 'Akun berhasil dibuat',
      data: { token: signToken(profile), user: profile },
    });
  } catch (error) {
    next(error);
  }
};

const getSecurityQuestion = async (req, res, next) => {
  try {
    checkRateLimit(req.ip, 'forgot');

    const body = req.body || {};
    const user = await UserModel.findByUsername(text(body.username));

    if (!user) throw new AppError(404, 'Username tidak ditemukan');

    if (!user.security_question || !user.security_answer_hash) {
      throw new AppError(400, 'Akun ini belum memiliki pertanyaan keamanan');
    }

    res.json({ message: 'OK', data: { question: user.security_question } });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    checkRateLimit(req.ip, 'forgot');

    const body = req.body || {};
    const user = await UserModel.findByUsername(text(body.username));
    const answer = normalizeAnswer(body.security_answer);

    validatePassword(body.new_password);

    if (!user || !user.security_answer_hash || !verifyPassword(answer, user.security_answer_hash)) {
      throw new AppError(401, 'Jawaban keamanan salah');
    }

    await UserModel.updatePassword(user.id, hashPassword(body.new_password));

    res.json({ message: 'Password berhasil diganti. Silakan masuk.' });
  } catch (error) {
    next(error);
  }
};

const me = (req, res) => {
  res.json({ message: 'OK', data: req.user });
};

module.exports = { login, register, getSecurityQuestion, resetPassword, me };
