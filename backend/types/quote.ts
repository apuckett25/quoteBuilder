export interface Quote {
  id: string;
  title: string;
  clientId: string;
  projectNumber: string;
  status: QuoteStatus;
  laborCost: number;
  materialCost: number;
  otherCosts: number;
  totalCost: number;
  margin: number;
  finalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  revisionNumber: number;
  emailedAt?: Date;
}

export enum QuoteStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}