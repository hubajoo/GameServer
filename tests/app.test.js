
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
}, 10000);


describe('GET /', () => {
  it('should return a 200 status code', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
  });
  it('should return index.html', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
  });
  it('should return script.js', async () => {
    const res = await request(app).get('/script.js');
    expect(res.statusCode).toEqual(200);
  });
  it('should return style.css', async () => {
    const res = await request(app).get('/style.css');
    expect(res.statusCode).toEqual(200);
  });
  it('should return data.json', async () => {
    const res = await request(app).get('/data.json');
    expect(res.statusCode).toEqual(200);
  });
  it('should return 404 for invalid route', async () => {
    const res = await request(app).get('/invalid');
    expect(res.statusCode).toEqual(404);
  });
});


describe('GET /api/test-db', () => {
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

describe('GET /api/game/:username', () => {
  it('should return a 200 status code and a zip file', async () => {
    const res = await request(app).get('/api/game/:username');
    expect(res.statusCode).toEqual(200);
    expect(res.headers['content-type']).toBe('application/zip; charset=utf-8');
  });
}, 10000);

describe('POST /api/leaderboard', () => {
  it('should return a 201 status code', async () => {
    const res = await request(app)
      .post('/api/leaderboard')
      .send({ Name: 'test', Score: 100 });
    expect(res.statusCode).toEqual(201);
  });
  it('should return a 400 status code for invalid data', async () => {
    const res = await request(app)
      .post('/api/leaderboard')
      .send({ name: 'test' });
    expect(res.statusCode).toEqual(400);
  });
});

describe('data.json', () => {
  it('should contain the ServerIp', async () => {
    const res = await request(app).get('/data.json');
    expect(res.statusCode).toEqual(200);
    const data = await JSON.parse(res.text);
    const address = data.ServerIp;
    expect(address).toBe(undefined);
  });
});
