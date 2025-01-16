import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { SignalsCalculatorService } from '../../../actions/crypto/services/meowSignals-calculator.service';
import { signalsResponseSchema } from '../schemas/meowSignals.schema';

interface SignalsPluginOptions {
  signalsCalculator: SignalsCalculatorService;
}

const signalsPlugin: FastifyPluginAsync<SignalsPluginOptions> = async (fastify: FastifyInstance, opts: SignalsPluginOptions) => {
  const calculator = opts.signalsCalculator;

  // Register route
  fastify.get('/signals', {
    schema: {
      response: {
        200: signalsResponseSchema
      },
      description: 'Get trading signals for Bitcoin based on technical analysis',
      tags: ['crypto', 'trading'],
      summary: 'Get Bitcoin trading signals'
    }
  }, async (request, reply) => {
    try {
      const signals = await calculator.generateSignals();
      return signals;
    } catch (error) {
      request.log.error(error);
      
      // Handle specific errors
      if (error instanceof Error) {
        if (error.message.includes('Not enough price data')) {
          reply.status(400).send({
            error: 'Insufficient Data',
            message: 'Not enough historical price data available',
            statusCode: 400
          });
          return;
        }
        
        if (error.message.includes('network') || error.message.includes('timeout')) {
          reply.status(503).send({
            error: 'Service Unavailable',
            message: 'Unable to fetch market data. Please try again later.',
            statusCode: 503
          });
          return;
        }
      }
      
      // Re-throw for global error handler
      throw error;
    }
  });
};

export default signalsPlugin; 