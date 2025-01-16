export interface SignalResponse {
  current_price: number;
  current_rsi: number;
  indicators: {
    rsi: number;
    macd: {
      value: number;
      signal: number;
      histogram: number;
    };
    ema: {
      ema9: number;
      ema30: number;
    };
  };
  signals: {
    rsi_signal: 'oversold' | 'overbought' | 'neutral';
    macd_signal: 'bullish' | 'bearish' | 'neutral';
    ema_signal: 'bullish' | 'bearish' | 'neutral';
    overall_signal: 'buy' | 'sell' | 'neutral';
  };
  timestamp: string;
}

export interface HistoricalPrice {
  time: string;
  price: number;
}

export interface CoinbasePrice {
  data: {
    amount: string;
    currency: string;
  };
} 