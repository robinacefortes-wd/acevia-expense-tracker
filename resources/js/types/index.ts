// 1. Existing System Types
export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

// 2. New Dashboard & Finance Interfaces
export interface Transaction {
  id: number;
  amount: string | number;
  category: string;
  date: string;
  time?: string;
  note?: string;
  type: 'income' | 'expense';
}

export interface Budget {
  category: string;
  limit: number;
  period: 'today' | 'week' | 'month' | 'year';
}

export interface SavingsData {
  amount: number;
  note?: string;
  date: string;
}

export type ThemeType = 'dark' | 'light';

// 3. Updated Shared Data (Used by Inertia)
export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    // Add these so your pages know they are coming from Laravel
    transactions?: Transaction[];
    budgets?: Budget[];
    [key: string]: unknown;
};