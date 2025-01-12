import { StoragePlugin } from '../core/plugins/types';
import { v4 as uuidv4 } from 'uuid';
import { EventBus } from '../core/events/EventBus';

// Storage types
export const SUPPORTED_STORAGE = ['memory', 'file', 'redis'] as const;
export type SupportedStorage = (typeof SUPPORTED_STORAGE)[number];

// Memory storage implementation
export interface MemoryStorageConfig {
  namespace?: string;
  ttl?: number;
}

export class MemoryStorage implements StoragePlugin {
  public readonly id: string;
  public readonly name: string = 'Memory Storage';
  public readonly version: string = '1.0.0';
  public readonly type = 'storage' as const;

  private storage: Map<string, any> = new Map();
  private ttls: Map<string, number> = new Map();
  private config: Required<MemoryStorageConfig>;
  private eventBus: EventBus;

  constructor(config: MemoryStorageConfig = {}) {
    this.id = `memory-${uuidv4()}`;
    this.config = {
      namespace: 'default',
      ttl: 0, // 0 means no expiration
      ...config,
    };
    this.eventBus = EventBus.getInstance();
  }

  public async initialize(): Promise<void> {
    console.log('Initializing memory storage...');
    // Start TTL cleanup interval if TTL is enabled
    if (this.config.ttl > 0) {
      setInterval(() => this.cleanupExpired(), 60000); // Check every minute
    }
  }

  public async cleanup(): Promise<void> {
    console.log('Cleaning up memory storage...');
    this.storage.clear();
    this.ttls.clear();
  }

  public async get(key: string): Promise<unknown> {
    const fullKey = this.getNamespacedKey(key);
    if (this.isExpired(fullKey)) {
      await this.delete(key);
      return undefined;
    }
    return this.storage.get(fullKey);
  }

  public async set(key: string, value: unknown): Promise<void> {
    const fullKey = this.getNamespacedKey(key);
    this.storage.set(fullKey, value);

    if (this.config.ttl > 0) {
      this.ttls.set(fullKey, Date.now() + this.config.ttl);
    }

    this.eventBus.publish('system', this.id, {
      type: 'storage',
      component: 'memory',
      message: 'Value stored',
      data: { key: fullKey },
    });
  }

  public async delete(key: string): Promise<void> {
    const fullKey = this.getNamespacedKey(key);
    this.storage.delete(fullKey);
    this.ttls.delete(fullKey);

    this.eventBus.publish('system', this.id, {
      type: 'storage',
      component: 'memory',
      message: 'Value deleted',
      data: { key: fullKey },
    });
  }

  private getNamespacedKey(key: string): string {
    return `${this.config.namespace}:${key}`;
  }

  private isExpired(key: string): boolean {
    const ttl = this.ttls.get(key);
    if (!ttl) return false;
    return Date.now() > ttl;
  }

  private cleanupExpired(): void {
    for (const [key, ttl] of this.ttls.entries()) {
      if (Date.now() > ttl) {
        this.storage.delete(key);
        this.ttls.delete(key);
      }
    }
  }
}
