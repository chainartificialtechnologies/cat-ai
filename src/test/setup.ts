import { FastifyInstance } from 'fastify';
import { APIServer } from '../interfaces/api/server';
import nock from 'nock';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      app: FastifyInstance;
    }
  }

  // Add global app property
  var app: FastifyInstance;
}

// Silence console logs during tests unless debugging is enabled
if (!process.env.DEBUG) {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
}

// Set test environment
process.env.NODE_ENV = 'test';

// Initialize server before tests
beforeAll(async () => {
  const server = new APIServer();
  await server.initialize();
  await server.start();
  global.app = server.getServer();
}, 30000);

// Clean up after tests
afterAll(async () => {
  await global.app.close();
  nock.cleanAll();
  nock.restore();
}, 30000); 