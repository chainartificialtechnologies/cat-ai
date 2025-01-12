// AI provider plugins will be implemented here
export const AI_PROVIDERS = ['openai', 'anthropic', 'ollama'] as const;
export type SupportedAIProvider = (typeof AI_PROVIDERS)[number];

// Export implementations
export * from './openai/OpenAIProvider';
