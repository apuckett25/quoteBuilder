import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import indexRoutes from './routes';
import quoteRoutes from './routes/quotes';
import dotnet from 'dotenv';
dotnet.config({path: '.env'});

const fastify = Fastify({
  logger: true
});

// Register plugins
fastify.register(cors, {
  origin: 'http://localhost:3000' // Allow frontend origin
});
fastify.register(swagger, {
  swagger: {
    info: {
      title: 'Quote Builder API',
      version: '1.0.0'
    }
  }
});

// Register routes
fastify.register(indexRoutes);
fastify.register(quoteRoutes);

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 5000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();