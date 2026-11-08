const { run, get } = require('../utils/dbAsync');

const findByUsername = async (username) => {
  const query = 'SELECT * FROM users WHERE username = ? COLLATE NOCASE';
  const row = await get(query, [username]);

  return row;
};

const create = async (body) => {
  const query = `
    INSERT INTO users (username, password_hash, full_name, security_question, security_answer_hash)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [
    body.username,
    body.password_hash,
    body.full_name,
    body.security_question,
    body.security_answer_hash,
  ];

  const result = await run(query, values);

  return get('SELECT id, username, full_name FROM users WHERE id = ?', [result.lastID]);
};

const updatePassword = (id, password_hash) => {
  return run('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, id]);
};

module.exports = { findByUsername, create, updatePassword };
