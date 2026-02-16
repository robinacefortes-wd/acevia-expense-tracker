import { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import { Transaction } from '@/types/index';

interface SmartTrackingChartProps {
  transactions: Transaction[];
}

interface ChartDataPoint {
  date: string;
  expense: number;
  income: number;
}

type TimePeriod = 'today' | '7days' | 'month' | 'year';

// Custom tooltip props interface
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number;
    payload?: ChartDataPoint;
  }>;
}

const SmartTrackingChart = ({ transactions }: SmartTrackingChartProps) => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('7days');

  const generateChartData = (): ChartDataPoint[] => {
    if (transactions.length === 0) {
      return [];
    }

    const now = new Date();
    let startDate: Date;

    switch (timePeriod) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default: // 7days
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    const filtered = transactions.filter(t => {
      const transDate = new Date(t.date);
      return transDate >= startDate;
    });

    const grouped = filtered.reduce<Record<string, ChartDataPoint>>((acc, t) => {
      let key: string;
      const transDate = new Date(t.date + (t.time ? 'T' + t.time : ''));
      
      if (timePeriod === 'today') {
        key = transDate.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
      } else if (timePeriod === 'year') {
        key = transDate.toLocaleDateString('en-PH', { month: 'short' });
      } else {
        key = transDate.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
      }
      
      if (!acc[key]) {
        acc[key] = { date: key, expense: 0, income: 0 };
      }
      if (t.type === 'expense') {
        acc[key].expense += parseFloat(t.amount.toString());
      } else {
        acc[key].income += parseFloat(t.amount.toString());
      }
      return acc;
    }, {});

    return Object.values(grouped);
  };

  const data = generateChartData();
  const isEmpty = data.length === 0;

  const periodLabels: Record<TimePeriod, string> = {
    today: 'Today',
    '7days': 'Last 7 days',
    month: 'This Month',
    year: 'This Year'
  };

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length > 0 && payload[0].payload) {
      const dataPoint = payload[0].payload;
      return (
        <div 
          className="px-4 py-3 rounded-xl"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(129, 81, 217, 0.3)'
          }}
        >
          <p className="text-gray-300 text-sm mb-1">{dataPoint.date}</p>
          <p className="text-white font-semibold">
            ₱{(payload[0].value || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      data-testid="smart-tracking-chart"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-2xl p-6 card-glass"
      style={{ minHeight: '500px' }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-semibold theme-text mb-1">Smart Tracking</h3>
          <p className="theme-text-secondary text-sm">Your spending patterns over time</p>
        </div>
        
        {/* Time Period Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {(['today', '7days', 'month', 'year'] as TimePeriod[]).map((period) => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                timePeriod === period
                  ? 'text-white'
                  : 'theme-text-secondary hover:theme-text'
              }`}
              style={{
                backgroundColor: timePeriod === period ? 'rgba(129, 81, 217, 0.2)' : 'transparent',
                color: timePeriod === period ? '#8151d9' : undefined
              }}
            >
              {period === timePeriod && <Calendar className="w-4 h-4" />}
              {periodLabels[period]}
            </button>
          ))}
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center" style={{ height: '320px' }}>
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
            style={{ 
              background: 'linear-gradient(135deg, rgba(129, 81, 217, 0.2) 0%, rgba(161, 120, 232, 0.2) 100%)',
            }}
          >
            <TrendingUp className="w-12 h-12" style={{ color: '#8151d9' }} />
          </div>
          <h4 className="theme-text text-lg font-semibold mb-2">No data yet</h4>
          <p className="theme-text-secondary text-sm text-center max-w-sm">
            Start tracking your expenses by adding your first transaction using the + button below.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8151d9" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8151d9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="expense" 
              stroke="#8151d9" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorExpense)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
};

export default SmartTrackingChart;