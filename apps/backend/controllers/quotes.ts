import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient, Quotes } from '@prisma/client';

const prisma = new PrismaClient();

// Interface for URL parameters
interface QuoteParams {
  Params: {
    id: string;
    proposalNumber: string;
  };
}

// Interface for pagination query
interface PaginationQuery {
  Querystring: {
    page?: number;
    pageSize?: number;
  };
}

// Interface for the quote creation request body
interface CreateQuoteBody {
  Body: Omit<Quotes, 'ID' | 'CreatedAt' | 'EditedAt' | 'MyTimestamp' | 'ProjectManager'>;
}

// Interface for the quote update request body
interface UpdateQuoteBody {
  Body: Partial<Omit<Quotes, 'ID' | 'CreatedAt' | 'EditedAt' | 'MyTimestamp' | 'ProjectManager'>>;
}

class QuotesController {
  // CREATE a new quote - Enabled
  async createQuote(
    request: FastifyRequest<CreateQuoteBody>,
    reply: FastifyReply
  ) {
    try {
      const newQuoteData = request.body;
      
      // Create the new quote record
      const quote = await prisma.quotes.create({
        data: {
          ...newQuoteData,
          Revision: 0,
          IsCurrentRevision: true,
          Active: true,
          CreatedAt: new Date(),
          EditedAt: new Date(),
        },
      });

      // After creation, update the QuoteChainId to match the new quote's ID.
      // This establishes the start of a revision chain.
      const finalQuote = await prisma.quotes.update({
        where: { ID: quote.ID },
        data: { QuoteChainId: quote.ID },
      });

      return reply.code(201).send(finalQuote);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to create quote' });
    }
  }
  
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
          where: { Active: true }, // Only fetch active quotes
          orderBy: {
            CreatedAt: 'desc'
          },
          skip,
          take: pageSize
        }),
        prisma.quotes.count({ where: { Active: true } })
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

  // READ single quote by ID - Enabled
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
  
  // UPDATE a quote by ID - Enabled
  async updateQuote(
    request: FastifyRequest<QuoteParams & UpdateQuoteBody>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const updateData = request.body;

      const updatedQuote = await prisma.quotes.update({
        where: { ID: id },
        data: {
          ...updateData,
          EditedAt: new Date(),
        },
      });

      return reply.send(updatedQuote);
    } catch (error) {
      request.log.error(error);
      // Handle cases where the quote to update doesn't exist
      if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        return reply.code(404).send({ error: 'Quote not found' });
      }
      return reply.code(500).send({ error: 'Failed to update quote' });
    }
  }
  
  // DELETE a quote by ID (Soft Delete) - Enabled
  async deleteQuote(
    request: FastifyRequest<QuoteParams>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;

      // This is a "soft delete". We set the Active flag to false instead of deleting the record.
      await prisma.quotes.update({
        where: { ID: id },
        data: { Active: false },
      });

      return reply.code(204).send(); // 204 No Content is a standard success response for deletes
    } catch (error) {
      request.log.error(error);
       if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        return reply.code(404).send({ error: 'Quote not found' });
      }
      return reply.code(500).send({ error: 'Failed to delete quote' });
    }
  }
  
  // CREATE a new revision of a quote - Enabled
  async createRevision(
    request: FastifyRequest<QuoteParams>,
    reply: FastifyReply
  ) {
    try {
      const { id: originalQuoteId } = request.params;

      // Find the original quote to revise
      const originalQuote = await prisma.quotes.findUnique({
        where: { ID: originalQuoteId },
      });

      if (!originalQuote) {
        return reply.code(404).send({ error: 'Original quote not found' });
      }

      // Use a transaction to ensure both operations succeed or fail together
      const [, newRevision] = await prisma.$transaction([
        // 1. Mark the old quote as no longer the current revision
        prisma.quotes.update({
          where: { ID: originalQuoteId },
          data: { IsCurrentRevision: false },
        }),
        // 2. Create the new revision based on the original quote's data
        prisma.quotes.create({
          data: {
            ...originalQuote,
            ID: undefined, // Let Prisma generate a new ID
            Revision: (originalQuote.Revision || 0) + 1,
            IsCurrentRevision: true,
            CreatedAt: new Date(),
            EditedAt: new Date(),
          },
        }),
      ]);
      
      // Note: This only copies the main quote record. If you need to copy related items
      // (like labor, materials, etc.), you would need to add logic here to query
      // those items from the originalQuoteId and create new ones for the newRevision.ID.

      return reply.code(201).send(newRevision);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to create quote revision' });
    }
  }

  // --- EXISTING READ-ONLY METHODS ---
  // (The rest of your read-only methods like getQuoteDetails, getQuoteLabor, etc. remain unchanged)

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
}

export default QuotesController;