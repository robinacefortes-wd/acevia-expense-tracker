import { useState, FormEvent, ChangeEvent } from 'react';
import { X, TrendingUp, TrendingDown, Clock, PiggyBank, Target } from 'lucide-react';
import { Transaction, Budget, SavingsData } from '@/types/index';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Transaction) => void;
  onAddSavings: (savingsData: SavingsData) => void;
  onCreateBudget: (budgetData: Budget) => void;
}

interface FormData {
  amount: string;
  category: string;
  date: string;
  time: string;
  note: string;
}

interface BudgetFormData {
  category: string;
  limit: string;
  period: 'today' | 'week' | 'month' | 'year';
}

type TabType = 'expense' | 'income' | 'savings' | 'budget';

const QuickActionModal = ({ isOpen, onClose, onAddTransaction, onAddSavings, onCreateBudget }: QuickActionModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('expense');
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    note: ''
  });

  const [budgetData, setBudgetData] = useState<BudgetFormData>({
    category: '',
    limit: '',
    period: 'month'
  });

  const categories: Record<'expense' | 'income', string[]> = {
    expense: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Healthcare', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
  };

  const budgetCategories: string[] = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Healthcare', 'Other'];

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    if (activeTab === 'savings') {
      if (formData.amount) {
        onAddSavings({
          amount: parseFloat(formData.amount),
          note: formData.note,
          date: formData.date
        });
        resetForm();
      }
    } else if (activeTab === 'budget') {
      if (budgetData.category && budgetData.limit) {
        onCreateBudget({
          category: budgetData.category,
          limit: parseFloat(budgetData.limit),
          period: budgetData.period
        });
        setBudgetData({ category: '', limit: '', period: 'month' });
      }
    } else {
      if (formData.amount && formData.category) {
        onAddTransaction({
          ...formData,
          type: activeTab as 'income' | 'expense',
          id: Date.now(),
          time: activeTab === 'expense' ? formData.time : undefined
        });
        resetForm();
      }
    }
  };

  const resetForm = (): void => {
    setFormData({
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      note: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(20, 20, 20, 0.98)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Quick Action</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          {/* Tabs */}
          <div 
            className="grid grid-cols-4 gap-2 p-1.5 rounded-xl mb-8"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          >
            <button
              data-testid="tab-expense"
              type="button"
              onClick={() => setActiveTab('expense')}
              className={`flex flex-col items-center justify-center gap-2 px-3 py-3 rounded-lg transition-all ${
                activeTab === 'expense' 
                  ? 'bg-red-500/20 text-red-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <TrendingDown className="w-5 h-5" />
              <span className="text-xs font-medium">Expense</span>
            </button>
            <button
              data-testid="tab-income"
              type="button"
              onClick={() => setActiveTab('income')}
              className={`flex flex-col items-center justify-center gap-2 px-3 py-3 rounded-lg transition-all ${
                activeTab === 'income' 
                  ? 'bg-green-500/20 text-green-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs font-medium">Income</span>
            </button>
            <button
              data-testid="tab-savings"
              type="button"
              onClick={() => setActiveTab('savings')}
              className={`flex flex-col items-center justify-center gap-2 px-3 py-3 rounded-lg transition-all ${
                activeTab === 'savings' 
                  ? 'bg-purple-500/20 text-purple-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <PiggyBank className="w-5 h-5" />
              <span className="text-xs font-medium">Savings</span>
            </button>
            <button
              data-testid="tab-budget"
              type="button"
              onClick={() => setActiveTab('budget')}
              className={`flex flex-col items-center justify-center gap-2 px-3 py-3 rounded-lg transition-all ${
                activeTab === 'budget' 
                  ? 'bg-blue-500/20 text-blue-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Target className="w-5 h-5" />
              <span className="text-xs font-medium">Budget</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {activeTab === 'budget' ? (
              // Budget Creation Form
              <>
                <div className="space-y-2">
                  <label htmlFor="budget-category" className="text-gray-300 text-sm font-medium">
                    Category
                  </label>
                  <select
                    id="budget-category"
                    value={budgetData.category}
                    onChange={(e) => setBudgetData({ ...budgetData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border text-white focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                    required
                  >
                    <option value="" disabled>Select category</option>
                    {budgetCategories.map((cat) => (
                      <option key={cat} value={cat} style={{ backgroundColor: '#1a1a1a' }}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="budget-period" className="text-gray-300 text-sm font-medium">
                    Budget Period
                  </label>
                  <select
                    id="budget-period"
                    value={budgetData.period}
                    onChange={(e) => setBudgetData({ ...budgetData, period: e.target.value as 'today' | 'week' | 'month' | 'year' })}
                    className="w-full px-4 py-3 rounded-lg border text-white focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                    required
                  >
                    <option value="today" style={{ backgroundColor: '#1a1a1a' }}>Today</option>
                    <option value="week" style={{ backgroundColor: '#1a1a1a' }}>This Week</option>
                    <option value="month" style={{ backgroundColor: '#1a1a1a' }}>This Month</option>
                    <option value="year" style={{ backgroundColor: '#1a1a1a' }}>This Year</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="budget-limit" className="text-gray-300 text-sm font-medium">
                    Budget Limit (₱)
                  </label>
                  <input
                    id="budget-limit"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={budgetData.limit}
                    onChange={(e) => setBudgetData({ ...budgetData, limit: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all text-lg"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                    required
                  />
                </div>
              </>
            ) : activeTab === 'savings' ? (
              // Savings Form
              <>
                <div className="space-y-2">
                  <label htmlFor="savings-amount" className="text-gray-300 text-sm font-medium">
                    Amount to Save (₱)
                  </label>
                  <input
                    id="savings-amount"
                    data-testid="input-savings-amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all text-lg"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="savings-date" className="text-gray-300 text-sm font-medium">
                    Date
                  </label>
                  <input
                    id="savings-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border text-white focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      colorScheme: 'dark'
                    }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="savings-note" className="text-gray-300 text-sm font-medium">
                    Note (Optional)
                  </label>
                  <textarea
                    id="savings-note"
                    placeholder="Add a note..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all resize-none"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                  />
                </div>
              </>
            ) : (
              // Expense/Income Form
              <>
                <div className="space-y-2">
                  <label htmlFor="amount" className="text-gray-300 text-sm font-medium">
                    Amount (₱)
                  </label>
                  <input
                    id="amount"
                    data-testid="input-amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all text-lg"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="text-gray-300 text-sm font-medium">
                    Category
                  </label>
                  <select
                    id="category"
                    data-testid="select-category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border text-white focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                    required
                  >
                    <option value="" disabled>Select category</option>
                    {categories[activeTab as 'expense' | 'income'].map((cat) => (
                      <option key={cat} value={cat} style={{ backgroundColor: '#1a1a1a' }}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="date" className="text-gray-300 text-sm font-medium">
                      Date
                    </label>
                    <input
                      id="date"
                      data-testid="input-date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border text-white focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        colorScheme: 'dark'
                      }}
                      required
                    />
                  </div>

                  {activeTab === 'expense' && (
                    <div className="space-y-2">
                      <label htmlFor="time" className="text-gray-300 text-sm font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Time
                      </label>
                      <input
                        id="time"
                        data-testid="input-time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border text-white focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                          colorScheme: 'dark'
                        }}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="note" className="text-gray-300 text-sm font-medium">
                    Note (Optional)
                  </label>
                  <textarea
                    id="note"
                    data-testid="input-note"
                    placeholder="Add a note..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all resize-none"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                  />
                </div>
              </>
            )}

            {/* Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 rounded-lg border font-medium transition-colors hover:bg-white/5 text-base"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#9ca3af'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                data-testid="submit-transaction"
                className="flex-1 px-6 py-4 rounded-lg font-medium text-white transition-all hover:opacity-90 text-base"
                style={{
                  background: 'linear-gradient(135deg, #8151d9 0%, #a178e8 100%)'
                }}
              >
                {activeTab === 'budget' ? 'Create Budget' : 
                 activeTab === 'savings' ? 'Add to Savings' :
                 `Add ${activeTab === 'expense' ? 'Expense' : 'Income'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuickActionModal;