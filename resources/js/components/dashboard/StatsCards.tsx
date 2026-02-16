import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, Pencil, LucideIcon } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import { Transaction } from '@/types/index';

interface StatsCardsProps {
  transactions: Transaction[];
  savings: number;
  onEditSavings: (newAmount: number) => void;
}

interface Stat {
  title: string;
  value: string;
  icon: LucideIcon;
  change: string;
  positive: boolean;
  gradient: string;
  editable?: boolean;
}

const StatsCards = ({ transactions, savings, onEditSavings }: StatsCardsProps) => {
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editAmount, setEditAmount] = useState<string>('');

  // Calculate current period stats
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
  
  const balance = income - expenses;

  // Calculate previous period stats (comparing last 30 days vs previous 30 days)
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const currentPeriodTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date >= thirtyDaysAgo && date <= now;
  });

  const previousPeriodTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date >= sixtyDaysAgo && date < thirtyDaysAgo;
  });

  const currentIncome = currentPeriodTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
  
  const previousIncome = previousPeriodTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

  const currentExpenses = currentPeriodTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
  
  const previousExpenses = previousPeriodTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

  const currentBalance = currentIncome - currentExpenses;
  const previousBalance = previousIncome - previousExpenses;

  // Calculate percentage changes
  const calculatePercentageChange = (current: number, previous: number): string => {
    if (previous === 0) return current > 0 ? '+100.0%' : '0.0%';
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const balanceChange = calculatePercentageChange(currentBalance, previousBalance);
  const incomeChange = calculatePercentageChange(currentIncome, previousIncome);
  const expensesChange = calculatePercentageChange(currentExpenses, previousExpenses);
  
  const savingsChange = savings > 0 ? '+100.0%' : '0.0%';

  const handleEditSavings = (): void => {
    setEditAmount(savings.toString());
    setShowEditModal(true);
  };

  const handleSaveEdit = (): void => {
    const amount = parseFloat(editAmount);
    if (!isNaN(amount) && amount >= 0) {
      onEditSavings(amount);
      setShowEditModal(false);
    }
  };

  const stats: Stat[] = [
    {
      title: 'Total Balance',
      value: formatCurrency(balance),
      icon: Wallet,
      change: balanceChange,
      positive: currentBalance >= previousBalance,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Income',
      value: formatCurrency(income),
      icon: TrendingUp,
      change: incomeChange,
      positive: currentIncome >= previousIncome,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Expenses',
      value: formatCurrency(expenses),
      icon: TrendingDown,
      change: expensesChange,
      positive: currentExpenses <= previousExpenses,
      gradient: 'from-red-500 to-rose-500'
    },
    {
      title: 'Savings',
      value: formatCurrency(savings),
      icon: PiggyBank,
      change: savingsChange,
      positive: true,
      gradient: 'from-purple-500 to-pink-500',
      editable: true
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            data-testid={`stat-card-${stat.title.toLowerCase().replace(' ', '-')}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative overflow-hidden rounded-2xl p-6 card-glass"
          >
            {/* Icon Background */}
            <div className="absolute top-4 right-4 opacity-10">
              <stat.icon className="w-20 h-20" style={{ color: '#8151d9' }} />
            </div>

            {/* Content */}
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(129, 81, 217, 0.2) 0%, rgba(161, 120, 232, 0.2) 100%)',
                  }}
                >
                  <stat.icon className="w-6 h-6" style={{ color: '#8151d9' }} />
                </div>
                <span 
                  className="text-sm font-medium px-2 py-1 rounded-full"
                  style={{
                    color: stat.positive ? '#10b981' : '#ef4444',
                    backgroundColor: stat.positive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                  }}
                >
                  {stat.change}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="theme-text-secondary text-sm mb-2">{stat.title}</p>
                  <p className="theme-text text-3xl font-bold">{stat.value}</p>
                </div>
                {stat.editable && (
                  <button
                    onClick={handleEditSavings}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title="Edit Savings"
                  >
                    <Pencil className="w-5 h-5" style={{ color: '#8151d9' }} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Savings Modal */}
      {showEditModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          onClick={() => setShowEditModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl p-6"
            style={{
              background: 'rgba(20, 20, 20, 0.98)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-4">Edit Savings Amount</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">
                  Savings Amount (₱)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all text-lg"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-3 rounded-lg border font-medium transition-colors hover:bg-white/5"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#9ca3af'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90"
                  style={{
                    background: 'linear-gradient(135deg, #8151d9 0%, #a178e8 100%)'
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default StatsCards;