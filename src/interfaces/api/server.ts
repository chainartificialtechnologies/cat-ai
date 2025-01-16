import Fastify, { FastifyInstance } from 'fastify';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyCors from '@fastify/cors';
import { SIGNALS_CONFIG } from '../../core/config/signals.config';
import signalsPlugin from './plugins/signals.plugin';
import { SignalsCalculatorService } from '../../actions/crypto/services/signals-calculator.service';

export class APIServer {
  private server: FastifyInstance;
  private signalsCalculator: SignalsCalculatorService;

  constructor() {
    this.server = Fastify({
      logger: {
        level: 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        },
      },
      ajv: {
        customOptions: {
          removeAdditional: false,
          useDefaults: true,
          coerceTypes: true,
          allErrors: true,
        },
      },
    });
    this.signalsCalculator = new SignalsCalculatorService();
  }

  public getServer(): FastifyInstance {
    return this.server;
  }

  private async registerMiddleware(): Promise<void> {
    // Register CORS
    await this.server.register(fastifyCors, {
      origin: true, // For development; customize for production
      methods: ['GET'],
      allowedHeaders: ['Content-Type'],
      exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
      credentials: true,
      maxAge: 86400, // 24 hours
    });

    // Register rate limiter
    await this.server.register(fastifyRateLimit, {
      max: SIGNALS_CONFIG.api.rateLimitConfig.max,
      timeWindow: SIGNALS_CONFIG.api.rateLimitConfig.timeWindow,
      errorResponseBuilder: function (_request, context) {
        return {
          error: 'Too Many Requests',
          statusCode: 429,
          message: `Rate limit exceeded. Try again in ${context.after}`,
          expiresIn: context.after,
        };
      },
    });
  }

  private registerRoutes(): void {
    // Health check route
    this.server.get('/health', {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              timestamp: { type: 'string' },
              version: { type: 'string' },
              uptime: { type: 'number' },
            },
          },
        },
      },
    }, async () => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '0.1.0',
        uptime: process.uptime(),
      };
    });

    // Not found handler
    this.server.setNotFoundHandler((request, reply) => {
      reply.status(404).send({
        error: 'Not Found',
        message: `Route ${request.method}:${request.url} not found`,
        statusCode: 404,
      });
    });
  }

  async initialize(): Promise<void> {
    try {
      // Register middleware
      await this.registerMiddleware();

      // Register routes
      this.registerRoutes();

      // Register signals plugin with prefix
      await this.server.register(signalsPlugin, { 
        prefix: '/api/v1',
        signalsCalculator: this.signalsCalculator
      });

      // Global error handler
      this.server.setErrorHandler((error, request, reply) => {
        const statusCode = error.statusCode || 500;
        
        request.log.error(error);
        
        // Don't expose internal server errors to the client
        const message = statusCode === 500 
          ? 'Internal Server Error'
          : error instanceof Error ? error.message : 'Unknown error';

        reply.status(statusCode).send({
          error: statusCode === 500 ? 'Internal Server Error' : error.name || 'Error',
          message,
          statusCode,
          path: request.url,
          method: request.method,
          timestamp: new Date().toISOString(),
        });
      });

    } catch (error) {
      throw error;
    }
  }

  async start(): Promise<void> {
    try {
      const port = process.env.NODE_ENV === 'test' ? 3001 : SIGNALS_CONFIG.api.port;
      const address = await this.server.listen({
        port,
        host: SIGNALS_CONFIG.api.host,
      });
      
      console.log(`Server is running on ${address}`);
      console.log(`Health check: ${address}/health`);
      console.log(`Signals API: ${address}/api/v1/signals`);
      
    } catch (error) {
      console.error('Failed to start server:', error);
      throw error; // Throw instead of process.exit
    }
  }

  async stop(): Promise<void> {
    try {
      await this.server.close();
      console.log('Server stopped gracefully');
    } catch (error) {
      console.error('Failed to stop server:', error);
      throw error;
    }
  }
} 