export type EventType = 'message' | 'action' | 'system' | 'market' | 'wallet' | 'error';

export interface Event<T = unknown> {
  id: string;
  type: EventType;
  timestamp: Date;
  source: string;
  data: T;
  metadata?: Record<string, unknown>;
}

export interface MessageEvent {
  platform: string;
  channelId: string;
  userId: string;
  content: string;
  raw?: unknown;
}

export interface ActionEvent {
  actionId: string;
  status: 'started' | 'completed' | 'failed';
  params?: Record<string, unknown>;
  result?: unknown;
  error?: Error;
}

export interface MarketEvent {
  symbol: string;
  type: 'price' | 'volume' | 'trade' | 'orderbook';
  data: Record<string, unknown>;
}

export interface WalletEvent {
  type: 'transaction' | 'balance' | 'approval';
  address: string;
  network: string;
  data: Record<string, unknown>;
}

export interface SystemEvent {
  type: 'startup' | 'shutdown' | 'config' | 'plugin' | 'error';
  component: string;
  message: string;
  data?: Record<string, unknown>;
}

export interface EventSubscription {
  id: string;
  type: EventType;
  filter?: (event: Event) => boolean;
  handler: (event: Event) => Promise<void>;
}
