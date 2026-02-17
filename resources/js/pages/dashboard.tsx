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
  // Data coming from DashboardController.php
  transactions: Transaction[];
  savings: any[]; 
  budgets: Budget[];
  
  // Original Props (Keeping these for compatibility)
  onAddTransaction?: (transaction: Transaction) => void;
  onAddSavings?: (savingsData: SavingsData) => void;
  onEditSavings?: (newAmount: number) => void;
  onCreateBudget?: (budgetData: Budget) => void;
  onEditBudget?: (budgetData: Budget) => void;
  onDeleteBudget?: (category: string) => void;
}

const Dashboard = ({ 
  transactions = [], 
  savings = [], 
  budgets = [], 
  onAddTransaction, 
  onAddSavings, 
  onEditSavings = (val) => console.log(val), 
  onCreateBudget, 
  onEditBudget = (data) => console.log(data), 
  onDeleteBudget = (cat) => console.log(cat)
}: DashboardProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // LOGIC FOR BACKEND DATA:
  // Since 'savings' is now an array from the DB, we sum it for the StatsCards
  const totalSavingsSum = savings.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

  // Original handlers kept intact
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
      <Head title="Dashboard" />
      <div className="flex min-h-screen theme-bg">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto" style={{ marginLeft: '72px' }}>
          <div className="p-6 xl:p-8">
            
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

            {/* Stats Cards - Using backend transactions and summed savings */}
            <StatsCards 
              transactions={transactions} 
              savings={totalSavingsSum}
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
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl z-50 transition-transform"
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
          // These props remain for the component to function, but 
          // actual "Saving" happens via the router.post inside the Modal.
          onAddTransaction={handleAddTransaction}
          onAddSavings={handleAddSavings}
          onCreateBudget={handleCreateBudget}
        />
      </div>
    </>
  );
};

export default Dashboard;