import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Head } from '@inertiajs/react';

import Sidebar from '@/components/dashboard/Sidebar';
import StatsCards from '@/components/dashboard/StatsCards';
import SmartTrackingChart from '@/components/dashboard/SmartTrackingChart';
import SpendingCategories from '@/components/dashboard/SpendingCategories';
import BudgetManagement from '@/components/dashboard/BudgetManagement';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import QuickActionModal from '@/components/dashboard/QuickActionModal';

import '@/../css/dashboard.css'; 

import { Transaction, Budget, SavingsData } from '@/types/index';

interface DashboardProps {
  transactions: Transaction[];
  savings: number;
  budgets: Budget[];
  onAddTransaction: (transaction: Transaction) => void;
  onAddSavings: (savingsData: SavingsData) => void;
  onEditSavings: (newAmount: number) => void;
  onCreateBudget: (budgetData: Budget) => void;
  onEditBudget: (budgetData: Budget) => void;
  onDeleteBudget: (category: string) => void;
}

// 3. We use the props passed from Laravel web.php. 
// We add default empty values to prevent crashes if data is missing.
const Dashboard = ({ 
  transactions = [], 
  savings = 0, 
  budgets = [], 
  onAddTransaction, 
  onAddSavings, 
  onEditSavings = (val) => console.log(val), 
  onCreateBudget, 
  onEditBudget, 
  onDeleteBudget 
}: DashboardProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleAddTransaction = (transaction: Transaction): void => {
    if (onAddTransaction) onAddTransaction(transaction);
    setIsModalOpen(false);
  };

  const handleAddSavings = (savingsData: SavingsData): void => {
    if (onAddSavings) onAddSavings(savingsData);
    setIsModalOpen(false);
  };

  const handleCreateBudget = (budgetData: Budget): void => {
    if (onCreateBudget) onCreateBudget(budgetData);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* 4. This sets the browser tab title without using Laravel's default header */}
      <Head title="Dashboard" />

      {/* 5. NOTICE: We do NOT use <AppLayout> here. 
          Your code below already handles the Sidebar and Layout. */}
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
              <p className="theme-text-secondary">Welcome back! Here's your financial overview.</p>
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
    </>
  );
};

export default Dashboard;