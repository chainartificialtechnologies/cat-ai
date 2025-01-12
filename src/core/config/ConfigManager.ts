import { EventEmitter } from 'events';
import { SystemConfig, AIProviderConfig, InterfaceConfig, ActionConfig, LogLevel } from './types';

export class ConfigManager extends EventEmitter {
  private static instance: ConfigManager;
  private config: SystemConfig;
  private aiConfigs: Map<string, AIProviderConfig> = new Map();
  private interfaceConfigs: Map<string, InterfaceConfig> = new Map();
  private actionConfigs: Map<string, ActionConfig> = new Map();

  private constructor() {
    super();
    this.config = this.getDefaultConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private getDefaultConfig(): SystemConfig {
    return {
      logLevel: 'info',
      maxConcurrentActions: 5,
      storageConfig: {
        type: 'memory',
      },
      securityConfig: {
        enableEncryption: true,
        rateLimit: {
          maxRequests: 100,
          windowMs: 60000, // 1 minute
        },
      },
    };
  }

  public updateSystemConfig(config: Partial<SystemConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    };
    this.emit('configUpdated', this.config);
  }

  public registerAIProvider(id: string, config: AIProviderConfig): void {
    this.aiConfigs.set(id, config);
    this.emit('aiProviderRegistered', { id, config });
  }

  public registerInterface(id: string, config: InterfaceConfig): void {
    this.interfaceConfigs.set(id, config);
    this.emit('interfaceRegistered', { id, config });
  }

  public registerAction(id: string, config: ActionConfig): void {
    this.actionConfigs.set(id, config);
    this.emit('actionRegistered', { id, config });
  }

  public getSystemConfig(): SystemConfig {
    return { ...this.config };
  }

  public getAIProviderConfig(id: string): AIProviderConfig | undefined {
    return this.aiConfigs.get(id);
  }

  public getInterfaceConfig(id: string): InterfaceConfig | undefined {
    return this.interfaceConfigs.get(id);
  }

  public getActionConfig(id: string): ActionConfig | undefined {
    return this.actionConfigs.get(id);
  }

  public setLogLevel(level: LogLevel): void {
    this.config.logLevel = level;
    this.emit('logLevelChanged', level);
  }
}
