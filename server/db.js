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
    status TEXT DEFAULT 'pending',
    FOREIGN KEY(category_id) REFERENCES categories(id),
    FOREIGN KEY(seller_id) REFERENCES sellers(id)
  )`);

  try { await run("ALTER TABLE products ADD COLUMN status TEXT DEFAULT 'pending'"); } catch(e) {}
  await run("UPDATE products SET status = 'approved' WHERE status = 'pending'");

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




const categoryData = [
  {
    name: 'Electronics',
    icon: '🔌',
    description: 'Components, semiconductors, IoT devices',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    subs: ['Semiconductors', 'PCB Components', 'IoT Modules', 'Power Systems', 'Sensors'],
    slides: [
      { title: 'Smart Electronics 2026', subtitle: 'Next-gen IoT components for industrial automation', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', cta: 'Shop Now' },
      { title: 'Semiconductor Solutions', subtitle: 'Bulk pricing on IC chips & microcontrollers', image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&q=80', cta: 'Get Quote' },
      { title: 'PCB Manufacturing', subtitle: 'Custom PCB boards at scale', image: 'https://images.unsplash.com/photo-1601132359864-c974e79890ac?w=800&q=80', cta: 'Explore' },
    ]
  },
  {
    name: 'Industrial',
    icon: '🏭',
    description: 'Machinery, tools & manufacturing equipment',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&q=80',
    subs: ['Heavy Machinery', 'Pumps & Valves', 'Hydraulics', 'CNC Equipment', 'Safety Tools'],
    slides: [
      { title: 'Heavy Machinery', subtitle: 'Industrial-grade equipment for global operations', image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80', cta: 'Browse' },
      { title: 'Hydraulic Systems', subtitle: 'High-pressure solutions for demanding environments', image: 'https://images.unsplash.com/photo-1565792073065-3cdba98c42f7?w=800&q=80', cta: 'Learn More' },
      { title: 'CNC & Precision', subtitle: 'Computer-controlled machining at volume', image: 'https://images.unsplash.com/photo-1581091870622-5829d983ccfb?w=800&q=80', cta: 'View Range' },
    ]
  },
  {
    name: 'Fashion & Apparel',
    icon: '👔',
    description: 'Wholesale clothing, textiles & accessories',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
    subs: ['Womens Wear', 'Mens Wear', 'Sportswear', 'Accessories', 'Fabrics & Textiles'],
    slides: [
      { title: 'Spring Collection 2026', subtitle: 'Wholesale fashion at competitive MOQs', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80', cta: 'View Collection' },
      { title: 'Performance Sportswear', subtitle: 'Technical fabrics for active lifestyles', image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&q=80', cta: 'Shop Sport' },
    ]
  },
  {
    name: 'Home & Garden',
    icon: '🏠',
    description: 'Furniture, décor, tools & outdoor',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
    subs: ['Furniture', 'Lighting', 'Garden Tools', 'Kitchen & Bath', 'Storage Solutions'],
    slides: [
      { title: 'Wholesale Furniture', subtitle: 'Premium collections for retail buyers', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', cta: 'Explore' },
      { title: 'Smart Lighting', subtitle: 'Energy-efficient solutions for modern spaces', image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80', cta: 'See Range' },
    ]
  },
  {
    name: 'Automotive',
    icon: '🚗',
    description: 'Parts, accessories & fleet solutions',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80',
    subs: ['OEM Parts', 'Aftermarket', 'Fleet Management', 'Tires & Wheels', 'Electrical Parts'],
    slides: [
      { title: 'OEM Auto Parts', subtitle: 'Factory-certified components at scale', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80', cta: 'Browse Parts' },
      { title: 'Fleet Solutions', subtitle: 'Everything for your commercial fleet', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', cta: 'Get Quote' },
    ]
  },
  {
    name: 'Health & Beauty',
    icon: '🏥',
    description: 'Medical supplies, cosmetics & wellness',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
    subs: ['Medical Devices', 'Pharmaceuticals', 'Cosmetics', 'Wellness', 'Lab Supplies'],
    slides: [
      { title: 'Medical Supplies', subtitle: 'WHO-certified medical equipment & PPE', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80', cta: 'Order Now' },
      { title: 'Cosmetics & Skincare', subtitle: 'OEM beauty products for your brand', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80', cta: 'Browse' },
    ]
  },
  {
    name: 'Food & Agriculture',
    icon: '🌾',
    description: 'Commodities, packaged goods & agri tools',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80',
    subs: ['Grains & Cereals', 'Fresh Produce', 'Processed Foods', 'Agri Equipment', 'Fertilisers'],
    slides: [
      { title: 'Global Commodities', subtitle: 'Sourcing grains, oils and raw food at scale', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80', cta: 'Source Now' },
      { title: 'Agri Technology', subtitle: 'Smart farming equipment & precision tools', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80', cta: 'Explore' },
    ]
  },
  {
    name: 'Chemicals',
    icon: '🧪',
    description: 'Industrial chemicals, coatings & compounds',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80',
    subs: ['Industrial Solvents', 'Adhesives', 'Paints & Coatings', 'Cleaning Agents', 'Specialty Chemicals'],
    slides: [
      { title: 'Industrial Chemicals', subtitle: 'REACH-compliant bulk chemical supply', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80', cta: 'View Catalog' },
    ]
  },
];



const seedDb = async () => {
  const userCount = await all("SELECT COUNT(*) as count FROM users");
  if (userCount[0].count > 0) return;

  const hashedPassword = await bcrypt.hash('password123', 10);

  for (let i = 1; i <= 30; i++) {
    let role = 'customer';
    if (i <= 5) role = 'admin';
    else if (i <= 15) role = 'seller';
    await run("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [`user${i}@example.com`, hashedPassword, role]);
  }

  const sellers = await all("SELECT id FROM users WHERE role = 'seller'");
  for (const s of sellers) {
    await run("INSERT INTO sellers (user_id, store_name, verification_status, logo) VALUES (?, ?, ?, ?)", [
      s.id,
      `Store ${s.id}`,
      s.id % 3 === 0 ? 'pending' : 'verified',
      `https://picsum.photos/seed/${s.id}store/200`
    ]);
  }

  for (const cat of categoryData) {
    const catRes = await run(
      "INSERT INTO categories (name, image, icon, description) VALUES (?, ?, ?, ?)",
      [cat.name, cat.image, cat.icon, cat.description]
    );
    const parentId = catRes.lastID;

    // Subcategories
    for (const sub of cat.subs) {
      await run("INSERT INTO categories (name, parent_id, image) VALUES (?, ?, ?)", [
        sub, parentId, `https://picsum.photos/seed/${sub.replace(/\s/g, '')}/400/300`
      ]);
    }

    for (let i = 0; i < cat.slides.length; i++) {
      const sl = cat.slides[i];
      await run(
        "INSERT INTO category_slides (category_id, title, subtitle, image, cta_label, cta_link, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [parentId, sl.title, sl.subtitle, sl.image, sl.cta, `/products?category=${parentId}`, i]
      );
    }
  }

  const categories = await all("SELECT id FROM categories WHERE parent_id IS NOT NULL");
  const sellerRecords = await all("SELECT id FROM sellers WHERE verification_status = 'verified'");

  const productNames = [
    'Industrial Valve XJ-900', 'Smart PCB Module Pro', 'Hydraulic Pump H-400', 'LED Panel System',
    'CNC Router Bit Set', 'Thermal Camera Unit', 'Organic Cotton Roll', 'Ceramic Tile Cutter',
    'Solar Inverter 5KW', 'Stainless Steel Pipe', 'Carbon Fiber Sheet', 'Wireless Sensor Node',
    'Industrial Fan 24V', 'Precision Caliper Set', 'Electric Forklift', 'UV Sterilizer Pro',
    'Industrial Adhesive', 'Servo Motor 1.8Nm', 'Medical Grade Mask', 'Aluminum Profile 4080',
    'BLDC Motor 250W', 'Chemical Pump Seal', 'Air Compressor 50L', 'Fire Suppression Kit',
    'PLCs Control Board', 'Glass Fiber Resin', 'High Torque Gearbox', 'SS Flanged Coupling',
    'Automotive ECU Unit', 'Pressure Gauge 100bar'
  ];

  const layouts = ['standard', 'standard', 'standard', 'wide', 'tall', 'carousel-lead'];

  for (let i = 0; i < 60; i++) {
    const catId = categories[i % categories.length].id;
    const sellerId = sellerRecords[i % sellerRecords.length].id;
    const price = (Math.random() * 800 + 15).toFixed(2);
    const layout = layouts[Math.floor(Math.random() * layouts.length)];
    const name = productNames[i % productNames.length] + (i >= productNames.length ? ` v${Math.floor(i / productNames.length) + 1}` : '');

    await run(
      `INSERT INTO products (name, price, description, category_id, seller_id, inventory, images, variants, grid_layout, featured, new_arrival, top_seller, discount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        price,
        `High-quality B2B industrial product. ${name} designed for demanding commercial applications with proven reliability.`,
        catId,
        sellerId,
        Math.floor(Math.random() * 500) + 50,
        JSON.stringify([
          `https://picsum.photos/seed/prd${i}a/800/600`,
          `https://picsum.photos/seed/prd${i}b/800/600`,
          `https://picsum.photos/seed/prd${i}c/800/600`
        ]),
        JSON.stringify([
          { type: 'Color', options: ['Silver', 'Black', 'Blue'] },
          { type: 'Grade', options: ['Standard', 'Premium', 'Industrial'] }
        ]),
        layout,
        i % 6 === 0 ? 1 : 0,
        i % 8 === 0 ? 1 : 0,
        i % 4 === 0 ? 1 : 0,
        i % 10 === 0 ? 1 : 0
      ]
    );
  }
};

module.exports = { db, initDb, seedDb, all, run };
