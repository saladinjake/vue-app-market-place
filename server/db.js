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




const categoryData = [
  {
    name: 'Electronics',
    icon: '',
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
    icon: '',
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
    icon: '',
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
    icon: '',
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
    icon: '',
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
    icon: '',
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
    icon: '',
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
    icon: '',
    description: 'Industrial chemicals, coatings & compounds',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80',
    subs: ['Industrial Solvents', 'Adhesives', 'Paints & Coatings', 'Cleaning Agents', 'Specialty Chemicals'],
    slides: [
      { title: 'Industrial Chemicals', subtitle: 'REACH-compliant bulk chemical supply', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80', cta: 'View Catalog' },
    ]
  },
];

