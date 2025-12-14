
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3001;

// PostgreSQL client setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create table if it doesn't exist
const createTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS motd (
        id SERIAL PRIMARY KEY,
        message TEXT NOT NULL
      );
    `);
    // Insert a default message if the table is empty
    await client.query(`
      INSERT INTO motd (message)
      SELECT 'This is the default message of the day.'
      WHERE NOT EXISTS (SELECT 1 FROM motd);
    `);
  } finally {
    client.release();
  }
};
createTable();

// Middleware to parse JSON
app.use(express.json());

// API endpoint to get the message of the day
app.get('/api/motd', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT message FROM motd ORDER BY id DESC LIMIT 1');
    res.status(200).json(result.rows[0]);
    client.release();
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve message of the day' });
  }
});

// API endpoint to set the message of the day
app.post('/api/motd', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  try {
    const client = await pool.connect();
    await client.query('INSERT INTO motd (message) VALUES ($1)', [message]);
    res.status(201).json({ success: true });
    client.release();
  } catch (err) {
    res.status(500).json({ error: 'Failed to set message of the day' });
  }
});


// API endpoint to check database connection
app.get('/api/health', async (req, res) => {
  try {
    const client = await pool.connect();
    res.status(200).json({ status: 'Connected to database' });
    client.release();
  } catch (err) {
    res.status(500).json({ error: 'Failed to connect to database' });
  }
});

// Serve static files from the 'dist' directory
app.use(express.static('dist'));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
