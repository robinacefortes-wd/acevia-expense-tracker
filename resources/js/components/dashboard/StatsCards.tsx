import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Pencil,
  LucideIcon,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

type Transaction = {
  id?: string | number;
  type: 'income' | 'expense';
  amount: number | string;
  date: string;
};

interface StatsCardsProps {
  transactions: Transaction[];
  savings: number;
  onEditSavings: (amount: number) => void;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  transactions,
  savings,
  onEditSavings,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAmount, setEditAmount] = useState<string>('');

  // Totals
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

  const balance = income - expenses;

  // Period comparison
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

  const sumByType = (list: Transaction[], type: 'income' | 'expense') =>
    list
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

  const currentIncome = sumByType(currentPeriodTransactions, 'income');
  const previousIncome = sumByType(previousPeriodTransactions, 'income');

  const currentExpenses = sumByType(currentPeriodTransactions, 'expense');
  const previousExpenses = sumByType(previousPeriodTransactions, 'expense');

  const currentBalance = currentIncome - currentExpenses;
  const previousBalance = previousIncome - previousExpenses;

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? '+100.0%' : '0.0%';
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const stats: {
    title: string;
    value: string;
    icon: LucideIcon;
    change: string;
    positive: boolean;
    gradient: string;
    editable?: boolean;
  }[] = [
    {
      title: 'Total Balance',
      value: formatCurrency(balance),
      icon: Wallet,
      change: calculatePercentageChange(currentBalance, previousBalance),
      positive: currentBalance >= previousBalance,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Income',
      value: formatCurrency(income),
      icon: TrendingUp,
      change: calculatePercentageChange(currentIncome, previousIncome),
      positive: currentIncome >= previousIncome,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Expenses',
      value: formatCurrency(expenses),
      icon: TrendingDown,
      change: calculatePercentageChange(currentExpenses, previousExpenses),
      positive: currentExpenses <= previousExpenses,
      gradient: 'from-red-500 to-rose-500',
    },
    {
      title: 'Savings',
      value: formatCurrency(savings),
      icon: PiggyBank,
      change: savings > 0 ? '+100.0%' : '0.0%',
      positive: true,
      gradient: 'from-purple-500 to-pink-500',
      editable: true,
    },
  ];

  const handleSaveEdit = () => {
    const amount = parseFloat(editAmount);
    if (!isNaN(amount) && amount >= 0) {
      onEditSavings(amount);
      setShowEditModal(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="relative overflow-hidden rounded-2xl p-6 card-glass"
          >
            <div className="absolute top-4 right-4 opacity-10">
              <stat.icon className="w-20 h-20" style={{ color: '#8151d9' }} />
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(129, 81, 217, 0.2), rgba(161, 120, 232, 0.2))',
                  }}
                >
                  <stat.icon className="w-6 h-6" style={{ color: '#8151d9' }} />
                </div>
                <span
                  className="text-sm font-medium px-2 py-1 rounded-full"
                  style={{
                    color: stat.positive ? '#10b981' : '#ef4444',
                    backgroundColor: stat.positive
                      ? 'rgba(16,185,129,0.1)'
                      : 'rgba(239,68,68,0.1)',
                  }}
                >
                  {stat.change}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="theme-text-secondary text-sm mb-2">
                    {stat.title}
                  </p>
                  <p className="theme-text text-3xl font-bold">
                    {stat.value}
                  </p>
                </div>

                {stat.editable && (
                  <button
                    onClick={() => {
                      setEditAmount(savings.toString());
                      setShowEditModal(true);
                    }}
                    className="p-2 rounded-lg hover:bg-white/10"
                  >
                    <Pencil className="w-5 h-5" style={{ color: '#8151d9' }} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
          onClick={() => setShowEditModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl p-6"
            style={{
              background: 'rgba(20,20,20,0.98)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <h3 className="text-xl font-bold text-white mb-4">
              Edit Savings Amount
            </h3>

            <input
              type="number"
              value={editAmount}
              onChange={e => setEditAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-white"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-3 rounded-lg text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-3 rounded-lg text-white"
                style={{
                  background:
                    'linear-gradient(135deg, #8151d9, #a178e8)',
                }}
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default StatsCards;
