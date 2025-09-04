// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// --- INTERFACES (No changes needed) ---
export interface Quote {
  ID: string;
  Name: string;
  ProposalNumber: string;
  ContactName: string;
  ContactEmail: string;
  QuoteTotal: number;
  CreatedAt: string;
  CustomerId: string;
  CustomerName: string;
  Status: number;
}
export interface QuoteListResponse {
  data: Quote[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
export interface LaborItem {
  Id: string;
  Order: number;
  Description: string;
  TotalHours: number;
  BillRate: number;
  LaborTotalBillable: number;
  Labor_TotalBillable: number;
  TotalBillable: number;
  NumEmployees: number;
  NumHoursPer: number;
  NumWeeks: number;
  IncludesPerDiem: boolean;
  PerDiem_TotalDays: number;
  PerDiem_DailyCost: number;
  PerDiem_DailyBillable: number;
  PerDiem_TotalCost: number;
  PerDiem_TotalBillable: number;
  PerDiem_PerEmployee: boolean;
  CalculatedTotalHours: boolean;
  DisciplineName: string;
  SkillName: string;
  SkillDescription: string;
}
export interface MaterialItem {
  Id: string;
  Order: number;
  Description: string;
  Cost: number;
  Markup: number;
  Billable: number;
  DisciplineName: string;
}
export interface OtherItem {
  Id: string;
  Order: number;
  Description: string;
  Cost: number;
  Markup: number;
  Billable: number;
  DisciplineName: string;
  OtherTypeName: string;
}
export interface PerDiemItem {
  ID: string;
  Order: number;
  NumOfEmployees: number;
  NumOfDays: number;
  PerDiemPayRate: number;
  PerDiemBillRate: number;
  PerDiemPayTotal: number;
  PerDiemBillTotal: number;
  DisciplineName: string;
}
export interface Discipline {
  Id: string;
  Name: string;
}
export interface QuoteTotals {
  labor: number;
  materials: number;
  other: number;
  perDiem: number;
  grandTotal: number;
}
export interface QuoteDetailsResponse {
  quote: Quote;
  laborItems: LaborItem[];
  materialItems: MaterialItem[];
  otherItems: OtherItem[];
  perDiemItems: PerDiemItem[];
  disciplines: Discipline[];
  totals: QuoteTotals;
}
export interface QuoteSummaryResponse {
  quote: Quote;
  totals: QuoteTotals;
}

// --- API CLIENT (Updated with new methods) ---

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        // For DELETE requests, a 204 No Content is a success
        if (response.status === 204 && options?.method === 'DELETE') {
            return {} as T;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // --- CREATE ---
  async createQuote(quoteData: Partial<Quote>): Promise<Quote> {
    return this.request<Quote>('/quotes', {
      method: 'POST',
      body: JSON.stringify(quoteData),
    });
  }

  // --- READ ---
  async getQuotes(page: number = 1, pageSize: number = 25): Promise<QuoteListResponse> {
    return this.request<QuoteListResponse>(`/quotes?page=${page}&pageSize=${pageSize}`);
  }
  async getQuoteById(id: string): Promise<Quote> {
    return this.request<Quote>(`/quotes/id/${id}`);
  }
  async getQuoteByProposalNumber(proposalNumber: string): Promise<Quote> {
    return this.request<Quote>(`/quotes/proposal/${proposalNumber}`);
  }
  async getQuoteDetails(id: string): Promise<QuoteDetailsResponse> {
    return this.request<QuoteDetailsResponse>(`/quotes/${id}/details`);
  }
  async getQuoteSummary(id: string): Promise<QuoteSummaryResponse> {
    return this.request<QuoteSummaryResponse>(`/quotes/${id}/summary`);
  }
  async getQuoteLabor(id: string): Promise<LaborItem[]> {
    return this.request<LaborItem[]>(`/quotes/${id}/labor`);
  }
  async getQuoteMaterials(id: string): Promise<MaterialItem[]> {
    return this.request<MaterialItem[]>(`/quotes/${id}/materials`);
  }
  async getQuoteOthers(id: string): Promise<OtherItem[]> {
    return this.request<OtherItem[]>(`/quotes/${id}/others`);
  }
  async getQuotePerDiems(id: string): Promise<PerDiemItem[]> {
    return this.request<PerDiemItem[]>(`/quotes/${id}/perdiems`);
  }

  // --- UPDATE ---
  async updateQuote(id: string, quoteData: Partial<Quote>): Promise<Quote> {
    return this.request<Quote>(`/quotes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(quoteData),
    });
  }

  // --- DELETE ---
  async deleteQuote(id: string): Promise<void> {
    await this.request<void>(`/quotes/${id}`, {
      method: 'DELETE',
    });
  }
}

const apiClient = new ApiClient();
export default apiClient;

// --- EXPORTS (No changes needed) ---
export const {
  getQuotes,
  getQuoteById,
  getQuoteByProposalNumber,
  getQuoteDetails,
  getQuoteSummary,
  getQuoteLabor,
  getQuoteMaterials,
  getQuoteOthers,
  getQuotePerDiems
} = apiClient;