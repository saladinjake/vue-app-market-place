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


const start = async () => {
  try {
    console.log('Initializing database...');
    await initDb();
    console.log('Seeding database...');
    +  await seedDb();
    console.log('Database ready.');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
};

start();

