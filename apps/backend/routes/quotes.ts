import { FastifyInstance } from 'fastify';
import QuotesController from '../controllers/quotes';

// Reusable JSON schema for the quote body
const quoteBodySchema = {
  type: 'object',
  properties: {
    Name: { type: 'string' },
    ProjectManagerID: { type: ['string', 'null'] },
    RFQReceivedDate: { type: ['string', 'null'], format: 'date-time' },
    QuoteDueDate: { type: ['string', 'null'], format: 'date-time' },
    ExpectedStartDate: { type: ['string', 'null'], format: 'date-time' },
    ExpectedEndDate: { type: ['string', 'null'], format: 'date-time' },
    Duration: { type: ['number', 'null'] },
    ProposalNumber: { type: ['string', 'null'] },
    CustomerId: { type: ['string', 'null'] },
    CustomerName: { type: ['string', 'null'] },
    ContactId: { type: ['string', 'null'] },
    ContactName: { type: ['string', 'null'] },
    ContactEmail: { type: ['string', 'null'] },
    LocationId: { type: ['string', 'null'] },
    LocationName: { type: ['string', 'null'] },
    Regarding: { type: ['string', 'null'] },
    SOW: { type: ['string', 'null'] },
    Delivery: { type: ['string', 'null'] },
    Status: { type: ['number', 'null'] },
    QuoteTotal: { type: ['number', 'null'] },
    // Add other fields from the Quotes model as needed
  },
};

// Reusable JSON schema for ID parameter
const idParamSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
  },
  required: ['id'],
};

async function quoteRoutes(fastify: FastifyInstance) {
  const controller = new QuotesController();

  // --- CRUD Operations ---

  // CREATE a new quote
  fastify.post('/quotes', {
    schema: {
      body: quoteBodySchema,
    },
    handler: controller.createQuote,
  });

  // UPDATE a quote by ID
  fastify.put('/quotes/:id', {
    schema: {
      params: idParamSchema,
      body: quoteBodySchema,
    },
    handler: controller.updateQuote,
  });

  // DELETE a quote by ID (Soft Delete)
  fastify.delete('/quotes/:id', {
    schema: {
      params: idParamSchema,
    },
    handler: controller.deleteQuote,
  });
  
  // CREATE a new revision of a quote
  fastify.post('/quotes/:id/revisions', {
    schema: {
      params: idParamSchema,
    },
    handler: controller.createRevision,
  });

  // --- READ Operations ---

  // List quotes with pagination
  fastify.get('/quotes', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1 },
          pageSize: { type: 'number', minimum: 1, maximum: 100 },
        },
      },
    },
    handler: controller.getQuotes,
  });

  // Get quote by ID
  fastify.get('/quotes/id/:id', {
    schema: {
      params: idParamSchema,
    },
    handler: controller.getQuoteById,
  });

  // Get quote by proposal number
  fastify.get('/quotes/proposal/:proposalNumber', {
    schema: {
      params: {
        type: 'object',
        properties: {
          proposalNumber: { type: 'string' },
        },
        required: ['proposalNumber'],
      },
    },
    handler: controller.getQuoteByProposalNumber,
  });
  
  // --- Detailed READ Operations ---

  // Get comprehensive quote details (all tabs data)
  fastify.get('/quotes/:id/details', {
    schema: {
      params: idParamSchema,
    },
    handler: controller.getQuoteDetails,
  });

  // Get quote summary with totals
  fastify.get('/quotes/:id/summary', {
    schema: {
      params: idParamSchema,
    },
    handler: controller.getQuoteSummary,
  });

  // Get quote labor items only
  fastify.get('/quotes/:id/labor', {
    schema: {
      params: idParamSchema,
    },
    handler: controller.getQuoteLabor,
  });

  // Get quote material items only
  fastify.get('/quotes/:id/materials', {
    schema: {
      params: idParamSchema,
    },
    handler: controller.getQuoteMaterials,
  });

  // Get quote other cost items only
  fastify.get('/quotes/:id/others', {
    schema: {
      params: idParamSchema,
    },
    handler: controller.getQuoteOthers,
  });

  // Get quote per diem items only
  fastify.get('/quotes/:id/perdiems', {
    schema: {
      params: idParamSchema,
    },
    handler: controller.getQuotePerDiems,
  });
}

export default quoteRoutes;