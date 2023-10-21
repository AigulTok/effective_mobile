require('dotenv').config();
const request = require('supertest');
const { loadApp } = require('../src/app');
const { PrismaClient } = require('@prisma/client');
const rabbitmq = require('../src/rabbitmq');

describe('Users API', () => {
  let app;
  let prisma;

  beforeAll(async () => {
    app = await loadApp();
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await rabbitmq.disconnect();
    await prisma.user.deleteMany({
      where: {
        email: 'test@example.com',
      },
    });
    await prisma.user.deleteMany({
      where: {
        email: 'updated@example.com',
      },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password',
      };

      const response = await request(app).post('/api/users').send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('test@example.com');

      user = response.body;
    });

    it('should return a 400 error if validation failed', async () => {
      const userData = {
        email: 'test@example',
        password: '1234',
      };

      const response = await request(app).post('/api/users').send(userData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toHaveLength(2);
      expect(response.body.errors[0].msg).toBe('Invalid email address');
      expect(response.body.errors[1].msg).toBe('Password must be at least 6 characters long');
    });

    it('should return a 409 error if the user already exists', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password',
      };

      const response = await request(app).post('/api/users').send(userData);

      expect(response.status).toBe(409);
    });

    it('should update an existing user', async () => {
      const userId = user.id;
      const userData = {
        email: 'updated@example.com',
        password: 'newPassword',
      };

      const response = await request(app).put(`/api/users/${userId}`).send(userData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('updated@example.com');
    });

    it('should return a 400 error if userId format is incorrect', async () => {
      const userId = '44s';
      const userData = {
        email: 'updated@example',
        password: '1234',
      };

      const response = await request(app).put(`/api/users/${userId}`).send(userData);

      expect(response.status).toBe(400);
    });

    it('should return a 400 error if validation failed', async () => {
      const userId = user.id;
      const userData = {
        email: 'updated@example',
        password: '1234',
      };

      const response = await request(app).put(`/api/users/${userId}`).send(userData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toHaveLength(2);
      expect(response.body.errors[0].msg).toBe('Invalid email address');
      expect(response.body.errors[1].msg).toBe('Password must be at least 6 characters long');
    });

    it('should return a 404 error if the user does not exist when updating', async () => {
      const userId = 100;
      const userData = {
        email: 'updated@example.com',
        password: 'newPassword',
      };

      const response = await request(app).put(`/api/users/${userId}`).send(userData);

      expect(response.status).toBe(404);
    });

    it('should return a list of users', async () => {
      const response = await request(app).get('/api/users');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
