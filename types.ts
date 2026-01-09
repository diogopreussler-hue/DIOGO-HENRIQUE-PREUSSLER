
export enum PaymentStatus {
  PAID = 'Sim',
  PENDING = 'Não'
}

export interface ProjectSettings {
  projectName: string;
  clientName: string;
  startDate: string;
  endDate: string;
  builtArea: number;
  estimatedM2Value: number;
  wallEstimation: number;
  feePercentage: number; // Agora variável por obra
  cashInHand: number;
  cashDate: string;
}

export interface Expense {
  id: string;
  date: string;
  nfNumber: string;
  type: string;
  product: string;
  provider: string;
  quantity: number;
  unitValue: number;
  originalValue: number; // Valor de Tabela / Orçado
  negotiatedValue: number; // Valor Fechado
  discount: number; // Calculado: original - negotiated
  status: PaymentStatus;
}

export interface Quote {
  id: string;
  description: string;
  quantity: string;
  paymentMethod: string;
  options: {
    provider: string;
    value: number;
    approved: boolean;
  }[];
  date: string;
}

export interface TimelineTask {
  id: string;
  stage: string;
  progress: number;
  estimatedDays: number;
  startDate: string;
  endDate: string;
}

export interface ProjectData {
  settings: ProjectSettings;
  expenses: Expense[];
  quotes: Quote[];
  tasks: TimelineTask[];
  version: string;
}
