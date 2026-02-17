import { motion } from 'framer-motion';
import { router } from '@inertiajs/react'; 
import { Receipt } from 'lucide-react';

import { Badge } from '@/components/ui/badge'; 
import { formatCurrency } from '@/utils/formatCurrency';
import { Transaction } from '@/types/index';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions = ({ transactions = [] }: RecentTransactionsProps) => {
  const isEmpty = transactions.length === 0;

  // Optimized sorting for Backend Data: 
  // We handle potential null times and ensure dates are parsed correctly
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateTimeA = new Date(`${a.date}T${a.time || '00:00:00'}`);
    const dateTimeB = new Date(`${b.date}T${b.time || '00:00:00'}`);
    return dateTimeB.getTime() - dateTimeA.getTime();
  });

  return (
    <motion.div
      data-testid="recent-transactions"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="rounded-2xl p-6 card-glass"
      style={{ minHeight: '500px' }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold theme-text">Recent Transactions</h3>
        <button 
          onClick={() => router.visit('/transactions')}
          className="text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ color: '#8151d9' }}
        >
          View All
        </button>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ 
              background: 'linear-gradient(135deg, rgba(129, 81, 217, 0.2) 0%, rgba(161, 120, 232, 0.2) 100%)',
            }}
          >
            <Receipt className="w-10 h-10" style={{ color: '#8151d9' }} />
          </div>
          <h4 className="theme-text text-lg font-semibold mb-2">No transactions yet</h4>
          <p className="theme-text-secondary text-sm text-center max-w-sm">
            Your recent transactions will appear here. Add your first transaction to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b theme-border">
                <th className="text-left py-3 px-4 theme-text-secondary font-medium text-sm">Date</th>
                <th className="text-left py-3 px-4 theme-text-secondary font-medium text-sm">Category</th>
                <th className="text-left py-3 px-4 theme-text-secondary font-medium text-sm">Note</th>
                <th className="text-right py-3 px-4 theme-text-secondary font-medium text-sm">Amount</th>
                <th className="text-center py-3 px-4 theme-text-secondary font-medium text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {/* We show the top 8 recent items for a fuller dashboard feel */}
              {sortedTransactions.slice(0, 8).map((transaction, index) => (
                <motion.tr
                  key={transaction.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b theme-border-light hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4 theme-text-secondary text-sm">
                    {new Date(transaction.date).toLocaleDateString('en-PH', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="py-4 px-4">
                    <span className="theme-text font-medium">{transaction.category}</span>
                  </td>
                  <td className="py-4 px-4 theme-text-secondary text-sm truncate max-w-[150px]">
                    {transaction.note || '-'}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span 
                      className="font-semibold"
                      style={{ 
                        color: transaction.type === 'expense' ? '#ef4444' : '#10b981' 
                      }}
                    >
                      {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Badge 
                      variant="outline" 
                      className="border-0 capitalize"
                      style={{
                        backgroundColor: transaction.type === 'expense' 
                          ? 'rgba(239, 68, 68, 0.1)' 
                          : 'rgba(16, 185, 129, 0.1)',
                        color: transaction.type === 'expense' ? '#ef4444' : '#10b981'
                      }}
                    >
                      {transaction.type}
                    </Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default RecentTransactions;