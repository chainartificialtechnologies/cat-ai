export interface SystemConfig {
  logLevel: LogLevel;
  maxConcurrentActions: number;
  storageConfig: StorageConfig;
  securityConfig: SecurityConfig;
}

export interface SecurityConfig {
  enableEncryption: boolean;
  allowedOrigins?: string[];
  rateLimit?: RateLimitConfig;
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface StorageConfig {
  type: 'memory' | 'file' | 'redis';
  options?: {
    path?: string;
    url?: string;
    ttl?: number;
  };
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface AIProviderConfig {
  type: string;
  apiKey: string;
  model?: string;
  options?: Record<string, unknown>;
}

export interface InterfaceConfig {
  type: string;
  credentials?: Record<string, string>;
  options?: Record<string, unknown>;
}

export interface ActionConfig {
  type: string;
  enabled: boolean;
  permissions: string[];
  options?: Record<string, unknown>;
}
