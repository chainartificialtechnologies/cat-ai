// Interface plugins will be implemented here
export const SUPPORTED_INTERFACES = ['twitter', 'bluesky', 'farcaster', 'cli'] as const;
export type SupportedInterface = (typeof SUPPORTED_INTERFACES)[number];

// Export implementations
export * from './cli/CLIInterface';
export * from './social/twitter/TwitterInterface';
export * from './api/APIInterface';
