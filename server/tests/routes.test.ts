
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import { setupRoutes } from '../routes';

describe('API Routes', () => {
  const app = express();
  setupRoutes(app);
  const request = supertest(app);

  it('GET /api/health returns 200', async () => {
    const response = await request.get('/api/health');
    expect(response.status).toBe(200);
  });

  it('POST /api/auth/login validates input', async () => {
    const response = await request.post('/api/auth/login').send({
      email: 'invalid',
      password: '123'
    });
    expect(response.status).toBe(400);
  });
});
