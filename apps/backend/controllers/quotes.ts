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

  // READ single quote by proposal number - Enabled
  async getQuoteByProposalNumber(
    request: FastifyRequest<QuoteParams>,
    reply: FastifyReply
  ) {
    try {
      const quote = await prisma.quotes.findFirst({
        where: { 
          ProposalNumber: request.params.proposalNumber,
          Active: true,
          IsCurrentRevision: true
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

  // Get comprehensive quote details with all related data
  async getQuoteDetails(
    request: FastifyRequest<QuoteParams>,
    reply: FastifyReply
  ) {
    try {
      const quoteId = request.params.id;

      // Get the main quote data
      const quote = await prisma.quotes.findFirst({
        where: { 
          ID: quoteId,
          Active: true,
          IsCurrentRevision: true
        },
      });

      if (!quote) {
        return reply.code(404).send({ error: 'Quote not found' });
      }

      // Get all related data in parallel
      const [laborItems, materialItems, otherItems, perDiemItems, disciplines] = await Promise.all([
        // Labor items with discipline and skill information
        prisma.$queryRaw`
          SELECT 
            ql.Id,
            ql.[Order],
            ql.Description,
            ql.TotalHours,
            ql.BillRate,
            ql.LaborTotalBillable,
            ql.Labor_TotalBillable,
            ql.TotalBillable,
            ql.NumEmployees,
            ql.NumHoursPer,
            ql.NumWeeks,
            ql.IncludesPerDiem,
            ql.PerDiem_TotalDays,
            ql.PerDiem_DailyCost,
            ql.PerDiem_DailyBillable,
            ql.PerDiem_TotalCost,
            ql.PerDiem_TotalBillable,
            ql.PerDiem_PerEmployee,
            ql.CalculatedTotalHours,
            d.Name as DisciplineName,
            s.Name as SkillName,
            s.Description as SkillDescription
          FROM QuoteLabors ql
          INNER JOIN Disciplines d ON ql.DisciplineId = d.Id
          INNER JOIN Skills s ON ql.SkillId = s.Id
          WHERE ql.QuoteId = ${quoteId}
            AND ql.Active = 1
          ORDER BY ql.[Order]
        `,

        // Material items
        prisma.$queryRaw`
          SELECT 
            qm.Id,
            qm.[Order],
            qm.Description,
            qm.Cost,
            qm.Markup,
            qm.Billable,
            d.Name as DisciplineName
          FROM QuoteMaterials qm
          INNER JOIN Disciplines d ON qm.DisciplineId = d.Id
          WHERE qm.QuoteId = ${quoteId}
            AND qm.Active = 1
          ORDER BY qm.[Order]
        `,

        // Other costs
        prisma.$queryRaw`
          SELECT 
            qo.Id,
            qo.[Order],
            qo.Description,
            qo.Cost,
            qo.Markup,
            qo.Billable,
            d.Name as DisciplineName,
            qot.Name as OtherTypeName
          FROM QuoteOthers qo
          INNER JOIN Disciplines d ON qo.DisciplineId = d.Id
          INNER JOIN QuoteOtherTypes qot ON qo.OtherTypeId = qot.Id
          WHERE qo.QuoteId = ${quoteId}
            AND qo.Active = 1
          ORDER BY qo.[Order]
        `,

        // Per Diem items
        prisma.$queryRaw`
          SELECT 
            qpd.ID,
            qpd.[Order],
            qpd.NumOfEmployees,
            qpd.NumOfDays,
            qpd.PerDiemPayRate,
            qpd.PerDiemBillRate,
            qpd.PerDiemPayTotal,
            qpd.PerDiemBillTotal,
            d.Name as DisciplineName
          FROM QuotePerDiems qpd
          INNER JOIN Disciplines d ON qpd.DisciplineId = d.Id
          WHERE qpd.QuoteId = ${quoteId}
            AND qpd.Active = 1
          ORDER BY qpd.[Order]
        `,

        // Get disciplines used in this quote
        prisma.$queryRaw`
          SELECT DISTINCT d.Id, d.Name
          FROM Disciplines d
          WHERE d.Id IN (
            SELECT DISTINCT DisciplineId FROM QuoteLabors WHERE QuoteId = ${quoteId} AND Active = 1
            UNION
            SELECT DISTINCT DisciplineId FROM QuoteMaterials WHERE QuoteId = ${quoteId} AND Active = 1
            UNION
            SELECT DISTINCT DisciplineId FROM QuoteOthers WHERE QuoteId = ${quoteId} AND Active = 1
            UNION
            SELECT DISTINCT DisciplineId FROM QuotePerDiems WHERE QuoteId = ${quoteId} AND Active = 1
          )
          ORDER BY d.Name
        `
      ]);

      // Calculate totals
      const laborTotal = (laborItems as any[]).reduce((sum, item) => sum + (Number(item.TotalBillable) || 0), 0);
      const materialTotal = (materialItems as any[]).reduce((sum, item) => sum + (Number(item.Billable) || 0), 0);
      const otherTotal = (otherItems as any[]).reduce((sum, item) => sum + (Number(item.Billable) || 0), 0);
      const perDiemTotal = (perDiemItems as any[]).reduce((sum, item) => sum + (Number(item.PerDiemBillTotal) || 0), 0);

      const response = {
        quote,
        laborItems,
        materialItems,
        otherItems,
        perDiemItems,
        disciplines,
        totals: {
          labor: laborTotal,
          materials: materialTotal,
          other: otherTotal,
          perDiem: perDiemTotal,
          grandTotal: laborTotal + materialTotal + otherTotal + perDiemTotal
        }
      };

      return reply.send(response);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch quote details' });
    }
  }

  // Get only labor items for a quote
  async getQuoteLabor(
    request: FastifyRequest<QuoteParams>,
    reply: FastifyReply
  ) {
    try {
      const quoteId = request.params.id;

      const laborItems = await prisma.$queryRaw`
        SELECT 
          ql.Id,
          ql.[Order],
          ql.Description,
          ql.TotalHours,
          ql.BillRate,
          ql.LaborTotalBillable,
          ql.Labor_TotalBillable,
          ql.TotalBillable,
          ql.NumEmployees,
          ql.NumHoursPer,
          ql.NumWeeks,
          ql.IncludesPerDiem,
          ql.PerDiem_TotalDays,
          ql.PerDiem_DailyCost,
          ql.PerDiem_DailyBillable,
          ql.PerDiem_TotalCost,
          ql.PerDiem_TotalBillable,
          ql.PerDiem_PerEmployee,
          ql.CalculatedTotalHours,
          d.Name as DisciplineName,
          s.Name as SkillName,
          s.Description as SkillDescription
        FROM QuoteLabors ql
        INNER JOIN Disciplines d ON ql.DisciplineId = d.Id
        INNER JOIN Skills s ON ql.SkillId = s.Id
        WHERE ql.QuoteId = ${quoteId}
          AND ql.Active = 1
        ORDER BY ql.[Order]
      `;

      return reply.send(laborItems);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch quote labor items' });
    }
  }

  // Get only material items for a quote
  async getQuoteMaterials(
    request: FastifyRequest<QuoteParams>,
    reply: FastifyReply
  ) {
    try {
      const quoteId = request.params.id;

      const materialItems = await prisma.$queryRaw`
        SELECT 
          qm.Id,
          qm.[Order],
          qm.Description,
          qm.Cost,
          qm.Markup,
          qm.Billable,
          d.Name as DisciplineName
        FROM QuoteMaterials qm
        INNER JOIN Disciplines d ON qm.DisciplineId = d.Id
        WHERE qm.QuoteId = ${quoteId}
          AND qm.Active = 1
        ORDER BY qm.[Order]
      `;

      return reply.send(materialItems);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch quote material items' });
    }
  }

  // Get only other cost items for a quote
  async getQuoteOthers(
    request: FastifyRequest<QuoteParams>,
    reply: FastifyReply
  ) {
    try {
      const quoteId = request.params.id;

      const otherItems = await prisma.$queryRaw`
        SELECT 
          qo.Id,
          qo.[Order],
          qo.Description,
          qo.Cost,
          qo.Markup,
          qo.Billable,
          d.Name as DisciplineName,
          qot.Name as OtherTypeName
        FROM QuoteOthers qo
        INNER JOIN Disciplines d ON qo.DisciplineId = d.Id
        INNER JOIN QuoteOtherTypes qot ON qo.OtherTypeId = qot.Id
        WHERE qo.QuoteId = ${quoteId}
          AND qo.Active = 1
        ORDER BY qo.[Order]
      `;

      return reply.send(otherItems);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch quote other items' });
    }
  }

  // Get only per diem items for a quote
  async getQuotePerDiems(
    request: FastifyRequest<QuoteParams>,
    reply: FastifyReply
  ) {
    try {
      const quoteId = request.params.id;

      const perDiemItems = await prisma.$queryRaw`
        SELECT 
          qpd.ID,
          qpd.[Order],
          qpd.NumOfEmployees,
          qpd.NumOfDays,
          qpd.PerDiemPayRate,
          qpd.PerDiemBillRate,
          qpd.PerDiemPayTotal,
          qpd.PerDiemBillTotal,
          d.Name as DisciplineName
        FROM QuotePerDiems qpd
        INNER JOIN Disciplines d ON qpd.DisciplineId = d.Id
        WHERE qpd.QuoteId = ${quoteId}
          AND qpd.Active = 1
        ORDER BY qpd.[Order]
      `;

      return reply.send(perDiemItems);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch quote per diem items' });
    }
  }

  // Get quote summary with totals
  async getQuoteSummary(
    request: FastifyRequest<QuoteParams>,
    reply: FastifyReply
  ) {
    try {
      const quoteId = request.params.id;

      // Get the main quote data
      const quote = await prisma.quotes.findFirst({
        where: { 
          ID: quoteId,
          Active: true,
          IsCurrentRevision: true
        },
      });

      if (!quote) {
        return reply.code(404).send({ error: 'Quote not found' });
      }

      // Calculate totals from each category
      const [laborTotal, materialTotal, otherTotal, perDiemTotal] = await Promise.all([
        prisma.$queryRaw`
          SELECT COALESCE(SUM(TotalBillable), 0) as total
          FROM QuoteLabors
          WHERE QuoteId = ${quoteId} AND Active = 1
        `,
        prisma.$queryRaw`
          SELECT COALESCE(SUM(Billable), 0) as total
          FROM QuoteMaterials
          WHERE QuoteId = ${quoteId} AND Active = 1
        `,
        prisma.$queryRaw`
          SELECT COALESCE(SUM(Billable), 0) as total
          FROM QuoteOthers
          WHERE QuoteId = ${quoteId} AND Active = 1
        `,
        prisma.$queryRaw`
          SELECT COALESCE(SUM(PerDiemBillTotal), 0) as total
          FROM QuotePerDiems
          WHERE QuoteId = ${quoteId} AND Active = 1
        `
      ]);

      const laborSum = Number((laborTotal as any)[0]?.total || 0);
      const materialSum = Number((materialTotal as any)[0]?.total || 0);
      const otherSum = Number((otherTotal as any)[0]?.total || 0);
      const perDiemSum = Number((perDiemTotal as any)[0]?.total || 0);

      const response = {
        quote,
        totals: {
          labor: laborSum,
          materials: materialSum,
          other: otherSum,
          perDiem: perDiemSum,
          grandTotal: laborSum + materialSum + otherSum + perDiemSum
        }
      };

      return reply.send(response);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch quote summary' });
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