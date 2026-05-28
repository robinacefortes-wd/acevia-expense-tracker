import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { PieChart as PieChartIcon, UtensilsCrossed, Car, Gamepad2, ShoppingBag, Heart, MoreHorizontal } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { Transaction } from '@/types/index';

interface SpendingCategoriesProps {
  transactions: Transaction[];
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface TooltipPayloadItem {
  value?: number;
  name?: string;
  payload?: CategoryData;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  totalSpent: number;
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

const CustomTooltip = ({ active, payload, totalSpent }: CustomTooltipProps) => {
  if (active && payload && payload.length > 0) {
    const value = payload[0].value ?? 0;
    const percentage = totalSpent > 0 ? ((value / totalSpent) * 100).toFixed(1) : '0.0';
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

const SpendingCategories = ({ transactions }: SpendingCategoriesProps) => {
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce<Record<string, number>>((acc, t) => {
      const category = t.category;
      if (!acc[category]) acc[category] = 0;
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

  return (
    <motion.div
      data-testid="spending-categories"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="rounded-2xl p-4 sm:p-6 card-glass"
    >
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-semibold theme-text mb-1">Spending Categories</h3>
        <p className="theme-text-secondary text-xs sm:text-sm">Breakdown of your expenses</p>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16">
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(129, 81, 217, 0.2) 0%, rgba(161, 120, 232, 0.2) 100%)',
            }}
          >
            <PieChartIcon className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: '#8151d9' }} />
          </div>
          <h4 className="theme-text text-base sm:text-lg font-semibold mb-2">No expenses yet</h4>
          <p className="theme-text-secondary text-xs sm:text-sm text-center max-w-sm">
            Your spending breakdown will appear here once you add expenses.
          </p>
        </div>
      ) : (
        <>
          {/* Donut chart — fixed height, no built-in legend */}
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => (
                  <CustomTooltip
                    active={active}
                    payload={payload as TooltipPayloadItem[] | undefined}
                    totalSpent={totalSpent}
                  />
                )}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Custom legend — fully outside the chart, no overlap */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-4">
            {chartData.map((entry) => {
              const percentage = totalSpent > 0
                ? ((entry.value / totalSpent) * 100).toFixed(0)
                : '0';
              const IconComponent = ICONS[entry.name] || MoreHorizontal;
              return (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-3 h-3" style={{ color: entry.color }} />
                  </div>
                  <span className="theme-text-secondary text-xs sm:text-sm whitespace-nowrap">
                    {entry.name} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="mt-4 pt-4 border-t theme-border text-center">
            <span className="theme-text-secondary text-xs sm:text-sm">Total Spent: </span>
            <span className="theme-text font-bold text-base sm:text-lg">
              ₱{totalSpent.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default SpendingCategories;