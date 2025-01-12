import { EventEmitter } from 'events';
import {
  Plugin,
  PluginType,
  AIPlugin,
  InterfacePlugin,
  ActionPlugin,
  StoragePlugin,
} from './types';

export class PluginManager extends EventEmitter {
  private plugins: Map<string, Plugin> = new Map();
  private pluginsByType: Map<PluginType, Set<string>> = new Map();

  constructor() {
    super();
    this.initializePluginTypes();
  }

  private initializePluginTypes(): void {
    for (const type of ['ai', 'interface', 'action', 'storage'] as PluginType[]) {
      this.pluginsByType.set(type, new Set());
    }
  }

  public async registerPlugin(plugin: Plugin): Promise<void> {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin with ID ${plugin.id} is already registered`);
    }

    try {
      await plugin.initialize();
      this.plugins.set(plugin.id, plugin);
      this.pluginsByType.get(plugin.type)?.add(plugin.id);
      this.emit('pluginRegistered', plugin);
    } catch (error) {
      throw new Error(`Failed to initialize plugin ${plugin.id}: ${error}`);
    }
  }

  public async unregisterPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin with ID ${pluginId} is not registered`);
    }

    try {
      await plugin.cleanup();
      this.plugins.delete(pluginId);
      this.pluginsByType.get(plugin.type)?.delete(pluginId);
      this.emit('pluginUnregistered', plugin);
    } catch (error) {
      throw new Error(`Failed to cleanup plugin ${pluginId}: ${error}`);
    }
  }

  public getPlugin<T extends Plugin>(pluginId: string): T {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin with ID ${pluginId} is not registered`);
    }
    return plugin as T;
  }

  public getPluginsByType<T extends Plugin>(type: PluginType): T[] {
    const pluginIds = this.pluginsByType.get(type) || new Set();
    return Array.from(pluginIds).map(id => this.getPlugin<T>(id));
  }

  public getAIPlugins(): AIPlugin[] {
    return this.getPluginsByType<AIPlugin>('ai');
  }

  public getInterfacePlugins(): InterfacePlugin[] {
    return this.getPluginsByType<InterfacePlugin>('interface');
  }

  public getActionPlugins(): ActionPlugin[] {
    return this.getPluginsByType<ActionPlugin>('action');
  }

  public getStoragePlugins(): StoragePlugin[] {
    return this.getPluginsByType<StoragePlugin>('storage');
  }

  public async cleanup(): Promise<void> {
    const plugins = Array.from(this.plugins.values());
    await Promise.all(plugins.map(plugin => this.unregisterPlugin(plugin.id)));
  }
}
