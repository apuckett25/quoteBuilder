import { FastifyInstance } from 'fastify';
import QuotesController from '../controllers/quotes';

async function quoteRoutes(fastify: FastifyInstance) {
  const controller = new QuotesController();

  // List quotes with pagination
  fastify.get('/quotes', {
    handler: controller.getQuotes
  });

  // Get quote by proposal number - Keep only this one
  fastify.get('/quotes/:proposalNumber', {
    schema: {
      params: {
        type: 'object',
        properties: {
          proposalNumber: { type: 'string' }
        },
        required: ['proposalNumber']
      }
    },
    handler: controller.getQuoteByProposalNumber
  });

  // Remove or comment out any other route using '/quotes/:proposalNumber'
}

export default quoteRoutes;