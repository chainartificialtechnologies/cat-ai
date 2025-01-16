import { SignalsCalculatorService } from '../meowSignals-calculator.service';
import nock from 'nock';

describe('SignalsCalculatorService', () => {
  let service: SignalsCalculatorService;

  beforeEach(() => {
    service = new SignalsCalculatorService();
    nock.cleanAll();
  });

  afterAll(() => {
    nock.restore();
  });

  describe('getBitcoinPrice', () => {
    it('should fetch current Bitcoin price', async () => {
      nock('https://api.coinbase.com')
        .get('/v2/prices/BTC-USD/spot')
        .reply(200, {
          data: {
            base: 'BTC',
            currency: 'USD',
            amount: '45000'
          }
        });

      const price = await service.getBitcoinPrice();
      expect(price).toBe(45000);
    });

    it('should handle API errors', async () => {
      nock('https://api.coinbase.com')
        .get('/v2/prices/BTC-USD/spot')
        .replyWithError('API Error');

      await expect(service.getBitcoinPrice()).rejects.toThrow();
    });
  });

  describe('getHistoricalPrices', () => {
    it('should fetch and format historical prices', async () => {
      const mockData = [
        [1614556800, 45000, 46000, 44000, 45500, 100],
        [1614470400, 44000, 45000, 43000, 44500, 100],
      ];

      nock('https://api.exchange.coinbase.com')
        .get('/products/BTC-USD/candles')
        .query(true)
        .reply(200, mockData);

      const prices = await service.getHistoricalPrices();
      expect(Array.isArray(prices)).toBe(true);
      expect(prices.length).toBeGreaterThan(0);
      expect(prices[0]).toHaveProperty('time');
      expect(prices[0]).toHaveProperty('price');
    });

    it('should handle API errors', async () => {
      nock('https://api.exchange.coinbase.com')
        .get('/products/BTC-USD/candles')
        .query(true)
        .replyWithError('API Error');

      await expect(service.getHistoricalPrices()).rejects.toThrow();
    });
  });

  describe('calculateRSI', () => {
    it('should calculate RSI correctly', () => {
      const prices = [
        100, 102, 104, 103, 105, 107, 108, 107, 106, 105,
        104, 103, 102, 101, 100
      ];

      const rsi = service.calculateRSI(prices);
      expect(typeof rsi).toBe('number');
      expect(rsi).toBeGreaterThanOrEqual(0);
      expect(rsi).toBeLessThanOrEqual(100);
    });

    it('should throw error for insufficient data', () => {
      const prices = [100];
      expect(() => service.calculateRSI(prices)).toThrow('Not enough price data to calculate RSI');
    });
  });

  describe('calculateEMA', () => {
    it('should calculate EMA correctly', () => {
      const prices = [100, 110, 105, 115, 120];
      const ema = service.calculateEMA(prices, 3);
      expect(typeof ema).toBe('number');
      expect(ema).toBeGreaterThan(0);
    });
  });

  describe('calculateMACD', () => {
    it('should calculate MACD correctly', () => {
      const prices = [100, 110, 105, 115, 120];
      const macd = service.calculateMACD(prices);
      expect(macd).toHaveProperty('value');
      expect(macd).toHaveProperty('signal');
      expect(macd).toHaveProperty('histogram');
    });
  });

  describe('determineSignals', () => {
    it('should determine oversold signal', () => {
      const signal = service.determineSignals(20, { histogram: -2 }, 100, 120);
      expect(signal).toHaveProperty('rsi_signal');
      expect(signal).toHaveProperty('macd_signal');
      expect(signal).toHaveProperty('ema_signal');
      expect(signal).toHaveProperty('overall_signal');
    });

    it('should determine overbought signal', () => {
      const signal = service.determineSignals(80, { histogram: 2 }, 120, 100);
      expect(signal).toHaveProperty('rsi_signal');
      expect(signal).toHaveProperty('macd_signal');
      expect(signal).toHaveProperty('ema_signal');
      expect(signal).toHaveProperty('overall_signal');
    });
  });
}); 