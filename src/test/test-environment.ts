import NodeEnvironment from 'jest-environment-node';
import { FastifyInstance } from 'fastify';
import { APIServer } from '../interfaces/api/server';
import type { Global } from '@jest/types';

class CustomEnvironment extends NodeEnvironment {
  private server!: APIServer;
  declare global: Global.Global & {
    app: FastifyInstance;
  };

  constructor(config: any, context: any) {
    super(config, context);
  }

  async setup() {
    await super.setup();

    // Set test environment
    process.env.NODE_ENV = 'test';
    process.env.PORT = '3001'; // Use a different port for testing

    // Initialize server
    this.server = new APIServer();
    await this.server.initialize();
    await this.server.start();
    this.global.app = this.server.getServer();
  }

  async teardown() {
    if (this.server) {
      await this.server.stop();
    }
    await super.teardown();
  }
}

export default CustomEnvironment; 