import { useState } from 'react';
import { motion } from 'framer-motion';
// 1. Correct Inertia Import
import { router, usePage } from '@inertiajs/react'; 
import { ArrowLeft, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Pencil, Trash2 } from 'lucide-react'; 

import Sidebar from '@/components/dashboard/Sidebar';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatCurrency';
import { Transaction } from '@/types/index';

const ITEMS_PER_PAGE = 10;

const AllTransactions = () => {
  const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
  const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Healthcare', 'Other'];

  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [editForm, setEditForm] = useState({
    amount: '',
    category: '',
    date: '',
    note: '',
    type: 'expense' as 'income' | 'expense'
  })

  const { transactions = [] } = usePage<{ transactions: Transaction[] }>().props;
   
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Generate list of available months from transactions
  const getAvailableMonths = (): string[] => {
    const months = new Set<string>();
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthYear);
    });
    return Array.from(months).sort().reverse();
  };

  const availableMonths = getAvailableMonths();

  const getMonthLabel = (monthYear: string): string => {
    const [year, month] = monthYear.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Sort transactions by date (latest first)
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.date + (a.time ? 'T' + a.time : ''));
    const dateB = new Date(b.date + (b.time ? 'T' + b.time : ''));
    return dateB.getTime() - dateA.getTime();
  });

  // Filter transactions
  const filteredTransactions = sortedTransactions.filter(t => {
    const matchesSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (t.note && t.note.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || t.type === filterType;
    
    let matchesMonth = true;
    if (filterMonth !== 'all') {
      const transDate = new Date(t.date);
      const transMonthYear = `${transDate.getFullYear()}-${String(transDate.getMonth() + 1).padStart(2, '0')}`;
      matchesMonth = transMonthYear === filterMonth;
    }
    
    return matchesSearch && matchesFilter && matchesMonth;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handleFilterChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) => (value: T): void => {
    setter(value);
    setCurrentPage(1);
  };

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
      router.post('/transactions/update', {
        id: editingTx.id,
        amount: parseFloat(editForm.amount),
        category: editForm.category,
        date: editForm.date,
        note: editForm.note,
        type: editForm.type
      }, {
        onSuccess: () => setEditingTx(null)
      });
    }
  };

  const handleDelete = (tx: Transaction) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      router.post('/transactions/delete', { id: tx.id });
    }
  };

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
            {/* 5. Fixed Back Button to use router.visit */}
            <button
            onClick={() => router.visit('/dashboard')}
              className="flex items-center gap-2 theme-text-secondary hover:theme-text mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-4xl font-bold theme-text mb-2">Records</h1>
            <p className="theme-text-secondary">View and manage all your transactions</p>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card-glass rounded-2xl p-6 mb-6"
          >
            <div className="flex flex-col gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 theme-text-secondary" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => handleFilterChange(setSearchTerm)(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border theme-input"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFilterChange(setFilterType)('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filterType === 'all' ? 'bg-purple-500/20 text-purple-500' : 'theme-text-secondary hover:theme-text'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleFilterChange(setFilterType)('income')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filterType === 'income' ? 'bg-green-500/20 text-green-500' : 'theme-text-secondary hover:theme-text'
                    }`}
                  >
                    Income
                  </button>
                  <button
                    onClick={() => handleFilterChange(setFilterType)('expense')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filterType === 'expense' ? 'bg-red-500/20 text-red-500' : 'theme-text-secondary hover:theme-text'
                    }`}
                  >
                    Expenses
                  </button>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <select
                    value={filterMonth}
                    onChange={(e) => handleFilterChange(setFilterMonth)(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border theme-input"
                  >
                    <option value="all">All Months</option>
                    {availableMonths.map((month) => (
                      <option key={month} value={month}>
                        {getMonthLabel(month)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Table section remains mostly the same, ensuring it uses formatted state */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card-glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold theme-text">
                {filteredTransactions.length} Transaction{filteredTransactions.length !== 1 ? 's' : ''}
                {filterMonth !== 'all' && ` in ${getMonthLabel(filterMonth)}`}
              </h3>
            </div>

            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="theme-text-secondary">No transactions found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b theme-border">
                        <th className="text-left py-3 px-4 theme-text-secondary font-medium text-sm">Date & Time</th>
                        <th className="text-left py-3 px-4 theme-text-secondary font-medium text-sm">Category</th>
                        <th className="text-left py-3 px-4 theme-text-secondary font-medium text-sm">Note</th>
                        <th className="text-right py-3 px-4 theme-text-secondary font-medium text-sm">Amount</th>
                        <th className="text-center py-3 px-4 theme-text-secondary font-medium text-sm">Type</th>
                        <th className="text-right py-3 px-4 theme-text-secondary font-medium text-sm">Actions</th> 
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTransactions.map((transaction, index) => (
                        <motion.tr
                          key={transaction.id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.02 }}
                          className="border-b theme-border-light hover:bg-white/5 transition-colors"
                        >
                          <td className="py-4 px-4 theme-text-secondary text-sm">
                            <div className="font-medium">
                              {new Date(transaction.date).toLocaleDateString('en-PH', { 
                                month: 'short', day: 'numeric', year: 'numeric' 
                              })}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="theme-text font-medium">{transaction.category}</span>
                          </td>
                          <td className="py-4 px-4 theme-text-secondary text-sm">
                            {transaction.note || '-'}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span 
                              className="font-semibold"
                              style={{ color: transaction.type === 'expense' ? '#ef4444' : '#10b981' }}
                            >
                              {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Badge className={transaction.type === 'expense' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}>
                              {transaction.type === 'expense' ? 'Expense' : 'Income'}
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
                                onClick={() => handleDelete(transaction)}
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

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t theme-border">
                    <div className="theme-text-secondary text-sm">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length}
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 theme-border rounded-lg disabled:opacity-50"
                      >
                        <ChevronLeft />
                      </button>
                      <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 theme-border rounded-lg disabled:opacity-50"
                      >
                        <ChevronRight />
                      </button>
                    </div>
                  </div>
                )}

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
                          <label className="text-gray-300 text-sm font-medium mb-2 block">Amount (₱)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.amount}
                            onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border text-white focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all text-lg"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-gray-300 text-sm font-medium mb-2 block">Category</label>
                            <select
                              value={editForm.category}
                              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                              className="w-full px-4 py-3 rounded-lg border text-white focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all cursor-pointer"
                              style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                            >
                              {(editForm.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                                <option key={cat} value={cat} style={{ backgroundColor: '#1a1a1a' }}>{cat}</option>
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
                              style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
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
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
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
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AllTransactions;