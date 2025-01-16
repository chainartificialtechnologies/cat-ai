import axios from 'axios';
import { DateTime } from 'luxon';
import { SIGNALS_CONFIG } from '../../../core/config/signals.config';
import { CoinbasePrice, HistoricalPrice, SignalResponse } from '../interfaces/signals.interface';

export class SignalsCalculatorService {
  async getBitcoinPrice(): Promise<number> {
    const response = await axios.get<CoinbasePrice>(SIGNALS_CONFIG.coinbase.spotPriceEndpoint);
    return parseFloat(response.data.data.amount);
  }

  async getHistoricalPrices(): Promise<HistoricalPrice[]> {
    const endDate = DateTime.now();
    const startDate = endDate.minus({ days: 60 });
    
    try {
      const response = await axios.get(
        `${SIGNALS_CONFIG.coinbase.historicalPriceEndpoint}`, {
          params: {
            start: startDate.toUTC().toISO(),
            end: endDate.toUTC().toISO(),
            granularity: 86400
          }
        }
      );

      // Ensure we have data
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format from Coinbase API');
      }

      // Coinbase Exchange API returns array of arrays:
      // [timestamp, open, high, low, close, volume]
      return response.data.map((item: [number, number, number, number, number, number]) => ({
        time: new Date(item[0] * 1000).toISOString(), // Convert Unix timestamp to ISO string
        price: item[4] // Close price
      })).reverse(); // Reverse to get chronological order
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        if (error.response?.data) {
          throw new Error(`Failed to fetch historical prices: ${JSON.stringify(error.response.data)}`);
        }
        throw new Error(`Failed to fetch historical prices: ${error.message}`);
      }
      throw error;
    }
  }

  calculateRSI(prices: number[], periods: number = SIGNALS_CONFIG.indicators.rsi.periods): number {
    if (prices.length < periods + 1) {
      throw new Error('Not enough price data to calculate RSI');
    }

    const changes = prices.slice(1).map((price, i) => price - prices[i]);
    const gains = changes.map(change => change > 0 ? change : 0);
    const losses = changes.map(change => change < 0 ? -change : 0);
    
    const avgGain = gains.slice(-periods).reduce((sum, gain) => sum + gain, 0) / periods;
    const avgLoss = losses.slice(-periods).reduce((sum, loss) => sum + loss, 0) / periods;
    
    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  calculateEMA(prices: number[], period: number): number {
    const multiplier = 2 / (period + 1);
    let ema = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema;
    }
    
    return ema;
  }

  calculateMACD(prices: number[]): { value: number; signal: number; histogram: number } {
    const { fastPeriod, slowPeriod } = SIGNALS_CONFIG.indicators.macd;
    const ema12 = this.calculateEMA(prices, fastPeriod);
    const ema26 = this.calculateEMA(prices, slowPeriod);
    const macdValue = ema12 - ema26;
    const signal = this.calculateEMA([...Array(8).fill(macdValue), macdValue], SIGNALS_CONFIG.indicators.macd.signalPeriod);
    
    return {
      value: macdValue,
      signal: signal,
      histogram: macdValue - signal
    };
  }

  determineSignals(rsi: number, macd: { histogram: number }, ema9: number, ema30: number): {
    rsi_signal: 'oversold' | 'overbought' | 'neutral';
    macd_signal: 'bullish' | 'bearish' | 'neutral';
    ema_signal: 'bullish' | 'bearish' | 'neutral';
    overall_signal: 'buy' | 'sell' | 'neutral';
  } {
    const { oversoldThreshold, overboughtThreshold } = SIGNALS_CONFIG.indicators.rsi;
    const rsi_signal = rsi < oversoldThreshold ? 'oversold' as const : rsi > overboughtThreshold ? 'overbought' as const : 'neutral' as const;
    const macd_signal = macd.histogram > 0 ? 'bullish' as const : macd.histogram < 0 ? 'bearish' as const : 'neutral' as const;
    const ema_signal = ema9 > ema30 ? 'bullish' as const : ema9 < ema30 ? 'bearish' as const : 'neutral' as const;

    let bullishCount = 0;
    if (rsi_signal === 'oversold') bullishCount++;
    if (macd_signal === 'bullish') bullishCount++;
    if (ema_signal === 'bullish') bullishCount++;

    let bearishCount = 0;
    if (rsi_signal === 'overbought') bearishCount++;
    if (macd_signal === 'bearish') bearishCount++;
    if (ema_signal === 'bearish') bearishCount++;

    let overall_signal: 'buy' | 'sell' | 'neutral' = 'neutral';
    if (bullishCount >= 2) overall_signal = 'buy';
    else if (bearishCount >= 2) overall_signal = 'sell';

    return {
      rsi_signal,
      macd_signal,
      ema_signal,
      overall_signal
    };
  }

  async generateSignals(): Promise<SignalResponse> {
    const currentPrice = await this.getBitcoinPrice();
    const historicalPrices = await this.getHistoricalPrices();
    const prices = historicalPrices.map(item => item.price);
    
    const rsi = this.calculateRSI(prices);
    const macd = this.calculateMACD(prices);
    const ema9 = this.calculateEMA(prices, SIGNALS_CONFIG.indicators.ema.shortPeriod);
    const ema30 = this.calculateEMA(prices, SIGNALS_CONFIG.indicators.ema.longPeriod);
    
    const signals = this.determineSignals(rsi, macd, ema9, ema30);
    
    return {
      current_price: currentPrice,
      current_rsi: rsi,
      indicators: {
        rsi,
        macd,
        ema: {
          ema9,
          ema30
        }
      },
      signals,
      timestamp: new Date().toISOString()
    };
  }
} 