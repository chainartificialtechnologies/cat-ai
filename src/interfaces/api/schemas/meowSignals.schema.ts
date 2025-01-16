export const signalsResponseSchema = {
  type: 'object',
  properties: {
    current_price: { type: 'number' },
    current_rsi: { type: 'number' },
    indicators: {
      type: 'object',
      properties: {
        rsi: { type: 'number' },
        macd: {
          type: 'object',
          properties: {
            value: { type: 'number' },
            signal: { type: 'number' },
            histogram: { type: 'number' }
          },
          required: ['value', 'signal', 'histogram']
        },
        ema: {
          type: 'object',
          properties: {
            ema9: { type: 'number' },
            ema30: { type: 'number' }
          },
          required: ['ema9', 'ema30']
        }
      },
      required: ['rsi', 'macd', 'ema']
    },
    signals: {
      type: 'object',
      properties: {
        rsi_signal: { type: 'string', enum: ['oversold', 'overbought', 'neutral'] },
        macd_signal: { type: 'string', enum: ['bullish', 'bearish', 'neutral'] },
        ema_signal: { type: 'string', enum: ['bullish', 'bearish', 'neutral'] },
        overall_signal: { type: 'string', enum: ['buy', 'sell', 'neutral'] }
      },
      required: ['rsi_signal', 'macd_signal', 'ema_signal', 'overall_signal']
    },
    timestamp: { type: 'string', format: 'date-time' }
  },
  required: ['current_price', 'current_rsi', 'indicators', 'signals', 'timestamp']
}; 