const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 8090;

require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

console.log(`Server starting on ${port}`);

app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leaderboard');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).send('Error loading leaderboard');
  }
});

app.put('/api/leaderboard', async (req, res) => {
  console.log("here" + req.body);
  const { name, score } = req.body;
  if (!name || !score) {
    return res.status(400).send('Name and score are required');
  }

  try {
    const result = await pool.query(
      'INSERT INTO leaderboard (name, score) VALUES ($1, $2) RETURNING *',
      [name, score]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting into database:', err);
    res.status(500).send('Error adding to leaderboard');
  }
});

app.use((req, res) => {
  logRequestDetails(req);
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});