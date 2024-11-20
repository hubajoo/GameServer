const express = require('express');
//const fs = require('fs');
const { Pool } = require('pg');
//const path = require('path');
const app = express();
const port = 8090;

console.log(`Server starting on ${port}`);

app.get('/api/leaderboard2', (req, res) => {
  const filePath = path.join(__dirname, 'GameFiles', 'leaderboard.txt');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).send('Error loading file');
      return;
    }
    console.log(`File sent to ${req.ip}`);
    res.status(200).type('text/plain').send(data);
  });
});
app.get('/leaderboard', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leaderboard');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).send('Error loading leaderboard');
  }
});

app.use((req, res) => {
  console.log('404');
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});