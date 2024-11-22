const superTest = require('supertest');
const app = require('../app.js');
const express = require('express');

describe('GET /api/leaderboard', () => {
  it('should return a 200 status code', async () => {
    const res = await request(app).get('/api/leaderboard');
    expect(res.statusCode).toEqual(200);
  });

  it('should return an array', async () => {
    const res = await request(app).get('/api/leaderboard');
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('PUT /api/leaderboard', () => {
  it('should return a 200 status code', async () => {
    const res = await request(app)
      .put('/api/leaderboard')
      .send({ Name: 'Test', Score: 100 });
    expect(res.statusCode).toEqual(200);
  });

  it('should return an array', async () => {
    const res = await request(app)
      .put('/api/leaderboard')
      .send({ Name: 'Test', Score: 100 });
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return an array with the new score', async () => {
    const res = await request(app)
      .put('/api/leaderboard')
      .send({ Name: 'Test', Score: 100 });
    expect(res.body).toContainEqual({ Name: 'Test', Score: 100 });
  });
});

describe('GET /game', () => {
  it('should return a 200 status code', async () => {
    const res = await request(app).get('/game');
    expect(res.statusCode).toEqual(200);
  });

  it('should return a ZIP file', async () => {
    const res = await request(app).get('/game');
    expect(res.headers['content-type']).toEqual('application/zip');
  });
});