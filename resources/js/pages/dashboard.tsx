import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Head, router } from '@inertiajs/react';
import { route } from 'ziggy-js';

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
  onEditSavings?: (newAmount: number, date: string) => void; 
  onCreateBudget?: (budgetData: Budget) => void;
}

const Dashboard = ({ 
  transactions = [], 
  savings = [], 
  budgets = [], 
  onAddTransaction, 
  onAddSavings, 
  onEditSavings = (amount, date) => console.log(amount, date), 
  onCreateBudget, 
}: DashboardProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // LOGIC FOR BACKEND DATA:
  const totalSavingsSum = savings.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

  const handleAddTransaction = (transaction: Transaction): void => {
    if (onAddTransaction) onAddTransaction(transaction);
    setIsModalOpen(false);
  };

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
          onSuccess: () => console.log("Transaction Updated!"),
      });
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
      if (confirm(`Delete transaction: ${transaction.category} - ${transaction.amount}?`)) {
          router.post('/transactions/delete', { 
              id: transaction.id 
          }, {
              preserveScroll: true,
              onSuccess: () => console.log("Transaction removed")
          });
      }
  };

  const handleAddSavings = (savingsData: SavingsData): void => {
    if (onAddSavings) onAddSavings(savingsData);
    setIsModalOpen(false);
  };

  const handleEditSavings = (amount: number, date: string) => {
    router.post('/savings', { 
      amount: amount,
      date: date,
      note: 'Updated via Dashboard Stats',
      update_total: true, 
    }, {
      preserveScroll: true,
      onSuccess: () => console.log("Success!"),
    });
  };

  const handleCreateBudget = (budgetData: Budget): void => {
    if (onCreateBudget) onCreateBudget(budgetData);
    setIsModalOpen(false);
  };

  const handleEditBudget = (budgetData: Budget) => {
      router.post('/budgets/update', { 
          id: budgetData.id,
          limit: budgetData.limit,
          period: budgetData.period,
      }, {
          preserveScroll: true,
          onSuccess: () => console.log("Budget Updated!"),
      });
  };

  const handleDeleteBudget = (budget: Budget) => {
      if (confirm(`Are you sure you want to delete the ${budget.category} budget?`)) {
          router.post('/budgets/delete', { 
              id: budget.id 
          }, {
              preserveScroll: true,
              onSuccess: () => console.log("Deleted successfully")
          });
      }
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
              onEditSavings={handleEditSavings}
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
                  onEditBudget={handleEditBudget}
                  onDeleteBudget={handleDeleteBudget}
                />
              </div>
              <div className="lg:col-span-2">
                <RecentTransactions 
                    transactions={transactions}
                    onDeleteTransaction={handleDeleteTransaction}
                    onEditTransaction={handleEditTransaction} 
                />
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