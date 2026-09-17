import type { User } from "@/types/auth";

export interface DemoAccount {
  id: string;
  name: string;
  number: string;
  balance: number;
}

export interface DemoInvestment {
  id: string;
  name: string;
  amount: number;
  rate: number;
  net: number;
  total: number;
  maturity: string;
}

export interface DemoTransaction {
  id: string;
  concept: string;
  category: "inversion" | "credito" | "ingreso" | "egreso";
  amount: number;
  status: "completed" | "pending";
  createdAt: string;
}

export const demoUser: User = {
  id: "demo-001",
  name: "Usuario Demo",
  email: "demo@presto.app",
  role: "usuario",
};

export const demoAccounts: DemoAccount[] = [
  { id: "acc-1", name: "Cuenta principal", number: "•••• 4821", balance: 1450000 },
  { id: "acc-2", name: "Cuenta ahorros", number: "•••• 2277", balance: 250000 },
];

export const demoInvestments: DemoInvestment[] = [
  {
    id: "inv-1",
    name: "Inversión 6 meses",
    amount: 200000,
    rate: 0.075,
    net: 15000,
    total: 215000,
    maturity: "2027-03-14",
  },
  {
    id: "inv-2",
    name: "Inversión 12 meses",
    amount: 500000,
    rate: 0.15,
    net: 75000,
    total: 575000,
    maturity: "2027-09-14",
  },
  {
    id: "inv-3",
    name: "Inversión 24 meses",
    amount: 300000,
    rate: 0.3,
    net: 90000,
    total: 390000,
    maturity: "2028-09-14",
  },
];

export const demoTransactions: DemoTransaction[] = [
  { id: "tx-1", concept: "Inversión 12 meses", category: "inversion", amount: 500000, status: "completed", createdAt: "2026-09-12" },
  { id: "tx-2", concept: "Cash In", category: "ingreso", amount: 800000, status: "completed", createdAt: "2026-09-10" },
  { id: "tx-3", concept: "Inversión 6 meses", category: "inversion", amount: 200000, status: "completed", createdAt: "2026-09-08" },
  { id: "tx-4", concept: "Cuota crédito", category: "credito", amount: -125000, status: "completed", createdAt: "2026-09-05" },
  { id: "tx-5", concept: "Retiro de pago", category: "egreso", amount: -60000, status: "pending", createdAt: "2026-09-03" },
];

export const demoSummary = {
  available: 1700000,
  invested: 1000000,
  owed: 500000,
};