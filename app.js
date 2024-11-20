const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = 8090;
const cors = require('cors');

require('dotenv').config();

console.log(`Server starting on ${port}`);


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


app.use(express.static(path.join(__dirname, 'client')));

// Enable CORS for all routes
app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'client.html'));
});

//Parse json bodies
app.use(express.json());


app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leaderboard');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).send('Error loading leaderboard');
  }
});

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
  try {
    const { Name, Score } = req.body;
    if (!Name || parseInt(Score) < 0) {
      console.log("Bad request");
      return res.status(400).send('Name and score are required');
    }
    const result = await pool.query(
      'INSERT INTO leaderboard (name, score) VALUES ($1, $2) RETURNING *',
      [Name, parseInt(Score)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {

    console.error('Error inserting into database:', err);
    res.status(500).send('Error adding to leaderboard');
  }
});

app.use((req, res) => {
  console.log('404');
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});