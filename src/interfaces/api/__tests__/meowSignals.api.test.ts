import supertest from 'supertest';
import nock from 'nock';
import { FastifyInstance } from 'fastify';

declare global {
  var app: FastifyInstance;
}

describe('Signals API', () => {
  beforeAll(async () => {
    nock.cleanAll();
  });

  afterAll(async () => {
    nock.cleanAll();
    nock.restore();
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await supertest(global.app.server)
        .get('/unknown-route')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
    });

    it('should handle invalid data from Coinbase', async () => {
      nock('https://api.exchange.coinbase.com')
        .get('/products/BTC-USD/candles')
        .query(true)
        .reply(200, 'invalid data');

      const response = await supertest(global.app.server)
        .get('/api/v1/signals')
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
    });
  });

  it('GET /api/v1/signals should return trading signals', async () => {
    // Mock successful responses
    nock('https://api.coinbase.com')
      .get('/v2/prices/BTC-USD/spot')
      .reply(200, {
        data: {
          amount: '50000.00',
          currency: 'USD'
        }
      });

    nock('https://api.exchange.coinbase.com')
      .get('/products/BTC-USD/candles')
      .query(true)
      .reply(200, [
        [1614556800, 45000, 46000, 44000, 45500, 100],
        [1614470400, 44000, 45000, 43000, 44500, 100],
        [1614384000, 43000, 44000, 42000, 43500, 100],
        [1613952000, 42000, 43000, 41000, 42500, 100],
        [1613865600, 41000, 42000, 40000, 41500, 100],
        [1613779200, 40000, 41000, 39000, 40500, 100],
        [1613692800, 39000, 40000, 38000, 39500, 100],
        [1613606400, 38000, 39000, 37000, 38500, 100],
        [1613520000, 37000, 38000, 36000, 37500, 100],
        [1613433600, 36000, 37000, 35000, 36500, 100],
        [1613347200, 35000, 36000, 34000, 35500, 100],
        [1613260800, 34000, 35000, 33000, 34500, 100],
        [1613174400, 33000, 34000, 32000, 33500, 100],
        [1613088000, 32000, 33000, 31000, 32500, 100],
        [1613001600, 31000, 32000, 30000, 31500, 100],
        [1612915200, 30000, 31000, 29000, 30500, 100],
        [1612828800, 29000, 30000, 28000, 29500, 100],
        [1612742400, 28000, 29000, 27000, 28500, 100],
        [1612656000, 27000, 28000, 26000, 27500, 100],
        [1612569600, 26000, 27000, 25000, 26500, 100]
      ]);

    const response = await supertest(global.app.server)
      .get('/api/v1/signals')
      .expect(200);

    expect(response.body).toHaveProperty('current_price');
    expect(response.body).toHaveProperty('current_rsi');
    expect(response.body).toHaveProperty('indicators');
    expect(response.body.indicators).toHaveProperty('rsi');
    expect(response.body.indicators).toHaveProperty('macd');
    expect(response.body.indicators).toHaveProperty('ema');
    expect(response.body).toHaveProperty('signals');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('should handle API errors gracefully', async () => {
    nock('https://api.exchange.coinbase.com')
      .get('/products/BTC-USD/candles')
      .query(true)
      .replyWithError('API Error');

    const response = await supertest(global.app.server)
      .get('/api/v1/signals')
      .expect(500);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('message');
  });

  it('should handle rate limiting', async () => {
    // Make multiple requests to trigger rate limiting
    const requests = Array(15).fill(null).map(() => 
      supertest(global.app.server)
        .get('/api/v1/signals')
    );

    const responses = await Promise.all(requests);
    const rateLimitedResponse = responses[responses.length - 1];
    
    expect(rateLimitedResponse.status).toBe(429);
    expect(rateLimitedResponse.body).toHaveProperty('error', 'Too Many Requests');
  });
}); 