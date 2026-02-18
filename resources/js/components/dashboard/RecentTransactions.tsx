import { motion } from 'framer-motion';
import { router, Link} from '@inertiajs/react';
import { Receipt, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatCurrency';
import { Transaction } from '@/types/index';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transaction: Transaction) => void;
}

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Healthcare', 'Other'];

const RecentTransactions = ({
  transactions = [],
  onEditTransaction,
  onDeleteTransaction,
}: RecentTransactionsProps) => {
  const isEmpty = transactions.length === 0;

  // --- MODAL STATE ---
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [editForm, setEditForm] = useState({
    amount: '',
    category: '',
    date: '',
    note: '',
    type: 'expense'
  });

  // --- HANDLERS ---
  const handleEditClick = (tx: Transaction) => {
    setEditForm({
      amount: tx.amount.toString(),
      category: tx.category,
      date: tx.date,
      note: tx.note || '',
      type: tx.type
    });
    setEditingTx(tx);
  };

  const handleSaveEdit = () => {
    if (editingTx) {
      onEditTransaction({
        ...editingTx,
        amount: parseFloat(editForm.amount),
        category: editForm.category,
        date: editForm.date,
        note: editForm.note,
        type: editForm.type as 'income' | 'expense'
      });
      setEditingTx(null);
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateTimeA = new Date(`${a.date}T${a.time || '00:00:00'}`);
    const dateTimeB = new Date(`${b.date}T${b.time || '00:00:00'}`);
    return dateTimeB.getTime() - dateTimeA.getTime();
  });

  return (
    <>
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
          {/* Change <a> to Inertia <Link> */}
        <Link href="/transactions" className="text-sm font-medium" style={{ color: '#8151d9' }}>
          View All
        </Link>
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
                  <th className="text-right py-3 px-4 theme-text-secondary font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
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
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(transaction)}
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <Pencil className="w-4 h-4 theme-text-secondary" />
                        </button>
                        <button
                          onClick={() => onDeleteTransaction(transaction)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* --- EDIT TRANSACTION MODAL --- */}
      {editingTx && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          onClick={() => setEditingTx(null)}
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
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Edit Transaction</h3>
              {/* Subtle indicator of type */}
              <span 
                className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded"
                style={{ 
                  backgroundColor: editForm.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: editForm.type === 'income' ? '#10b981' : '#ef4444'
                }}
              >
                {editForm.type}
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">
                  Amount (₱)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border text-white focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all text-lg"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border text-white focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all cursor-pointer"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <option value="" disabled style={{ backgroundColor: '#1a1a1a', color: '#6b7280' }}>
                      Select category
                    </option>
                    
                    {/* DYNAMIC CATEGORY FILTERING */}
                    {(editForm.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                      <option key={cat} value={cat} style={{ backgroundColor: '#1a1a1a' }}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">Date</label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border text-white focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">Note (Optional)</label>
                <input
                  type="text"
                  value={editForm.note}
                  onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border text-white focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setEditingTx(null)}
                  className="flex-1 px-4 py-3 rounded-lg border font-medium transition-colors hover:bg-white/5"
                  style={{ borderColor: 'rgba(255, 255, 255, 0.1)', color: '#9ca3af' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #8151d9 0%, #a178e8 100%)' }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default RecentTransactions;