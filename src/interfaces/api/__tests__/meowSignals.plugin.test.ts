import signalsPlugin from '../plugins/meowSignals.plugin';
import { SignalsCalculatorService } from '../../../actions/crypto/services/meowSignals-calculator.service';
import { signalsResponseSchema } from '../schemas/meowSignals.schema';

jest.mock('../../../actions/crypto/services/meowSignals-calculator.service');

describe('SignalsPlugin', () => {
  let mockFastify: any;
  let mockSignalsCalculator: jest.Mocked<SignalsCalculatorService>;
  let mockRequest: any;
  let mockReply: any;
  let routeHandler: any;

  beforeEach(() => {
    mockFastify = {
      get: jest.fn((_path, _opts, handler) => {
        routeHandler = handler;
      })
    };

    mockSignalsCalculator = {
      generateSignals: jest.fn()
    } as any;

    mockRequest = {
      log: {
        error: jest.fn()
      }
    };
    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
  });

  it('should register the signals route', async () => {
    await signalsPlugin(mockFastify, { signalsCalculator: mockSignalsCalculator });

    expect(mockFastify.get).toHaveBeenCalledWith(
      '/signals',
      {
        schema: {
          response: {
            200: signalsResponseSchema
          },
          description: 'Get trading signals for Bitcoin based on technical analysis',
          tags: ['crypto', 'trading'],
          summary: 'Get Bitcoin trading signals'
        }
      },
      expect.any(Function)
    );
  });

  it('should handle successful signal generation', async () => {
    const mockSignals = {
      current_price: 50000,
      current_rsi: 55,
      indicators: {
        rsi: 55,
        macd: { value: 100, signal: 90, histogram: 10 },
        ema: { ema9: 49000, ema30: 48000 }
      },
      signals: {
        rsi_signal: 'neutral' as 'neutral',
        macd_signal: 'bullish' as 'bullish',
        ema_signal: 'bullish' as 'bullish',
        overall_signal: 'buy' as 'buy'
      },
      timestamp: '2024-01-16T00:00:00Z'
    };

    mockSignalsCalculator.generateSignals.mockResolvedValue(mockSignals);
    await signalsPlugin(mockFastify, { signalsCalculator: mockSignalsCalculator });

    const result = await routeHandler(mockRequest, mockReply);
    expect(result).toEqual(mockSignals);
  });

  it('should handle insufficient data error', async () => {
    mockSignalsCalculator.generateSignals.mockRejectedValue(new Error('Not enough price data'));
    await signalsPlugin(mockFastify, { signalsCalculator: mockSignalsCalculator });

    await routeHandler(mockRequest, mockReply);

    expect(mockReply.status).toHaveBeenCalledWith(400);
    expect(mockReply.send).toHaveBeenCalledWith({
      error: 'Insufficient Data',
      message: 'Not enough historical price data available',
      statusCode: 400
    });
  });

  it('should handle network errors', async () => {
    mockSignalsCalculator.generateSignals.mockRejectedValue(new Error('network error'));
    await signalsPlugin(mockFastify, { signalsCalculator: mockSignalsCalculator });

    await routeHandler(mockRequest, mockReply);

    expect(mockReply.status).toHaveBeenCalledWith(503);
    expect(mockReply.send).toHaveBeenCalledWith({
      error: 'Service Unavailable',
      message: 'Unable to fetch market data. Please try again later.',
      statusCode: 503
    });
  });

  it('should handle API errors', async () => {
    mockSignalsCalculator.generateSignals.mockRejectedValue(new Error('network error'));
    await signalsPlugin(mockFastify, { signalsCalculator: mockSignalsCalculator });

    await routeHandler(mockRequest, mockReply);

    expect(mockRequest.log.error).toHaveBeenCalled();
    expect(mockReply.status).toHaveBeenCalledWith(503);
    expect(mockReply.send).toHaveBeenCalledWith({
      error: 'Service Unavailable',
      message: 'Unable to fetch market data. Please try again later.',
      statusCode: 503
    });
  });
}); 