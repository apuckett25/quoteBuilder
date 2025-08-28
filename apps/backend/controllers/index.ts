import { FastifyRequest, FastifyReply } from 'fastify';

interface HealthCheckResponse {
  status: string;
  timestamp: string;
  version: string;
}

class IndexController {
  public async getIndex(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    await reply.send({ message: 'Welcome to the Quote Builder API!' });
  }

  public async healthCheck(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const response: HealthCheckResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
    
    await reply.send(response);
  }
}

export default IndexController;