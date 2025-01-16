import { FastifyInstance } from 'fastify';
import { APIServer } from '../interfaces/api/server';

declare global {
  var app: FastifyInstance;
}

export default async function globalSetup() {
  // Set test environment
  process.env.NODE_ENV = 'test';

  // Silence console logs during tests unless debugging is enabled
  if (!process.env.DEBUG) {
    global.console = {
      ...console,
      log: () => {},
      debug: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
    };
  }

  // Initialize server
  const server = new APIServer();
  await server.initialize();
  await server.start();
  global.app = server.getServer();
} 