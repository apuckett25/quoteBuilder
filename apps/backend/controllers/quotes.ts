import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface QuoteParams {
  Params: {
    id: string;
    proposalNumber: string;
  };
}

interface PaginationQuery {
  Querystring: {
    page?: number;
    pageSize?: number;
  };
}

interface ErrorResponse {
  error: string;
  message?: string;
}

class QuotesController {
  // READ all quotes with pagination - Enabled
  async getQuotes(
    request: FastifyRequest<PaginationQuery>,
    reply: FastifyReply
  ) {
    try {
      const page = Number(request.query.page) || 1;
      const pageSize = Number(request.query.pageSize) || 25;
      const skip = (page - 1) * pageSize;

      const [quotes, total] = await Promise.all([
        prisma.quotes.findMany({
          orderBy: {
            CreatedAt: 'desc'
          },
          skip,
          take: pageSize
        }),
        prisma.quotes.count()
      ]);

      return reply.send({
        data: quotes,
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch quotes' });
    }
  }

  // READ single quote - Enabled
  async getQuoteById(
    request: FastifyRequest<QuoteParams>,
    reply: FastifyReply
  ) {
    try {
      const quote = await prisma.quotes.findFirst({
        where: { ID: request.params.id, Active: true, IsCurrentRevision: true },
        select: {
          ID: true,
          ProposalNumber: true,
          Name: true,
          QuoteTotal: true,
          CreatedAt: true,
          CustomerId: true,
          ContactName: true,
          ContactEmail: true,
          Status: true,
        },
      });

      if (!quote) {
        return reply.code(404).send({ error: 'Quote not found' });
      }

      return reply.send(quote);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch quote' });
    }
  }

  // New Method to get quote by ProposalNumber
  async getQuoteByProposalNumber_test(
    request: FastifyRequest<QuoteParams>,
    reply: FastifyReply
  ) {
    try {
      const quote = await prisma.$queryRaw`
        SELECT d.ID,
               d.Name,
               d.ProposalNumber,
               d.ContactName,
               d.ContactEmail,
               d.QuoteTotal,
               d.CreatedAt
               di.Name AS DisciplineName
               l.Description AS LaborDescription
               l.TotalHours
               l.BillRate
               l.LaborTotalBillable
        FROM quotes d INNER JOIN
             QuoteLabors l on d.ID = l.QuoteId INNER JOIN
             Disciplines di on l.DisciplineId = d.ID
        WHERE d.ProposalNumber = ${request.params.proposalNumber}
          AND d.Active = true
          AND d.IsCurrentRevision = true
      `;
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch quote' });
    }
  }

  // READ single quote by proposal number - Enabled
  async getQuoteByProposalNumber(
    request: FastifyRequest<QuoteParams>,
    reply: FastifyReply
  ) {
    try {
      const quote = await prisma.quotes.findFirst({
        where: { 
          ProposalNumber: request.params.proposalNumber
         ,Active: true
         ,IsCurrentRevision: true
        },
      });

      if (!quote) {
        return reply.code(404).send({ error: 'Quote not found' });
      }

      return reply.send(quote);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch quote' });
    }
  }

  async getQuoteLabor(
    request: FastifyRequest<QuoteParams>,
    reply: FastifyReply
  ) {
    try {
      const laborItems = await prisma.quoteLabors.findMany({
        where: { Id: request.params.id },
      });

      return reply.send(laborItems);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch quote labor items' });
    }
  }

  // Disabled operations will return 403 Forbidden
  async createQuote(request: FastifyRequest, reply: FastifyReply) {
    return reply.code(403).send({ 
      error: 'Operation not permitted',
      message: 'Quote creation is disabled'
    });
  }

  async updateQuote(request: FastifyRequest, reply: FastifyReply) {
    return reply.code(403).send({ 
      error: 'Operation not permitted',
      message: 'Quote updates are disabled'
    });
  }

  async deleteQuote(request: FastifyRequest, reply: FastifyReply) {
    return reply.code(403).send({ 
      error: 'Operation not permitted',
      message: 'Quote deletion is disabled'
    });
  }

  async createRevision(request: FastifyRequest, reply: FastifyReply) {
    return reply.code(403).send({ 
      error: 'Operation not permitted',
      message: 'Quote revision creation is disabled'
    });
  }
}

export default QuotesController;