const request = require('supertest');
const { app, server } = require('../app'); // Adjust the path as necessary
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: "postgres://postgres:password@db:5432/leaderboard"
});

beforeEach(async () => {
  await pool.query('BEGIN');
});

afterEach(async () => {
  await pool.query('ROLLBACK');
});

afterAll(async () => {
  await pool.end();
  server.close(); // Ensure the server is closed after all tests
}, 5000); // Increase the timeout to 10000 milliseconds (10 seconds)

describe('GET /', () => {
  it('should return a 200 status code', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
  });
});

describe('Database Tests', () => {
  it('should return a 200 status code for /api/test-db', async () => {
    const res = await request(app).get('/api/test-db');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('Database connection is working');
  });
});