// Action plugins will be implemented here
export const SUPPORTED_ACTIONS = ['crypto-trade', 'wallet-management'] as const;
export type SupportedAction = (typeof SUPPORTED_ACTIONS)[number];

// Export implementations
export * from './crypto/trading/TradingAction';
export * from './crypto/wallet/WalletAction';
export * from './custom/CustomActionTemplate';
