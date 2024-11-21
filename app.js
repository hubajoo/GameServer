const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = 8090;
const cors = require('cors');
const fs = require('fs');
const archiver = require('archiver');

require('dotenv').config();

console.log(`Server starting on ${port}`);


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


// Enable CORS for all routes
app.use(cors());

app.use((req, res, next) => {

  const ip = req.headers['host'];
  //console.log(req.headers['host']);
  const filePath = path.join("client", 'data.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data file:', err);
      return res.status(500).send('Internal Server Error');
    }

    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseErr) {
      console.error('Error parsing JSON data:', parseErr);
      return res.status(500).send('Internal Server Error');
    }

    jsonData.ServerIp = ip;

    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error writing to data file:', writeErr);
        return res.status(500).send('Internal Server Error');
      }

      next();
    });
  });
});
app.use(express.static(path.join(__dirname, 'client')));


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

// Endpoint to download the folder as a ZIP file
app.get('/game:name', (req, res) => {
  try {
    const filePath = path.join("GameFiles/Data", 'settings.txt');
    const ip = req.connection.localAddress.split(":").pop();
    console.log("ip " + ip);
    const name = req.params.name;
    const logMessage = `ServerUrl=${ip}\nName=${name}\n`;
    console.log(logMessage);

    fs.appendFile(filePath, logMessage, (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
      }
    });

    const folderPath = path.join(__dirname, 'GameFiles');
    const zipFileName = 'HubaGame.zip';

    res.setHeader('Content-Disposition', `attachment; filename=${zipFileName}`);
    res.setHeader('Content-Type', 'application/zip');

    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(res);

    archive.directory(folderPath, false);

    archive.finalize();
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