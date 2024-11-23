const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');
const archiver = require('archiver');
const fs = require('fs');
require('dotenv').config();

const app = express();

let port = process.env.PORT || 8090;
let ip = process.env.IP_ADDRESS || '127.0.0.1';
let address = `${ip}:${port}`;
console.log(`Server starting on ${ip}:${port}`);

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());
/*
// Connect to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
*/
// Connect to the database
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: 'db', // Use the service name defined in docker-compose.yaml
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

// Function to test the database connection
async function testDbConnection() {
  try {
    const client = await pool.connect();
    console.log('Connected to the database successfully!');
    client.release();
  } catch (err) {
    console.error('Error testing database connection:', err);
  }
}

testDbConnection();


// Middleware to refresh the data.json file with the server IP
app.use((req, res, next) => {
  const filePath = path.join(__dirname, 'client', 'data.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data.json file:', err);
      return res.status(500).send('Internal Server Error');
    }

    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseErr) {
      console.error('Error parsing data.json file:', parseErr);
      return res.status(500).send('Internal Server Error');
    }

    jsonData.serverIP = address;

    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error writing data.json file:', writeErr);
        return res.status(500).send('Internal Server Error');
      }
    });
    next();
  });
});

// Serve static files from the 'client' directory
app.use(express.static(path.join(__dirname, 'client')));


// Endpoint to test the database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1');
    res.status(200).send('Database connection is working');
  } catch (err) {
    console.error('Error testing database connection:', err);
    res.status(500).send('Error testing database connection');
  }
});

// Endpoint to get the leaderboard from the database
app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leaderboard ORDER BY score DESC LIMIT 50');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).send('Error loading leaderboard');
  }
});

// Endpoint to add a score to the leaderboard
app.put('/api/leaderboard', (req, res) => updateLeaderboard(req, res)
);

// Endpoint to add a score to the leaderboard
app.post('/api/leaderboard', (req, res) => updateLeaderboard(req, res)
);

// Function to add a score to the leaderboard
async function updateLeaderboard(req, res) {
  try {
    const { Name, Score } = req.body;
    console.log("New score  -  Name: " + Name + " Score: " + Score);
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
};

// Endpoint to download the folder as a ZIP file
app.get('/game:name', (req, res) => {
  try {
    const filePath = path.join("GameFiles/Data", 'settings.txt');
    const ip = req.connection.localAddress.split(":").pop();
    const name = req.params.name;
    console.log("name " + name);
    const logMessage = `ServerUrl=${ip}\nName=${name}\n`;
    console.log(logMessage);

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading settings file:', err);
        return res.status(500).send('Internal Server Error');
      }

      if (!data.includes(`ServerUrl=${ip}`)) {
        fs.appendFile(filePath, logMessage + '\n', (err) => {
          if (err) {
            console.error('Error writing to log file:', err);
            return res.status(500).send('Internal Server Error');
          }
          res.status(200).send('Settings updated');
        });
      } else {
        res.status(200).send('ServerUrl already exists in settings file');
      }
    });
  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).send('Internal Server Error');
  }

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
});

app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

app.use((req, res) => {
  console.log('404');
  res.status(404).send('Not Found');
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening on ${ip}:${port}`);
});

module.exports = { app, server }; // Export the Express instance and the server