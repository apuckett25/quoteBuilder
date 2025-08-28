import { FastifyInstance } from 'fastify';
import IndexController from '../controllers/index';

async function indexRoutes(fastify: FastifyInstance) {
  const controller = new IndexController();

  fastify.get('/', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    },
    handler: controller.getIndex
  });

  fastify.get('/health', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' },
            version: { type: 'string' }
          }
        }
      }
    },
    handler: controller.healthCheck
  });
}

export default indexRoutes;