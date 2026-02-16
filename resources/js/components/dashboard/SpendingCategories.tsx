import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PieChart as PieChartIcon, UtensilsCrossed, Car, Gamepad2, ShoppingBag, Heart, MoreHorizontal, LucideIcon } from 'lucide-react';
import { Transaction } from '@/types/index';

interface SpendingCategoriesProps {
  transactions: Transaction[];
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

// Custom tooltip props interface
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number;
    name?: string;
    payload?: CategoryData;
  }>;
}

// Custom legend props interface
interface LegendPayloadItem {
  value: string;
  color: string;
  payload: CategoryData;
}

interface CustomLegendProps {
  payload?: LegendPayloadItem[];
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

const SpendingCategories = ({ transactions }: SpendingCategoriesProps) => {
  // Calculate spending by category
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce<Record<string, number>>((acc, t) => {
      const category = t.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += parseFloat(t.amount.toString());
      return acc;
    }, {});

  const chartData: CategoryData[] = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
    color: COLORS[name] || COLORS.Other
  }));

  const isEmpty = chartData.length === 0;
  const totalSpent = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length > 0) {
      const value = payload[0].value || 0;
      const percentage = ((value / totalSpent) * 100).toFixed(1);
      return (
        <div 
          className="px-4 py-3 rounded-xl"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(129, 81, 217, 0.3)'
          }}
        >
          <p className="text-gray-300 text-sm mb-1">{payload[0].name}</p>
          <p className="text-white font-semibold">
            ₱{value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-gray-400 text-xs mt-1">{percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = ({ payload }: CustomLegendProps) => {
    if (!payload) return null;

    return (
      <div className="flex flex-wrap gap-3 justify-center mt-4">
        {payload.map((entry, index) => {
          const percentage = ((entry.payload.value / totalSpent) * 100).toFixed(0);
          const IconComponent = ICONS[entry.value] || MoreHorizontal;
          return (
            <div key={`legend-${index}`} className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${entry.color}30` }}
              >
                <IconComponent className="w-3.5 h-3.5" style={{ color: entry.color }} />
              </div>
              <span className="theme-text-secondary text-sm">
                {entry.value} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      data-testid="spending-categories"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="rounded-2xl p-6 card-glass"
      style={{ minHeight: '500px' }}
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold theme-text mb-1">Spending Categories</h3>
        <p className="theme-text-secondary text-sm">Breakdown of your expenses</p>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center" style={{ height: '320px' }}>
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
            style={{ 
              background: 'linear-gradient(135deg, rgba(129, 81, 217, 0.2) 0%, rgba(161, 120, 232, 0.2) 100%)',
            }}
          >
            <PieChartIcon className="w-12 h-12" style={{ color: '#8151d9' }} />
          </div>
          <h4 className="theme-text text-lg font-semibold mb-2">No expenses yet</h4>
          <p className="theme-text-secondary text-sm text-center max-w-sm">
            Your spending breakdown will appear here once you add expenses.
          </p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderLegend as any} />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="mt-4 pt-4 border-t theme-border text-center">
            <span className="theme-text-secondary text-sm">Total Spent: </span>
            <span className="theme-text font-bold text-lg">
              ₱{totalSpent.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default SpendingCategories;