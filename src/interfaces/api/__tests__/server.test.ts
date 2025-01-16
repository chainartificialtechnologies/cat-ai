import { APIServer } from '../server';
import supertest from 'supertest';

describe('APIServer', () => {
  let server: APIServer;
  let port: number;

  beforeEach(async () => {
    port = Math.floor(Math.random() * (4000 - 3002 + 1)) + 3002;
    process.env.PORT = port.toString();
    server = new APIServer();
    await server.initialize();
  });

  afterEach(async () => {
    await server.stop();
    delete process.env.PORT;
  });

  describe('Server Initialization', () => {
    it('should initialize with correct configuration', async () => {
      expect(server).toBeDefined();
      expect(server.getServer()).toBeDefined();
    });
  });

  describe('Health Check Route', () => {
    it('should return health status', async () => {
      await server.start();
      const response = await supertest(server.getServer().server)
        .get('/health')
        .expect(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('CORS Middleware', () => {
    it('should allow CORS requests', async () => {
      await server.start();
      const response = await supertest(server.getServer().server)
        .get('/health')
        .expect(200);
      expect(response.headers['access-control-allow-origin']).toBe('*');
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      await server.start();
      // Make multiple requests to trigger rate limiting
      for (let i = 0; i < 10; i++) {
        await supertest(server.getServer().server).get('/health');
      }
      // This request should be rate limited
      const response = await supertest(server.getServer().server)
        .get('/health')
        .expect(429);
      expect(response.body).toHaveProperty('error', 'Too Many Requests');
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 errors', async () => {
      await server.start();
      const response = await supertest(server.getServer().server)
        .get('/nonexistent')
        .expect(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
    });

    it('should handle internal server errors', async () => {
      await server.start();
      // Mock SignalsCalculatorService to throw an error
      const mockSignalsCalculator = {
        generateSignals: jest.fn().mockRejectedValue(new Error('Test error'))
      };
      server.getServer().decorate('signalsCalculator', mockSignalsCalculator);

      const response = await supertest(server.getServer().server)
        .get('/api/v1/signals')
        .expect(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Server Lifecycle', () => {
    it('should start and stop gracefully', async () => {
      await server.start();
      expect(server.getServer().server.listening).toBe(true);
      await server.stop();
      expect(server.getServer().server.listening).toBe(false);
    });
  });
}); 