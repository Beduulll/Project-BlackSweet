const db = require('../config/database');

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        console.error("Something's not right!", err);
        return reject(err);
      }

      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        console.error("Something's not right!", err);
        return reject(err);
      }

      resolve(row);
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error("Something's not right!", err);
        return reject(err);
      }

      resolve(rows);
    });
  });
};

module.exports = { run, get, all };
