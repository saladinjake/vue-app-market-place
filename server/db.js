const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'marketplace.db');
const db = new sqlite3.Database(dbPath);

const run = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const all = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const initDb = async () => {
  await run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
     password TEXT,
    role TEXT DEFAULT 'customer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  await run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
       parent_id INTEGER,
    image TEXT,
    icon TEXT,
    description TEXT,
    FOREIGN KEY(parent_id) REFERENCES categories(id)
  )`);

  await run(`CREATE TABLE IF NOT EXISTS category_slides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
       title TEXT,
      subtitle TEXT,
    image TEXT,
        cta_label TEXT,
    cta_link TEXT,
       sort_order INTEGER DEFAULT 0,
    FOREIGN KEY(category_id) REFERENCES categories(id)
  )`);

  await run(`CREATE TABLE IF NOT EXISTS sellers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    store_name TEXT,
    verification_status TEXT DEFAULT 'pending',
    logo TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  await run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL,
        description TEXT,
    category_id INTEGER,
    seller_id INTEGER,
    inventory INTEGER,
    images TEXT,
        variants TEXT,
    grid_layout TEXT DEFAULT 'standard',
    featured INTEGER DEFAULT 0,
     new_arrival INTEGER DEFAULT 0,
      top_seller INTEGER DEFAULT 0,
    discount INTEGER DEFAULT 0,
      FOREIGN KEY(category_id) REFERENCES categories(id),
    FOREIGN KEY(seller_id) REFERENCES sellers(id)
  )`);

  await run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
       user_id INTEGER,
    total_amount REAL,
    shipping_method TEXT,
       shipping_cost REAL,
    tax REAL,
      shipping_details TEXT, -- JSON string
    payment_method TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
  )`);



  await run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
      product_id INTEGER,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);
};
