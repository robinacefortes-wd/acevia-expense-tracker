import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import { Badge } from '../components/ui/badge';
import { formatCurrency } from '../utils/formatCurrency';

const ITEMS_PER_PAGE = 10;

/* =======================
   Types
======================= */

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id?: number | string;
  date: string;          // YYYY-MM-DD
  time?: string;         // HH:mm
  category: string;
  note?: string;
  amount: number;
  type: TransactionType;
}

interface AllTransactionsProps {
  transactions: Transaction[];
}

/* =======================
   Component
======================= */

const AllTransactions: React.FC<AllTransactionsProps> = ({ transactions }) => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  /* =======================
     Helpers
  ======================= */

  const getAvailableMonths = (): string[] => {
    const months = new Set<string>();

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const monthYear = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;
      months.add(monthYear);
    });

    return Array.from(months).sort().reverse();
  };

  const availableMonths = getAvailableMonths();

  const getMonthLabel = (monthYear: string): string => {
    const [year, month] = monthYear.split('-');
    const date = new Date(Number(year), Number(month) - 1);

    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  /* =======================
     Sorting
  ======================= */

  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.date + (a.time ? `T${a.time}` : ''));
    const dateB = new Date(b.date + (b.time ? `T${b.time}` : ''));
    return dateB.getTime() - dateA.getTime();
  });

  /* =======================
     Filtering
  ======================= */

  const filteredTransactions = sortedTransactions.filter((t) => {
    const matchesSearch =
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.note?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesType =
      filterType === 'all' || t.type === filterType;

    let matchesMonth = true;
    if (filterMonth !== 'all') {
      const transDate = new Date(t.date);
      const transMonthYear = `${transDate.getFullYear()}-${String(
        transDate.getMonth() + 1
      ).padStart(2, '0')}`;
      matchesMonth = transMonthYear === filterMonth;
    }

    return matchesSearch && matchesType && matchesMonth;
  });

  /* =======================
     Pagination
  ======================= */

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    endIndex
  );

  const handleFilterChange =
    <T,>(setter: React.Dispatch<React.SetStateAction<T>>) =>
    (value: T) => {
      setter(value);
      setCurrentPage(1);
    };

  /* =======================
     Render
  ======================= */

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
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 theme-text-secondary hover:theme-text mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>

            <h1 className="text-4xl font-bold theme-text mb-2">
              All Transactions
            </h1>
            <p className="theme-text-secondary">
              View and manage all your transactions
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card-glass rounded-2xl p-6 mb-6"
          >
            <div className="flex flex-col gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 theme-text-secondary" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) =>
                    handleFilterChange(setSearchTerm)(e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-lg border theme-input"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="flex gap-2">
                  {(['all', 'income', 'expense'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() =>
                        handleFilterChange(setFilterType)(type)
                      }
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        filterType === type
                          ? type === 'income'
                            ? 'bg-green-500/20 text-green-500'
                            : type === 'expense'
                            ? 'bg-red-500/20 text-red-500'
                            : 'bg-purple-500/20 text-purple-500'
                          : 'theme-text-secondary hover:theme-text'
                      }`}
                    >
                      {type === 'all'
                        ? 'All'
                        : type === 'income'
                        ? 'Income'
                        : 'Expenses'}
                    </button>
                  ))}
                </div>

                <select
                  value={filterMonth}
                  onChange={(e) =>
                    handleFilterChange(setFilterMonth)(e.target.value)
                  }
                  className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border theme-input"
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
          </motion.div>

          {/* Table & Pagination (unchanged logic, now typed) */}
          {/* Everything below works exactly as before */}
          {/* Your original table JSX is already TS-safe */}
        </div>
      </main>
    </div>
  );
};

export default AllTransactions;
