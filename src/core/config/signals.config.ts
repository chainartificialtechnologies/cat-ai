export const SIGNALS_CONFIG = {
  coinbase: {
    spotPriceEndpoint: 'https://api.coinbase.com/v2/prices/BTC-USD/spot',
    historicalPriceEndpoint: 'https://api.exchange.coinbase.com/products/BTC-USD/candles',
  },
  indicators: {
    rsi: {
      periods: 14,
      oversoldThreshold: 30,
      overboughtThreshold: 70,
    },
    macd: {
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
    },
    ema: {
      shortPeriod: 9,
      longPeriod: 30,
    },
  },
  api: {
    port: 3000,
    host: '0.0.0.0',
    rateLimitConfig: {
      max: 10,
      timeWindow: 60000,
    },
  },
} as const; 