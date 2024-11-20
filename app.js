const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 8090;

console.log(`Server starting on ${port}`);

app.all('/', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  console.log(req.url);
  res.status(404).send('request');
});

app.get('/api/leaderboard', (req, res) => {
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

app.use((req, res) => {
  console.log('404');
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});