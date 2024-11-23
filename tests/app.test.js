
const request = require('supertest');
const { app, server } = require('../app'); // Adjust the path as necessary
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

beforeEach(async () => {
  await pool.query('BEGIN');
});

afterEach(async () => {
  await pool.query('ROLLBACK');
});

afterAll(async () => {
  await pool.end();
  server.close();
}, 5000);


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

describe('GET /api/leaderboard', () => {
  it('should return a 200 status code and an array of objects', async () => {
    const res = await request(app).get('/api/leaderboard');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /Game:username', () => {
  it('should return a 200 status code and a zip file', async () => {
    const res = await request(app).get('/Game:username');
    expect(res.statusCode).toEqual(200);
    expect(res.headers['content-type']).toBe('application/zip; charset=utf-8');
  });
});

describe('POST /api/leaderboard', () => {
  it('should return a 201 status code', async () => {
    const res = await request(app)
      .post('/api/leaderboard')
      .send({ name: 'test', score: 100 });
    expect(res.statusCode).toEqual(201);
  });
  /*
  it('should return a 400 status code for invalid data', async () => {
    const res = await request(app)
      .post('/api/leaderboard')
      .send({ name: 'test' });
    expect(res.statusCode).toEqual(400);
  });
  it('should update the leaderboard', async () => {
    let tname = 'test';
    let tscore = 100;
    const res = await request(app)
      .post('/api/leaderboard')
      .send({ name: tname, score: tscore });
    const leaderboard = await request(app).get('/api/leaderboard');
    expect(leaderboard.body.includes(tname)).toBe(true);
  });
  */
});
