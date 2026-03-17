const express = require('express');
const cors = require('cors');
const { initDb, seedDb, all, run } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;


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
