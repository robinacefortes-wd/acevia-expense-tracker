import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

import Sidebar from './Sidebar';
import StatsCards from './StatsCards';
import SmartTrackingChart from './SmartTrackingChart';
import SpendingCategories from '.SpendingCategories';
import BudgetManagement from '../components/dashboard/BudgetManagement';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import QuickActionModal from '../components/dashboard/QuickActionModal';

/* =======================
   Types
======================= */

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id?: number | string;
  date: string;
  time?: string;
  category: string;
  note?: string;
  amount: number;
  type: TransactionType;
}

export interface Savings {
  id?: number | string;
  amount: number;
  goal?: number;
  label?: string;
}

export interface Budget {
  id?: number | string;
  category: string;
  limit: number;
}

interface DashboardProps {
  transactions: Transaction[];
  savings: Savings[];
  budgets: Budget[];

  onAddTransaction?: (transaction: Transaction) => void;
  onAddSavings?: (savings: Savings) => void;
  onEditSavings?: (savings: Savings) => void;

  onCreateBudget?: (budget: Budget) => void;
  onEditBudget?: (budget: Budget) => void;
  onDeleteBudget?: (budgetId: Budget['id']) => void;
}

/* =======================
   Component
======================= */

const Dashboard: React.FC<DashboardProps> = ({
  transactions,
  savings,
  budgets,
  onAddTransaction,
  onAddSavings,
  onEditSavings,
  onCreateBudget,
  onEditBudget,
  onDeleteBudget,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  /* =======================
     Handlers
  ======================= */

  const handleAddTransaction = (transaction: Transaction) => {
    onAddTransaction?.(transaction);
    setIsModalOpen(false);
  };

  const handleAddSavings = (savingsData: Savings) => {
    onAddSavings?.(savingsData);
    setIsModalOpen(false);
  };

  const handleCreateBudget = (budgetData: Budget) => {
    onCreateBudget?.(budgetData);
    setIsModalOpen(false);
  };

  /* =======================
     Render
  ======================= */

  return (
    <div className="flex min-h-screen theme-bg">
      <Sidebar />

      <main className="flex-1 overflow-auto" style={{ marginLeft: '72px' }}>
        <div className="p-8 max-w-[1600px] mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold theme-text mb-2">Dashboard</h1>
            <p className="theme-text-secondary">
              Welcome back! Here's your financial overview.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <StatsCards
            transactions={transactions}
            savings={savings}
            onEditSavings={onEditSavings}
          />

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2">
              <SmartTrackingChart transactions={transactions} />
            </div>
            <div>
              <SpendingCategories transactions={transactions} />
            </div>
          </div>

          {/* Budget and Recent Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div>
              <BudgetManagement
                transactions={transactions}
                budgets={budgets}
                onEditBudget={onEditBudget}
                onDeleteBudget={onDeleteBudget}
              />
            </div>
            <div className="lg:col-span-2">
              <RecentTransactions transactions={transactions} />
            </div>
          </div>
        </div>
      </main>

      {/* Quick Action Button */}
      <motion.button
        data-testid="quick-action-button"
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl z-50"
        style={{
          background: 'linear-gradient(135deg, #8151d9 0%, #a178e8 100%)',
        }}
      >
        <Plus className="w-8 h-8 text-white" />
      </motion.button>

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTransaction={handleAddTransaction}
        onAddSavings={handleAddSavings}
        onCreateBudget={handleCreateBudget}
      />
    </div>
  );
};

export default Dashboard;
