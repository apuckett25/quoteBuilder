import { FastifyInstance } from 'fastify';
import QuotesController from '../controllers/quotes';

async function quoteRoutes(fastify: FastifyInstance) {
  const controller = new QuotesController();

  // List quotes with pagination
  fastify.get('/quotes', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1 },
          pageSize: { type: 'number', minimum: 1, maximum: 100 }
        }
      }
    },
    handler: controller.getQuotes
  });

  // Get quote by ID
  fastify.get('/quotes/id/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    },
    handler: controller.getQuoteById
  });

  // Get quote by proposal number
  fastify.get('/quotes/proposal/:proposalNumber', {
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

  // Get comprehensive quote details (all tabs data)
  fastify.get('/quotes/:id/details', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    },
    handler: controller.getQuoteDetails
  });

  // Get quote summary with totals
  fastify.get('/quotes/:id/summary', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    },
    handler: controller.getQuoteSummary
  });

  // Get quote labor items only
  fastify.get('/quotes/:id/labor', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    },
    handler: controller.getQuoteLabor
  });

  // Get quote material items only
  fastify.get('/quotes/:id/materials', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    },
    handler: controller.getQuoteMaterials
  });

  // Get quote other cost items only
  fastify.get('/quotes/:id/others', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    },
    handler: controller.getQuoteOthers
  });

  // Get quote per diem items only
  fastify.get('/quotes/:id/perdiems', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    },
    handler: controller.getQuotePerDiems
  });

  // Disabled operations
  fastify.post('/quotes', { handler: controller.createQuote });
  fastify.put('/quotes/:id', { handler: controller.updateQuote });
  fastify.delete('/quotes/:id', { handler: controller.deleteQuote });
  fastify.post('/quotes/:id/revisions', { handler: controller.createRevision });
}

export default quoteRoutes;