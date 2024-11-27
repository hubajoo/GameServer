const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');
const archiver = require('archiver');
const fs = require('fs');
const { Console } = require('console');
require('dotenv').config();

const app = express();

let port = process.env.PORT || 8090;
let ip = process.env.IP_ADDRESS || '127.0.0.1';
let address = process.env.LOADBALANCER_IP || `${ip}:${port}`;
let activeConfig = "default";

console.log(`Server starting on ${ip}:${port}`);

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Database connection pool
let pool;

// Function to set the database connection pool
async function setPool() {

  // Use the DATABASE_URL environment variable if it exists
  let connectionString = process.env.DATABASE_URL;
  pool = new Pool({ connectionString });

  // Test the database connection
  if (!await testDbConnection()) {

    // If the connection fails, try again with default values
    console.log('Failed to connect to the database, trying again with default values');
    activeConfig = "User, Host, Database, Password, Port";
    // Create a new connection pool with default values
    pool = new Pool({
      user: process.env.POSTGRES_USER,
      host: process.env.DB_HOST,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: 5432,
    });
    activeConfig = "DB_HOST"
  }

  if (!await testDbConnection()) {

    // If the connection fails, try again with default values
    console.log('Failed to connect to the database, trying again with default values');
    // Create a new connection pool with default values
    pool = new Pool({
      user: process.env.POSTGRES_USER,
      host: 'postgres',
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: 5432,
    });
    activeConfig = "postgres"
  }
  if (!await testDbConnection()) {

    // If the connection fails, try again with default values
    console.log('Failed to connect to the database, trying again with default values');
    // Create a new connection pool with default values
    pool = new Pool({
      user: process.env.POSTGRES_USER,
      host: 'db',
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: 5432,
    });
    activeConfig = "db"
  }
}
// Set the database connection pool
setPool();


// Function to test the database connection
async function testDbConnection() {
  try {

    // Connect to the database
    const client = await pool.connect();
    console.log('Connected to the database successfully!');

    // Release the client back to the pool
    client.release();

    // Return true if the connection was successful
    return true;

  } catch (err) {
    console.log(err);
    return false;
  }
}


// Middleware to refresh the data.json file with the server IP
app.use((req, res, next) => {
  try {
    // Read the data.json file
    const filePath = path.join(__dirname, 'client', 'data.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading data.json file:', err);
        return res.status(500).send('Internal Server Error');
      }
      let jsonData;

      // Parse the JSON data
      try {
        jsonData = JSON.parse(data);
      } catch (parseErr) {
        console.error('Error parsing data.json file:', parseErr);
        return res.status(500).send('Internal Server Error');
      }

      // Check if the server IP is already set
      if (jsonData.ServerIP === address) {
        return next();
      }

      if (process.env.POSTGRES_IP) {
        jsonData.PostgresIp = process.env.POSTGRES_IP;
      }

      // Update the server IP in the JSON data
      jsonData.ServerIP = address;


      // Write the updated JSON data back to the file
      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          console.error('Error writing data.json file:', writeErr);
          return res.status(500).send('Internal Server Error');
        }
      });

      // Continue to the next middleware
      next();

    });

  } catch (err) {

    // Error handling
    console.error('Error handling request:', err);
    res.status(500).send('Internal Server Error');

  }
});

// Serve static files from the 'client' directory
app.use(express.static(path.join(__dirname, 'client')));


// Endpoint to test the database connection
app.get('/api/test-db', async (req, res) => {
  try {
    // Test the database connection
    const result = await pool.query('SELECT 1');
    console.log('Database connection is working');
    res.status(200).send('Database connection is working');

  } catch (err) {

    // Error handling
    console.error('Error testing database connection:', err);
    let message = testDbConnection() ? 'Query failure ' : 'Error testing database connection ';
    message += activeConfig;
    res.status(500).send(message);
  }
});

// Endpoint to get the leaderboard from the database
app.get('/api/leaderboard', async (req, res) => {
  try {

    // Query the database for the top 50 scores
    const result = await pool.query('SELECT * FROM leaderboard ORDER BY score DESC LIMIT 50');
    res.status(200).json(result.rows);

  } catch (err) {

    // Error handling
    console.error('Error querying database:', err);
    res.status(500).send('Error loading leaderboard');
  }
});

// Endpoint to add a score to the leaderboard
app.put('/api/leaderboard', (req, res) => updateLeaderboard(req, res)
);

// Alternate endpoint to add a score to the leaderboard
app.post('/api/leaderboard', (req, res) => updateLeaderboard(req, res)
);

// Function to add a score to the leaderboard
async function updateLeaderboard(req, res) {
  try {

    // Get the name and score from the request body
    const { Name, Score } = req.body;

    // Log the new score
    console.log("New score  -  Name: " + Name + " Score: " + Score);

    // Check if the name and score are valid
    if (!Name || parseInt(Score) < 0) {
      console.log("Bad request");
      return res.status(400).send('Name and score are required');
    }

    // Insert the new score into the database
    const result = await pool.query(
      'INSERT INTO leaderboard (name, score) VALUES ($1, $2) RETURNING *',
      [Name, parseInt(Score)]
    );

    // Return the new leaderboard entry
    res.status(201).json(result.rows[0]);

  } catch (err) {

    // Error handling
    console.error('Error inserting into database:', err);
    res.status(500).send('Error adding to leaderboard');
  }
};

// Endpoint to download the folder as a ZIP file
app.get('/game/:username', (req, res) => {
  try {

    // Get the name from the request parameters
    const name = req.params.username ? req.params.username : 'Jane Doe';

    // Define the settings file path
    const filePath = path.join("GameFiles/Data", 'settings.txt');

    // Read the settings file
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading settings file:', err);
        return res.status(500).send('Internal Server Error');
      }

      // Update the PlayerName and ServerUrl in the settings file
      if (data.includes('PlayerName')) {
        data = data.replace(/PlayerName=.*/g, `PlayerName=${name}`);
      }
      if (data.includes('ServerUrl')) {
        data = data.replace(/ServerUrl=.*/g, `ServerUrl=${address}`);
      }

      if (!data.includes('PlayerName') && !data.includes('ServerUrl')) {
        data += `PlayerName=${name}\nServerUrl=${address}`;
      }


      // Write the updated settings back to the file
      fs.writeFile(filePath, data, 'utf8', (writeErr) => {
        if (writeErr) {
          console.error('Error writing settings file:', writeErr);
          return res.status(500).send('Internal Server Error');
        }
      });
    });

  } catch (err) {
    // Error handling
    console.error('Error handling request:', err);
    res.status(500).send('Internal Server Error');
  }

  // Set the folder path and ZIP file name
  const folderPath = path.join(__dirname, 'GameFiles');
  const zipFileName = 'HubaGame.zip';

  // Set the headers for the ZIP file download
  res.setHeader('Content-Disposition', `attachment; filename=${zipFileName}`);
  res.setHeader('Content-Type', 'application/zip');

  // Create a ZIP archive and stream it to the client
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level
  });

  // Error handling
  archive.on('error', (err) => {
    throw err;
  });

  // Pipe the ZIP archive to the response stream
  archive.pipe(res);

  // Add the folder to the ZIP archive
  archive.directory(folderPath, false);

  // Finalize the ZIP archive
  archive.finalize();
});

// Catch-all route to handle any other requests
app.use((req, res) => {
  console.log('404');
  res.status(404).send('Not Found'); // Send a 404 response
});

// Error handling middleware
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening on ${ip}:${port}`);
});

// Export the Express app and the server for testing
module.exports = { app, server };