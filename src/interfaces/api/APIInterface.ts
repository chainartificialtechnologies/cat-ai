import { InterfacePlugin } from '../../core/plugins/types';
import { v4 as uuidv4 } from 'uuid';
import { EventBus } from '../../core/events/EventBus';

export interface APIConfig {
  port: number;
  host?: string;
  cors?: {
    origin: string | string[];
    methods?: string[];
  };
  auth?: {
    type: 'none' | 'apiKey' | 'jwt';
    secret?: string;
    apiKeys?: string[];
  };
  rateLimit?: {
    windowMs: number;
    maxRequests: number;
  };
  websocket: {
    enabled: boolean;
    path?: string;
  };
}

export class APIInterface implements InterfacePlugin {
  public readonly id: string;
  public readonly name: string = 'API Interface';
  public readonly version: string = '1.0.0';
  public readonly type = 'interface' as const;

  private config: APIConfig;
  private messageCallback?: (message: string) => Promise<void>;
  private eventBus: EventBus;
  private connections: Set<any> = new Set();

  constructor(config: APIConfig) {
    this.id = `api-${uuidv4()}`;
    this.config = {
      ...{
        host: 'localhost',
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
        },
        auth: {
          type: 'none',
        },
        websocket: {
          enabled: true,
          path: '/ws',
        },
      },
      ...config,
    };
    this.eventBus = EventBus.getInstance();
  }

  public async initialize(): Promise<void> {
    // TODO: Initialize HTTP server and WebSocket server
    console.log(`Initializing API interface on port ${this.config.port}...`);

    if (this.config.websocket.enabled) {
      console.log(`WebSocket server enabled on path: ${this.config.websocket.path}`);
    }

    // Simulate periodic status updates via WebSocket
    if (this.config.websocket.enabled) {
      setInterval(() => {
        this.broadcastStatus();
      }, 30000);
    }
  }

  public async cleanup(): Promise<void> {
    // TODO: Close all connections and shutdown servers
    console.log('Cleaning up API interface...');
    this.connections.clear();
  }

  public async sendMessage(message: string): Promise<void> {
    // Broadcast message to all WebSocket clients
    console.log('Broadcasting message to all clients:', message);

    this.eventBus.publish('message', this.id, {
      platform: 'api',
      channelId: 'broadcast',
      userId: 'system',
      content: message,
    });
  }

  public onMessage(callback: (message: string) => Promise<void>): void {
    this.messageCallback = callback;
  }

  private broadcastStatus(): void {
    const status = {
      timestamp: new Date(),
      activeConnections: this.connections.size,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    };

    this.eventBus.publish('system', this.id, {
      type: 'status',
      component: 'api',
      message: 'Status update',
      data: status,
    });
  }

  // REST API endpoint handlers would go here
  /** 
   * @internal
   * Will be used when HTTP/WebSocket server is implemented to handle incoming API commands
   */
  // @ts-ignore - Will be used when HTTP/WebSocket server is implemented
  private async handleCommand(command: string, params: Record<string, unknown>): Promise<void> {
    if (this.messageCallback) {
      const message = JSON.stringify({ command, params });
      await this.messageCallback(message);
    }
  }
}
