const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Url = require('../models/Url');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Url.deleteMany();
});

describe('POST /shorten', () => {
  it('should return a short URL when given a valid long URL', async () => {
    const response = await request(app)
      .post('/shorten')
      .send({ originalUrl: 'https://example.com' });

    expect(response.statusCode).toBe(200);
    expect(response.body.shortUrl).toMatch(/http:\/\/localhost:5000\/\w+/);
  });

  it('should return 400 if no URL is provided', async () => {
    const response = await request(app).post('/shorten').send({});
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('URL is required');
  });
});

describe('GET /stats/:code', () => {
  it('should return stats for a valid short code', async () => {
    const newUrl = await Url.create({
      originalUrl: 'https://example.com',
      shortCode: 'abc123'
    });

    const response = await request(app).get('/stats/abc123');

    expect(response.statusCode).toBe(200);
    expect(response.body.originalUrl).toBe('https://example.com');
    expect(response.body.clickCount).toBe(0);
  });

  it('should return 404 for an invalid short code', async () => {
    const response = await request(app).get('/stats/invalid');
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('URL not found');
  });
});
