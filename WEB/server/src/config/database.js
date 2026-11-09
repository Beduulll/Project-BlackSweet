const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const seed = require('../../data');
const { hashPassword } = require('../utils/auth');

const dbPath = path.resolve(__dirname, '../../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Gagal konek SQLite:', err.message);
  } else {
    console.log('✅ Terhubung ke SQLite:', dbPath);
  }
});

db.run('PRAGMA foreign_keys = ON');

function addColumnIfMissing(table, column, definition) {
  db.all(`PRAGMA table_info(${table})`, [], (err, columns) => {
    if (err || columns.some((c) => c.name === column)) return;
    db.run(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  });
}

db.serialize(() => {
  db.run('DROP TABLE IF EXISTS vehicles');

  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_name TEXT NOT NULL,
      price_per_kg REAL NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      service_id INTEGER NOT NULL,
      weight REAL NOT NULL,
      total_price REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'received',
      order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      pickup_date DATETIME,
      payment_method TEXT NOT NULL DEFAULT 'cash',
      notes TEXT,
      FOREIGN KEY (customer_id) REFERENCES customers(id),
      FOREIGN KEY (service_id) REFERENCES services(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      security_question TEXT,
      security_answer_hash TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  addColumnIfMissing('orders', 'payment_method', "TEXT NOT NULL DEFAULT 'cash'");
  addColumnIfMissing('orders', 'notes', 'TEXT');
  addColumnIfMissing('users', 'security_question', 'TEXT');
  addColumnIfMissing('users', 'security_answer_hash', 'TEXT');

  db.get('SELECT COUNT(*) AS total FROM users', [], (err, row) => {
    if (err) return console.error('❌ Gagal cek pengguna:', err.message);
    if (row.total > 0) {
      console.log(`👤 Akun admin -> username: ${process.env.ADMIN_USERNAME || 'admin'} | password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
      return;
    }

    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const answer = (process.env.ADMIN_SECURITY_ANSWER || 'laundryblacksweet').toLowerCase();
    db.run(
      `INSERT INTO users (username, password_hash, full_name, security_question, security_answer_hash)
       VALUES (?, ?, ?, ?, ?)`,
      [username, hashPassword(password), 'Administrator', 'Nama usaha laundry Anda?', hashPassword(answer)],
      (insertErr) => {
        if (insertErr) return console.error('❌ Gagal membuat admin:', insertErr.message);
        console.log(`👤 Akun admin dibuat -> username: ${username} | password: ${password}`);
      }
    );
  });

  db.run('CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_orders_service ON orders(service_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)');

  db.get(
    `SELECT
       (SELECT COUNT(*) FROM customers) AS customers,
       (SELECT COUNT(*) FROM services) AS services,
       (SELECT COUNT(*) FROM orders) AS orders`,
    [],
    (err, row) => {
      if (err) return console.error('❌ Gagal cek data awal:', err.message);
      if (row.customers || row.services || row.orders) return;

      console.log('🌱 Mengisi data awal LaundryBlackSweet...');
      seedDatabase();
    }
  );
});

function seedDatabase() {
  db.serialize(() => {
    db.run('BEGIN');

    const customerStmt = db.prepare(
      'INSERT INTO customers (name, phone, address) VALUES (?, ?, ?)'
    );
    seed.customers.forEach((c) => customerStmt.run(c.name, c.phone, c.address));
    customerStmt.finalize();

    const serviceStmt = db.prepare(
      'INSERT INTO services (service_name, price_per_kg, description) VALUES (?, ?, ?)'
    );
    seed.services.forEach((s) =>
      serviceStmt.run(s.service_name, s.price_per_kg, s.description)
    );
    serviceStmt.finalize();

    const orderStmt = db.prepare(`
      INSERT INTO orders
        (customer_id, service_id, weight, total_price, status, order_date, pickup_date)
      VALUES (?, ?, ?, ?, ?, datetime('now', ?), datetime('now', ?))
    `);
    seed.orders.forEach((o) => {
      const service = seed.services[o.service_index];
      orderStmt.run(
        o.customer_index + 1,
        o.service_index + 1,
        o.weight,
        service.price_per_kg * o.weight,
        o.status,
        `-${o.days_ago} days`,
        `+${o.pickup_in_days} days`
      );
    });
    orderStmt.finalize();

    db.run('COMMIT', (err) => {
      if (err) console.error('❌ Seed gagal:', err.message);
      else console.log('✅ Data awal berhasil dimasukkan');
    });
  });
}

module.exports = db;
