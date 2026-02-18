import { useState } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Car, Gamepad2, ShoppingBag, Heart, MoreHorizontal, Pencil, Trash2, LucideIcon } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import { Transaction, Budget } from '@/types/index';

interface BudgetManagementProps {
  transactions: Transaction[];
  budgets: Budget[];
  onEditBudget: (budgetData: Budget) => void;
  onDeleteBudget: (budget: Budget) => void;
}

interface BudgetWithDisplay extends Budget {
  spent: number;
  icon: LucideIcon;
  color: string;
}

interface EditForm {
  category: string;
  limit: string;
  period: 'today' | 'week' | 'month' | 'year';
}

const ICONS: Record<string, LucideIcon> = {
  Food: UtensilsCrossed,
  Transport: Car,
  Entertainment: Gamepad2,
  Shopping: ShoppingBag,
  Healthcare: Heart,
  Other: MoreHorizontal
};

const COLORS: Record<string, string> = {
  Food: '#10b981',
  Transport: '#3b82f6',
  Entertainment: '#f59e0b',
  Shopping: '#ec4899',
  Healthcare: '#8b5cf6',
  Other: '#6b7280'
};

const BudgetManagement = ({ transactions, budgets, onEditBudget, onDeleteBudget }: BudgetManagementProps) => {
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ category: '', limit: '', period: 'month' });

  const calculateSpent = (category: string): number => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
  };

  const budgetList: BudgetWithDisplay[] = budgets.map(budget => ({
    ...budget,
    spent: calculateSpent(budget.category),
    icon: ICONS[budget.category] || MoreHorizontal,
    color: COLORS[budget.category] || COLORS.Other
  }));

  const totalBudgeted = budgetList.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgetList.reduce((sum, b) => sum + b.spent, 0);

  const handleEditClick = (budget: Budget): void => {
    setEditForm({
      category: budget.category,
      limit: budget.limit.toString(),
      period: budget.period || 'month'
    });
    setEditingBudget(budget);
  };

  const handleSaveEdit = (): void => {
      if (editingBudget && editForm.limit && parseFloat(editForm.limit) > 0) {
          onEditBudget({
              ...editingBudget, 
              limit: parseFloat(editForm.limit),
              period: editForm.period
          });
          setEditingBudget(null); 
      }
  };

  const periodLabels: Record<string, string> = {
    today: 'Today',
    week: 'This Week',
    month: 'This Month',
    year: 'This Year'
  };

  return (
    <>
      <motion.div
        data-testid="budget-management"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="rounded-2xl p-6 card-glass"
        style={{ minHeight: '500px' }}
      >
        <h3 className="text-xl font-semibold theme-text mb-6">Budget Management</h3>
        
        {budgetList.length === 0 ? (
          <div className="flex flex-col items-center justify-center" style={{ height: '280px' }}>
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ 
                background: 'linear-gradient(135deg, rgba(129, 81, 217, 0.2) 0%, rgba(161, 120, 232, 0.2) 100%)',
              }}
            >
              <MoreHorizontal className="w-10 h-10" style={{ color: '#8151d9' }} />
            </div>
            <h4 className="theme-text text-lg font-semibold mb-2">No budgets yet</h4>
            <p className="theme-text-secondary text-sm text-center max-w-sm">
              Create your first budget using the + button below to start tracking your spending limits.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {budgetList.map((budget, index) => {
              const percentage = (budget.spent / budget.limit) * 100;
              const isOverBudget = percentage > 100;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${budget.color}20` }}
                      >
                        <budget.icon className="w-5 h-5" style={{ color: budget.color }} />
                      </div>
                      <div>
                        <p className="theme-text font-medium">{budget.category}</p>
                        <p className="theme-text-secondary text-xs">
                          {periodLabels[budget.period || 'month']} • {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span 
                        className="text-sm font-semibold"
                        style={{ color: isOverBudget ? '#ef4444' : budget.color }}
                      >
                        {percentage.toFixed(0)}%
                      </span>
                      <button
                        onClick={() => handleEditClick(budget)}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                        title="Edit Budget"
                      >
                        <Pencil className="w-4 h-4 theme-text-secondary" />
                      </button>
                      <button
                        onClick={() => onDeleteBudget(budget)} // Ensure this is the whole budget object
                        className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="relative w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percentage, 100)}%` }}
                      transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                      className="h-full rounded-full"
                      style={{ 
                        backgroundColor: isOverBudget ? '#ef4444' : budget.color,
                        boxShadow: `0 0 10px ${isOverBudget ? '#ef4444' : budget.color}50`
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Budget Summary */}
        {budgetList.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-6 pt-6 border-t theme-border"
          >
            <div className="flex items-center justify-between">
              <span className="theme-text-secondary text-sm">Total Budgeted</span>
              <span className="theme-text font-semibold">
                {formatCurrency(totalBudgeted)}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="theme-text-secondary text-sm">Total Spent</span>
              <span className="theme-text font-semibold">
                {formatCurrency(totalSpent)}
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Edit Budget Modal */}
      {editingBudget && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          onClick={() => setEditingBudget(null)}
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
            <h3 className="text-xl font-bold text-white mb-4">Edit Budget: {editForm.category}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">
                  Budget Period
                </label>
                <select
                  value={editForm.period}
                  onChange={(e) => setEditForm({ ...editForm, period: e.target.value as 'today' | 'week' | 'month' | 'year' })}
                  className="w-full px-4 py-3 rounded-lg border text-white focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <option value="today" style={{ backgroundColor: '#1a1a1a' }}>Today</option>
                  <option value="week" style={{ backgroundColor: '#1a1a1a' }}>This Week</option>
                  <option value="month" style={{ backgroundColor: '#1a1a1a' }}>This Month</option>
                  <option value="year" style={{ backgroundColor: '#1a1a1a' }}>This Year</option>
                </select>
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">
                  Budget Limit (₱)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.limit}
                  onChange={(e) => setEditForm({ ...editForm, limit: e.target.value })}
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
                  onClick={() => setEditingBudget(null)}
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


export default BudgetManagement;