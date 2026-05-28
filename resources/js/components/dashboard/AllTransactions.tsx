import { router, usePage, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, ChevronLeft, ChevronRight, Download, Pencil, Trash2, TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import { useState } from 'react';

import DeleteConfirmModal from '@/components/dashboard/DeleteConfirmModal';
import MiniCalculator from '@/components/dashboard/MiniCalculator';
import Sidebar from '@/components/dashboard/Sidebar';
import { useToast } from '@/components/dashboard/ToastContext';
import { Badge } from '@/components/ui/badge';
import type { Transaction } from '@/types/index';
import { formatCurrency } from '@/utils/formatCurrency';

const ITEMS_PER_PAGE = 10;
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Healthcare', 'Other'];

const AllTransactions = () => {
  const { transactions = [], totalSavings = 0 } = usePage<{ transactions: Transaction[]; totalSavings: number }>().props;
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);
  const [editForm, setEditForm] = useState({
    amount: '',
    category: '',
    date: '',
    note: '',
    type: 'expense' as 'income' | 'expense'
  });

  // --- MONTHS ---
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

  // --- FILTER + SORT ---
  const processedTransactions = [...transactions]
    .filter(t => {
      const matchesSearch =
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.note && t.note.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filterType === 'all' || t.type === filterType;
      let matchesMonth = true;
      if (filterMonth !== 'all') {
        const transDate = new Date(t.date);
        const transMonthYear = `${transDate.getFullYear()}-${String(transDate.getMonth() + 1).padStart(2, '0')}`;
        matchesMonth = transMonthYear === filterMonth;
      }
      return matchesSearch && matchesFilter && matchesMonth;
    })
    .sort((a, b) => {
      const valA = new Date(a.date + (a.time ? 'T' + a.time : ''));
      const valB = new Date(b.date + (b.time ? 'T' + b.time : ''));
      return valB.getTime() - valA.getTime();
    });

  // --- SUMMARY ---
  const totalIncome = processedTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(String(t.amount)), 0);
  const totalExpenses = processedTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(String(t.amount)), 0);
  const netBalance = totalIncome - totalExpenses;

  // --- PAGINATION ---
  const totalPages = Math.ceil(processedTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTransactions = processedTransactions.slice(startIndex, endIndex);

  const handleFilterChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) => (value: T): void => {
    setter(value);
    setCurrentPage(1);
  };

  // --- EDIT ---
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
        onSuccess: () => {
          showToast('Transaction updated successfully!');
          setEditingTx(null);
        },
        onError: () => showToast('Failed to update transaction.', 'error'),
      });
    }
  };

  // --- DELETE ---
  const handleDeleteConfirm = () => {
    if (deletingTx) {
      router.post('/transactions/delete', { id: deletingTx.id }, {
        onSuccess: () => showToast('Transaction deleted.'),
        onError: () => showToast('Failed to delete transaction.', 'error'),
      });
      setDeletingTx(null);
    }
  };

  // --- CSV EXPORT ---
  const handleExportCSV = () => {
    try {
      const headers = ['Date', 'Category', 'Note', 'Amount', 'Type'];
      const rows = processedTransactions.map(t => [
        new Date(t.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }),
        t.category,
        t.note || '',
        t.type === 'expense' ? `-${t.amount}` : `${t.amount}`,
        t.type
      ]);
      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transactions-${filterMonth !== 'all' ? filterMonth : 'all'}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      showToast('Transactions exported successfully!');
    } catch {
      showToast('Failed to export transactions.', 'error');
    }
  };

  return (
    <div className="flex min-h-screen theme-bg">
      <Head title="Records" />
      <Sidebar />

      {/* main — sidebar is 72px on md+, full-width on mobile */}
      <main className="flex-1 overflow-auto pl-[72px] md:pl-0 md:ml-[72px]">
        <div className="p-4 sm:p-6 lg:p-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            <button
              onClick={() => router.visit('/dashboard')}
              className="flex items-center gap-2 theme-text-secondary hover:theme-text mb-4 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Back to Dashboard</span>
            </button>

            {/* Title row — stacks on very small screens */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold theme-text mb-1">Records</h1>
                <p className="theme-text-secondary text-xs sm:text-sm">View and manage all your transactions</p>
              </div>
              <button
                onClick={handleExportCSV}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all hover:opacity-90 cursor-pointer w-full sm:w-auto"
                style={{ background: 'linear-gradient(135deg, #8151d9 0%, #a178e8 100%)', color: '#fff' }}
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </motion.div>

          {/* Summary Bar — 2 cols on mobile, 4 on lg+ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="grid grid-cols-1 gap-3 sm:gap-4 mb-5 sm:mb-6 lg:grid-cols-4"
          >
            {/* Total Income */}
            <div className="card-glass rounded-2xl p-4 sm:p-5 flex items-center gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#10b981' }} />
              </div>
              <div className="min-w-0">
                <p className="theme-text-secondary text-xs font-medium mb-0.5">
                  Income
                  {filterType === 'expense' && <span className="ml-1 opacity-50">(filtered)</span>}
                </p>
                <p className="text-xl sm:text-2xl font-bold" style={{ color: '#10b981' }}>
                  +{formatCurrency(totalIncome)}
                </p>
              </div>
            </div>

            {/* Total Expenses */}
            <div className="card-glass rounded-2xl p-4 sm:p-5 flex items-center gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#ef4444' }} />
              </div>
              <div className="min-w-0">
                <p className="theme-text-secondary text-xs font-medium mb-0.5">Expenses</p>
                <p className="text-xl sm:text-2xl font-bold" style={{ color: '#ef4444' }}>
                  -{formatCurrency(totalExpenses)}
                </p>
              </div>
            </div>

            {/* Net Balance */}
            <div className="card-glass rounded-2xl p-4 sm:p-5 flex items-center gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: netBalance >= 0 ? '#8151d9' : '#f59e0b' }} />
              </div>
              <div className="min-w-0">
                <p className="theme-text-secondary text-xs font-medium mb-0.5">Net Balance</p>
                <p className="text-xl sm:text-2xl font-bold" style={{ color: netBalance >= 0 ? '#8151d9' : '#f59e0b' }}>
                  {netBalance >= 0 ? '+' : ''}{formatCurrency(netBalance)}
                </p>
              </div>
            </div>

            {/* Total Savings */}
            <div className="card-glass rounded-2xl p-4 sm:p-5 flex items-center gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                <PiggyBank className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#06b6d4' }} />
              </div>
              <div className="min-w-0">
                <p className="theme-text-secondary text-xs font-medium mb-0.5">Savings</p>
                <p className="text-xl sm:text-2xl font-bold" style={{ color: '#06b6d4' }}>
                  +{formatCurrency(totalSavings)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Table Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card-glass rounded-2xl p-4 sm:p-6"
          >
            {/* Filter Bar — wraps naturally on mobile */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 mb-5 sm:mb-6">

              {/* Count label */}
              <h3 className="text-base sm:text-xl font-semibold theme-text shrink-0">
                {processedTransactions.length} Transaction{processedTransactions.length !== 1 ? 's' : ''}
                {filterMonth !== 'all' && (
                  <span className="hidden sm:inline"> in {getMonthLabel(filterMonth)}</span>
                )}
              </h3>

              {/* Search — full width on mobile */}
              <div className="relative w-full sm:w-56 lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 theme-text-secondary" />
                <input
                  type="text"
                  placeholder="Search category or note..."
                  value={searchTerm}
                  onChange={(e) => handleFilterChange(setSearchTerm)(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border theme-input"
                />
              </div>

              {/* Type filter + month — row on all sizes, wraps if needed */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex gap-1">
                  {(['all', 'income', 'expense'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => handleFilterChange(setFilterType)(type)}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors capitalize cursor-pointer ${
                        filterType === type
                          ? type === 'all' ? 'bg-purple-500/20 text-purple-500'
                          : type === 'income' ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                          : 'theme-text-secondary hover:theme-text'
                      }`}
                    >
                      {type === 'all' ? 'All' : type === 'income' ? 'Income' : 'Expenses'}
                    </button>
                  ))}
                </div>

                <select
                  value={filterMonth}
                  onChange={(e) => handleFilterChange(setFilterMonth)(e.target.value)}
                  className="flex-1 sm:flex-none sm:w-40 px-3 py-1.5 text-xs sm:text-sm rounded-lg border theme-input
                            bg-white text-gray-900 border-gray-200
                            dark:bg-slate-900 dark:text-white dark:border-white/10
                            focus:outline-none transition-colors cursor-pointer"
                  style={{ colorScheme: 'inherit' }}
                >
                  <option value="all" className="bg-white text-gray-900 dark:bg-[#1a1a1a] dark:text-white">All Months</option>
                  {availableMonths.map((month) => (
                    <option key={month} value={month} className="bg-white text-gray-900 dark:bg-[#1a1a1a] dark:text-white">
                      {getMonthLabel(month)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {processedTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(129, 81, 217, 0.1)' }}>
                  <Search className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: '#8151d9' }} />
                </div>
                <p className="theme-text font-medium mb-1 text-sm sm:text-base">No transactions found</p>
                <p className="theme-text-secondary text-xs sm:text-sm text-center">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <>
                {/* TABLE — hidden on mobile */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b theme-border">
                        <th className="text-left py-3 px-4 theme-text-secondary font-medium text-sm">Date</th>
                        <th className="text-left py-3 px-4 theme-text-secondary font-medium text-sm">Category</th>
                        <th className="text-left py-3 px-4 theme-text-secondary font-medium text-sm">Note</th>
                        <th className="text-right py-3 px-4 theme-text-secondary font-medium text-sm">Amount</th>
                        <th className="text-center py-3 px-4 theme-text-secondary font-medium text-sm">Type</th>
                        <th className="text-right py-3 px-4 theme-text-secondary font-medium text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTransactions.reduce((acc, transaction, index) => {
                        const transDate = new Date(transaction.date);
                        const monthYear = `${transDate.getFullYear()}-${String(transDate.getMonth() + 1).padStart(2, '0')}`;
                        const prevTx = paginatedTransactions[index - 1];
                        const prevMonthYear = prevTx
                          ? (() => { const d = new Date(prevTx.date); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; })()
                          : null;

                        if (monthYear !== prevMonthYear) {
                          acc.push(
                            <tr key={`month-${monthYear}`}>
                              <td colSpan={6} className="pt-6 pb-2 px-4">
                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#8151d9' }}>
                                    {getMonthLabel(monthYear)}
                                  </span>
                                  <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(129, 81, 217, 0.2)' }} />
                                </div>
                              </td>
                            </tr>
                          );
                        }

                        acc.push(
                          <motion.tr
                            key={transaction.id || index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.02 }}
                            className="border-b theme-border-light hover:bg-white/5 transition-colors"
                          >
                            <td className="py-4 px-4 theme-text-secondary text-sm">
                              {new Date(transaction.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="py-4 px-4">
                              <span className="theme-text font-medium">{transaction.category}</span>
                            </td>
                            <td className="py-4 px-4 theme-text-secondary text-sm">{transaction.note || '-'}</td>
                            <td className="py-4 px-4 text-right">
                              <span className="font-semibold" style={{ color: transaction.type === 'expense' ? '#ef4444' : '#10b981' }}>
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
                                <button onClick={() => handleEditClick(transaction)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                                  <Pencil className="w-4 h-4 theme-text-secondary" />
                                </button>
                                <button onClick={() => setDeletingTx(transaction)} className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer">
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );

                        return acc;
                      }, [] as React.ReactNode[])}
                    </tbody>
                  </table>
                </div>

                {/* CARD LIST — shown on mobile only */}
                <div className="md:hidden flex flex-col gap-2">
                  {paginatedTransactions.reduce((acc, transaction, index) => {
                    const transDate = new Date(transaction.date);
                    const monthYear = `${transDate.getFullYear()}-${String(transDate.getMonth() + 1).padStart(2, '0')}`;
                    const prevTx = paginatedTransactions[index - 1];
                    const prevMonthYear = prevTx
                      ? (() => { const d = new Date(prevTx.date); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; })()
                      : null;

                    if (monthYear !== prevMonthYear) {
                      acc.push(
                        <div key={`month-mobile-${monthYear}`} className="flex items-center gap-3 pt-4 pb-1">
                          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#8151d9' }}>
                            {getMonthLabel(monthYear)}
                          </span>
                          <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(129, 81, 217, 0.2)' }} />
                        </div>
                      );
                    }

                    acc.push(
                      <motion.div
                        key={`mobile-${transaction.id || index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                        className="flex items-center justify-between rounded-xl px-4 py-3 border theme-border-light hover:bg-white/5 transition-colors"
                        style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                      >
                        {/* Left: category + date + note */}
                        <div className="flex flex-col gap-0.5 min-w-0 mr-3">
                          <span className="theme-text font-medium text-sm truncate">{transaction.category}</span>
                          <span className="theme-text-secondary text-xs">
                            {new Date(transaction.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          {transaction.note && (
                            <span className="theme-text-secondary text-xs truncate opacity-70">{transaction.note}</span>
                          )}
                        </div>

                        {/* Right: amount + badge + actions */}
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <span className="font-semibold text-sm" style={{ color: transaction.type === 'expense' ? '#ef4444' : '#10b981' }}>
                            {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <Badge className={`text-xs ${transaction.type === 'expense' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                              {transaction.type === 'expense' ? 'Exp' : 'Inc'}
                            </Badge>
                            <button onClick={() => handleEditClick(transaction)} className="p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                              <Pencil className="w-3.5 h-3.5 theme-text-secondary" />
                            </button>
                            <button onClick={() => setDeletingTx(transaction)} className="p-1 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer">
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );

                    return acc;
                  }, [] as React.ReactNode[])}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-center mt-5 sm:mt-6 pt-5 sm:pt-6 border-t theme-border gap-3">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 border theme-border rounded-lg disabled:opacity-50 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="theme-text-secondary text-sm">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 border theme-border rounded-lg disabled:opacity-50 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <span className="theme-text-secondary text-xs sm:text-sm">
                      {startIndex + 1}–{Math.min(endIndex, processedTransactions.length)} of {processedTransactions.length}
                    </span>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </main>

      {/* Edit Modal */}
      {editingTx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} onClick={() => setEditingTx(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl p-5 sm:p-6"
            style={{ background: 'rgba(20, 20, 20, 0.98)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-white">Edit Transaction</h3>
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded" style={{ backgroundColor: editForm.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: editForm.type === 'income' ? '#10b981' : '#ef4444' }}>
                {editForm.type}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">Amount (₱)</label>
                <input type="number" step="0.01" value={editForm.amount} onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })} className="w-full px-4 py-3 rounded-lg border text-white focus:outline-none transition-all text-base sm:text-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              </div>

              {/* Category + Date — stacked on mobile, side by side on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">Category</label>
                  <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="w-full px-4 py-3 rounded-lg border text-white focus:outline-none transition-all cursor-pointer" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)', colorScheme: 'dark' }}>
                    {(editForm.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                      <option key={cat} value={cat} style={{ backgroundColor: '#1a1a1a' }}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">Date</label>
                  <input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} className="w-full px-4 py-3 rounded-lg border text-white focus:outline-none transition-all cursor-pointer" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)', colorScheme: 'dark' }} />
                </div>
              </div>

              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">Note (Optional)</label>
                <input type="text" value={editForm.note} onChange={(e) => setEditForm({ ...editForm, note: e.target.value })} className="w-full px-4 py-3 rounded-lg border text-white focus:outline-none transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setEditingTx(null)} className="flex-1 px-4 py-3 rounded-lg border font-medium transition-colors hover:bg-white/5 cursor-pointer text-sm sm:text-base" style={{ borderColor: 'rgba(255, 255, 255, 0.1)', color: '#9ca3af' }}>Cancel</button>
                <button onClick={handleSaveEdit} className="flex-1 px-4 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90 cursor-pointer text-sm sm:text-base" style={{ background: 'linear-gradient(135deg, #8151d9 0%, #a178e8 100%)' }}>Save Changes</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingTx}
        title="Delete Transaction"
        description={`Are you sure you want to delete this ${deletingTx?.type} of ${deletingTx ? formatCurrency(deletingTx.amount) : ''}? This cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingTx(null)}
      />

      <MiniCalculator buttonBottom="bottom-8" panelBottom="bottom-28" />
    </div>
  );
};

export default AllTransactions;