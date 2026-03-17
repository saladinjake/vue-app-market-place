const express = require('express');
const cors = require('cors');
const { initDb, seedDb, all, run } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/api/categories/mega', async (req, res) => {
  try {
    const parents = await all("SELECT * FROM categories WHERE parent_id IS NULL ORDER BY id");
    const result = await Promise.all(parents.map(async (cat) => {
      const subs = await all("SELECT * FROM categories WHERE parent_id = ? ORDER BY id", [cat.id]);
      const slides = await all("SELECT * FROM category_slides WHERE category_id = ? ORDER BY sort_order", [cat.id]);
      return { ...cat, subcategories: subs, slides };
    }));
    res.json(result);
  } catch (err) {
    console.error('Mega menu error:', err);
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/products', async (req, res) => {
  try {
    const { category, search, layout, featured, new_arrival, top_seller, discount, limit } = req.query;
    let query = "SELECT * FROM products WHERE 1=1";
    const params = [];
    if (category) { query += " AND category_id = ?"; params.push(category); }
    if (search) { query += " AND name LIKE ?"; params.push(`%${search}%`); }
    if (layout) { query += " AND grid_layout = ?"; params.push(layout); }
    if (featured) { query += " AND featured = 1"; }
    if (new_arrival) { query += " AND new_arrival = 1"; }
    if (top_seller) { query += " AND top_seller = 1"; }
    if (discount) { query += " AND discount = 1"; }
    if (limit) { query += ` LIMIT ${parseInt(limit)}`; }

    const products = await all(query, params);
    res.json(products.map(p => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      variants: JSON.parse(p.variants || '[]')
    })));
  } catch (err) {
    console.error('Products error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await all("SELECT * FROM categories ORDER BY id");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/sellers', async (req, res) => {
  try {
    const sellers = await all("SELECT s.*, u.email FROM sellers s JOIN users u ON s.user_id = u.id");
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/sellers/:id/products', async (req, res) => {
  try {
    const products = await all("SELECT * FROM products WHERE seller_id = ?", [req.params.id]);
    res.json(products.map(p => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      variants: JSON.parse(p.variants || '[]')
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = (await all("SELECT * FROM users WHERE email = ?", [email]))[0];
    if (user) {
      res.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const result = await run("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [email, password, role || 'customer']);
    res.json({ success: true, userId: result.lastID });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const start = async () => {
  try {
    console.log('Initializing database...');
    await initDb();
    console.log('Seeding database...');
    await seedDb();
    console.log('Database ready.');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
};

start();
