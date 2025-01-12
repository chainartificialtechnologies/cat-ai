// Core exports
export { Agent } from './core/agent/Agent';
export * from './core/agent/types';

// Plugin system exports
export { PluginManager } from './core/plugins/PluginManager';
export * from './core/plugins/types';

// Re-export plugin implementations as they're added
export * from './ai';
export * from './interfaces';
export * from './actions';
export * from './storage';
