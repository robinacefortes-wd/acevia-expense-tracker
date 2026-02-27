import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import BudgetManagement from '@/components/dashboard/BudgetManagement';
import MiniCalculator from '@/components/dashboard/MiniCalculator';
import QuickActionModal from '@/components/dashboard/QuickActionModal';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import Sidebar from '@/components/dashboard/Sidebar';
import SmartTrackingChart from '@/components/dashboard/SmartTrackingChart';
import SpendingCategories from '@/components/dashboard/SpendingCategories';
import StatsCards from '@/components/dashboard/StatsCards';
import { useToast } from '@/components/dashboard/ToastContext';

import type { Transaction, Budget, SavingsData } from '@/types/index';

interface SavingsEntry {
  amount: string | number;
}

interface DashboardProps {
  transactions: Transaction[];
  savings: SavingsEntry[];
  budgets: Budget[];
  onAddTransaction?: (transaction: Transaction) => void;
  onAddSavings?: (savingsData: SavingsData) => void;
  onCreateBudget?: (budgetData: Budget) => void;
}

const Dashboard = ({
  transactions = [],
  savings = [],
  budgets = [],
}: DashboardProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { showToast } = useToast();

  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time || '00:00:00'}`);
    const dateB = new Date(`${b.date}T${b.time || '00:00:00'}`);
    return dateB.getTime() - dateA.getTime();
  });

  const totalSavingsSum = savings.reduce((acc, curr) => acc + parseFloat(String(curr.amount || 0)), 0);

  const handleEditTransaction = (transactionData: Transaction) => {
    router.post('/transactions/update', {
      id: transactionData.id,
      amount: transactionData.amount,
      category: transactionData.category,
      date: transactionData.date,
      note: transactionData.note,
      type: transactionData.type,
    }, {
      preserveScroll: true,
      onSuccess: () => showToast('Transaction updated successfully!'),
      onError: () => showToast('Failed to update transaction.', 'error'),
    });
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    router.post('/transactions/delete', {
      id: transaction.id
    }, {
      preserveScroll: true,
      onSuccess: () => showToast('Transaction deleted.'),
      onError: () => showToast('Failed to delete transaction.', 'error'),
    });
  };

  const handleEditSavings = (amount: number, date: string) => {
    router.post('/savings', {
      amount,
      date,
      note: 'Updated via Dashboard Stats',
      update_total: true,
    }, {
      preserveScroll: true,
      onSuccess: () => showToast('Savings updated successfully!'),
      onError: () => showToast('Failed to update savings.', 'error'),
    });
  };

  const handleEditBudget = (budgetData: Budget) => {
    router.post('/budgets/update', {
      id: budgetData.id,
      limit: budgetData.limit,
      period: budgetData.period,
    }, {
      preserveScroll: true,
      onSuccess: () => showToast('Budget updated successfully!'),
      onError: () => showToast('Failed to update budget.', 'error'),
    });
  };

  const handleDeleteBudget = (budget: Budget) => {
    router.post('/budgets/delete', {
      id: budget.id
    }, {
      preserveScroll: true,
      onSuccess: () => showToast('Budget deleted.'),
      onError: () => showToast('Failed to delete budget.', 'error'),
    });
  };

  return (
    <>
      <Head title="Dashboard" />
      <div className="flex min-h-screen theme-bg">
        <Sidebar />

        <main className="flex-1 overflow-auto" style={{ marginLeft: '72px' }}>
          <div className="p-6 xl:p-8">

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold theme-text mb-2">Dashboard</h1>
              <p className="theme-text-secondary">Welcome back! Here's your financial overview.</p>
            </motion.div>

            <StatsCards
              transactions={sortedTransactions}
              savings={totalSavingsSum}
              onEditSavings={handleEditSavings}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2">
                <SmartTrackingChart transactions={sortedTransactions} />
              </div>
              <div>
                <SpendingCategories transactions={sortedTransactions} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div>
                <BudgetManagement
                  transactions={sortedTransactions}
                  budgets={budgets}
                  onEditBudget={handleEditBudget}
                  onDeleteBudget={handleDeleteBudget}
                />
              </div>
              <div className="lg:col-span-2">
                <RecentTransactions
                  transactions={sortedTransactions}
                  onDeleteTransaction={handleDeleteTransaction}
                  onEditTransaction={handleEditTransaction}
                />
              </div>
            </div>
          </div>
        </main>

        <motion.button
          data-testid="quick-action-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl z-50 transition-transform cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #8151d9 0%, #a178e8 100%)' }}
        >
          <Plus className="w-8 h-8 text-white" />
        </motion.button>

        <MiniCalculator />

        <QuickActionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </>
  );
};

export default Dashboard;