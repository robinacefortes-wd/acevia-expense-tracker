import { usePage, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Zap, Calendar, Target, Award } from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

import MiniCalculator from '@/components/dashboard/MiniCalculator';
import Sidebar from '@/components/dashboard/Sidebar';
import type { Transaction } from '@/types/index';
import { formatCurrency } from '@/utils/formatCurrency';

type DateRange = 'this_month' | 'last_3_months' | 'last_6_months' | 'this_year' | 'specific_month';

const RANGE_LABELS: Record<DateRange, string> = {
  this_month: 'This Month',
  last_3_months: 'Last 3 Months',
  last_6_months: 'Last 6 Months',
  this_year: 'This Year',
  specific_month: 'Specific Month',
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Returns number of days in a given month (year, 0-indexed month)
const getDaysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
interface TooltipEntry {
  name?: string;
  value?: number | string;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(10,10,10,0.95)', border: '1px solid rgba(129,81,217,0.3)' }}>
        <p className="text-xs text-gray-400 mb-2">{label ?? ''}</p>
        {payload.map((p, index) => (
          <p key={index} className="text-sm font-semibold" style={{ color: p.color }}>
            {p.name}: {formatCurrency((p.value as number) ?? 0)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const { transactions = [] } = usePage<{ transactions: Transaction[]; totalSavings: number }>().props;
  const [dateRange, setDateRange] = useState<DateRange>('this_month');
  const [specificMonth, setSpecificMonth] = useState<string>(''); // "YYYY-MM"

  // ─── Available months for the dropdown ───────────────────────────────────
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    transactions.forEach(t => {
      const d = new Date(t.date);
      months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    });
    return Array.from(months).sort().reverse();
  }, [transactions]);

  const getMonthLabel = useCallback((monthYear: string): string => {
    const [year, month] = monthYear.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, []);

  // ─── Date Range helpers ───────────────────────────────────────────────────
  const getStartDate = useCallback((range: DateRange): Date => {
    const now = new Date();
    switch (range) {
      case 'this_month':      return new Date(now.getFullYear(), now.getMonth(), 1);
      case 'last_3_months':   return new Date(now.getFullYear(), now.getMonth() - 3, 1);
      case 'last_6_months':   return new Date(now.getFullYear(), now.getMonth() - 6, 1);
      case 'this_year':       return new Date(now.getFullYear(), 0, 1);
      case 'specific_month':
        if (specificMonth) {
          const [y, m] = specificMonth.split('-').map(Number);
          return new Date(y, m - 1, 1);
        }
        return new Date(now.getFullYear(), now.getMonth(), 1);
    }
  }, [specificMonth]);

  const getEndDate = useCallback((range: DateRange): Date | null => {
    if (range === 'specific_month' && specificMonth) {
      const [y, m] = specificMonth.split('-').map(Number);
      return new Date(y, m, 0, 23, 59, 59);
    }
    return null;
  }, [specificMonth]);

  const filteredTransactions = useMemo(() => {
    const start = getStartDate(dateRange);
    const end = getEndDate(dateRange);
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d >= start && (end ? d <= end : true);
    });
  }, [transactions, dateRange, getStartDate, getEndDate]);

  // ─── Big Three Metrics ────────────────────────────────────────────────────
  const totalIncome = useMemo(() =>
    filteredTransactions.filter(t => t.type === 'income').reduce((s, t) => s + parseFloat(String(t.amount)), 0),
    [filteredTransactions]);

  const totalExpenses = useMemo(() =>
    filteredTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + parseFloat(String(t.amount)), 0),
    [filteredTransactions]);

  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  // ─── Avg Daily Spend ──────────────────────────────────────────────────────
  const { avgDailySpend, daysLabel } = useMemo(() => {
    const now = new Date();
    let days: number;
    let label: string;

    if (dateRange === 'this_month') {
      days = getDaysInMonth(now.getFullYear(), now.getMonth());
      label = `${days} days in ${now.toLocaleString('en-US', { month: 'long' })}`;
    } else if (dateRange === 'specific_month' && specificMonth) {
      const [y, m] = specificMonth.split('-').map(Number);
      days = getDaysInMonth(y, m - 1);
      label = `${days} days in ${getMonthLabel(specificMonth)}`;
    } else {
      const start = getStartDate(dateRange);
      days = Math.max(1, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
      label = `${days} days elapsed`;
    }

    return {
      avgDailySpend: totalExpenses / Math.max(1, days),
      daysLabel: label,
    };
  }, [totalExpenses, dateRange, specificMonth, getStartDate, getMonthLabel]);

  // ─── Income vs Expenses Trend ─────────────────────────────────────────────
  const trendData = useMemo(() => {
    const grouped: Record<string, { date: string; income: number; expense: number }> = {};
    const orderedKeys: string[] = [];
    const isMonthView = dateRange === 'this_month' || dateRange === 'specific_month';

    filteredTransactions.forEach(t => {
      const d = new Date(t.date);
      const key = isMonthView
        ? `${d.getDate()} ${d.toLocaleString('en-PH', { month: 'short' })}`
        : d.toLocaleString('en-PH', { month: 'short', year: '2-digit' });
      if (!grouped[key]) { grouped[key] = { date: key, income: 0, expense: 0 }; orderedKeys.push(key); }
      if (t.type === 'income') grouped[key].income += parseFloat(String(t.amount));
      else grouped[key].expense += parseFloat(String(t.amount));
    });

    return orderedKeys.map(k => grouped[k]);
  }, [filteredTransactions, dateRange]);

  // ─── Cumulative Cash Flow ─────────────────────────────────────────────────
  const cumulativeData = useMemo(() => {
    let cumIncome = 0;
    let cumExpense = 0;
    const orderedKeys: string[] = [];
    const grouped: Record<string, { date: string; income: number; expense: number }> = {};
    const isMonthView = dateRange === 'this_month' || dateRange === 'specific_month';

    filteredTransactions.forEach(t => {
      const d = new Date(t.date);
      const key = isMonthView
        ? `${d.getDate()} ${d.toLocaleString('en-PH', { month: 'short' })}`
        : d.toLocaleString('en-PH', { month: 'short', year: '2-digit' });
      if (!grouped[key]) { grouped[key] = { date: key, income: 0, expense: 0 }; orderedKeys.push(key); }
      if (t.type === 'income') grouped[key].income += parseFloat(String(t.amount));
      else grouped[key].expense += parseFloat(String(t.amount));
    });

    return orderedKeys.map(k => {
      cumIncome += grouped[k].income;
      cumExpense += grouped[k].expense;
      return { date: k, income: cumIncome, expense: cumExpense };
    });
  }, [filteredTransactions, dateRange]);

  // ─── Spending Heatmap ─────────────────────────────────────────────────────
  const heatmapData = useMemo(() => {
    const dayTotals = [0, 0, 0, 0, 0, 0, 0];
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => { dayTotals[new Date(t.date).getDay()] += parseFloat(String(t.amount)); });
    const max = Math.max(...dayTotals, 1);
    return DAY_NAMES.map((name, i) => ({ day: name, total: dayTotals[i], intensity: dayTotals[i] / max }));
  }, [filteredTransactions]);

  // ─── Financial Health Score ───────────────────────────────────────────────
  const healthScore = useMemo(() => {
    let score = 0;
    if (savingsRate >= 20) score += 35;
    else if (savingsRate >= 10) score += 20;
    else if (savingsRate > 0) score += 10;

    const expenseDays = new Set(filteredTransactions.filter(t => t.type === 'expense').map(t => t.date));
    const now = new Date();
    let totalDays: number;
    if (dateRange === 'this_month') {
      totalDays = getDaysInMonth(now.getFullYear(), now.getMonth());
    } else if (dateRange === 'specific_month' && specificMonth) {
      const [y, m] = specificMonth.split('-').map(Number);
      totalDays = getDaysInMonth(y, m - 1);
    } else {
      const start = getStartDate(dateRange);
      totalDays = Math.max(1, Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    }
    const noSpendDays = totalDays - expenseDays.size;
    if (noSpendDays >= 7) score += 30;
    else if (noSpendDays >= 3) score += 20;
    else if (noSpendDays >= 1) score += 10;

    if (totalIncome > totalExpenses) score += 35;
    else if (totalIncome === totalExpenses) score += 15;

    return Math.min(100, score);
  }, [filteredTransactions, savingsRate, totalIncome, totalExpenses, dateRange, specificMonth, getStartDate]);

  const getHealthLabel = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: '#10b981' };
    if (score >= 60) return { label: 'Good', color: '#8151d9' };
    if (score >= 40) return { label: 'Fair', color: '#f59e0b' };
    if (score >= 20) return { label: 'Aggressive Spending', color: '#f97316' };
    return { label: 'At Risk', color: '#ef4444' };
  };

  const health = getHealthLabel(healthScore);

  // ─── Gauge Arc Helper ─────────────────────────────────────────────────────
  const describeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
  });

  // ─── No-spend days helper ─────────────────────────────────────────────────
  const getNoSpendDays = useCallback(() => {
    const expDays = new Set(filteredTransactions.filter(t => t.type === 'expense').map(t => t.date));
    const now = new Date();
    let tot: number;
    if (dateRange === 'this_month') {
      tot = getDaysInMonth(now.getFullYear(), now.getMonth());
    } else if (dateRange === 'specific_month' && specificMonth) {
      const [y, m] = specificMonth.split('-').map(Number);
      tot = getDaysInMonth(y, m - 1);
    } else {
      const s = getStartDate(dateRange);
      tot = Math.max(1, Math.ceil((now.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)));
    }
    return tot - expDays.size;
  }, [filteredTransactions, dateRange, specificMonth, getStartDate]);

  const noSpendDays = getNoSpendDays();

  return (
    <div className="flex min-h-screen theme-bg">
      <Sidebar />

      <main className="flex-1 overflow-auto" style={{ marginLeft: '72px' }}>
        <div className="p-8">

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <motion.div {...fadeUp(0)} className="mb-8">
            <button
              onClick={() => router.visit('/dashboard')}
              className="flex items-center gap-2 theme-text-secondary hover:theme-text mb-4 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-4xl font-bold theme-text mb-2">Analytics</h1>
                <p className="theme-text-secondary">Deep insights into your financial behaviour</p>
              </div>

              {/* Date Range Picker + Specific Month Dropdown */}
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <div className="flex items-center gap-2 p-1 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {(Object.keys(RANGE_LABELS) as DateRange[]).filter(r => r !== 'specific_month').map(range => (
                    <button
                      key={range}
                      onClick={() => setDateRange(range)}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
                      style={{
                        backgroundColor: dateRange === range ? '#8151d9' : 'transparent',
                        color: dateRange === range ? '#fff' : '#9ca3af',
                      }}
                    >
                      {RANGE_LABELS[range]}
                    </button>
                  ))}
                </div>

                {/* Specific Month Dropdown */}
                <select
                  value={dateRange === 'specific_month' ? specificMonth : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      setSpecificMonth(e.target.value);
                      setDateRange('specific_month');
                    }
                  }}
                  className="px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer focus:outline-none"
                  style={{
                    backgroundColor: dateRange === 'specific_month' ? '#8151d9' : 'rgba(255,255,255,0.04)',
                    color: dateRange === 'specific_month' ? '#fff' : '#9ca3af',
                    border: dateRange === 'specific_month' ? '1px solid rgba(129,81,217,0.5)' : '1px solid rgba(255,255,255,0.08)',
                    colorScheme: 'dark',
                  }}
                >
                  <option value="" disabled style={{ backgroundColor: '#1a1a1a', color: '#9ca3af' }}>
                    Specific Month
                  </option>
                  {availableMonths.map(month => (
                    <option key={month} value={month} style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>
                      {getMonthLabel(month)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* ── Section 1: The Big Three ────────────────────────────────────── */}
          <motion.div {...fadeUp(0.05)} className="mb-3">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#8151d9' }}>
              The Big Three
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Income vs Expenses summary */}
            <div className="card-glass rounded-2xl p-6" style={{ borderLeft: '3px solid #10b981' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(16,185,129,0.15)' }}>
                  <TrendingUp className="w-4 h-4" style={{ color: '#10b981' }} />
                </div>
                <span className="theme-text-secondary text-sm font-medium">Income vs Expenses</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs theme-text-secondary mb-1">Income</p>
                  <p className="text-xl font-bold" style={{ color: '#10b981' }}>+{formatCurrency(totalIncome)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs theme-text-secondary mb-1">Expenses</p>
                  <p className="text-xl font-bold" style={{ color: '#ef4444' }}>-{formatCurrency(totalExpenses)}</p>
                </div>
              </div>
              <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${totalIncome > 0 ? Math.min(100, (totalExpenses / totalIncome) * 100) : 0}%`,
                    background: 'linear-gradient(90deg, #10b981, #ef4444)',
                  }}
                />
              </div>
              <p className="text-xs theme-text-secondary mt-2">
                {totalIncome > 0 ? `${Math.round((totalExpenses / totalIncome) * 100)}% of income spent` : 'No income recorded'}
              </p>
            </div>

            {/* Savings Rate Gauge */}
            <div className="card-glass rounded-2xl p-6 flex flex-col items-center">
              <div className="flex items-center gap-3 mb-4 w-full">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(129,81,217,0.15)' }}>
                  <Target className="w-4 h-4" style={{ color: '#8151d9' }} />
                </div>
                <span className="theme-text-secondary text-sm font-medium">Savings Rate</span>
              </div>
              <svg width="140" height="80" viewBox="0 0 140 80">
                <path d={describeArc(70, 75, 55, 180, 360)} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" strokeLinecap="round" />
                <path
                  d={describeArc(70, 75, 55, 180, 180 + Math.min(180, (savingsRate / 100) * 180))}
                  fill="none"
                  stroke={savingsRate >= 20 ? '#10b981' : savingsRate >= 10 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <text x="70" y="68" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="700">
                  {savingsRate}%
                </text>
                <text x="70" y="80" textAnchor="middle" fill="#6b7280" fontSize="9">
                  savings rate
                </text>
              </svg>
              <p className="text-xs theme-text-secondary mt-2 text-center">
                {savingsRate >= 20 ? '🎉 Great! Above the 20% target' : savingsRate >= 10 ? '⚠️ Getting there — aim for 20%' : '🔴 Below target — review spending'}
              </p>
            </div>

            {/* Avg Daily Spend */}
            <div className="card-glass rounded-2xl p-6" style={{ borderLeft: '3px solid #f59e0b' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(245,158,11,0.15)' }}>
                  <Zap className="w-4 h-4" style={{ color: '#f59e0b' }} />
                </div>
                <span className="theme-text-secondary text-sm font-medium">Avg Daily Spend</span>
              </div>
              <p className="text-3xl font-bold theme-text mb-1">{formatCurrency(avgDailySpend)}</p>
              <p className="text-xs theme-text-secondary mb-4">based on {daysLabel}</p>
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(245,158,11,0.08)' }}>
                <p className="text-xs" style={{ color: '#f59e0b' }}>
                  At this rate, you'd spend <strong>{formatCurrency(avgDailySpend * 30)}</strong> over any 30-day period
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Income vs Expenses Line Chart ──────────────────────────────── */}
          <motion.div {...fadeUp(0.15)} className="card-glass rounded-2xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-lg font-semibold theme-text">Income vs Expenses Trend</h3>
              <span className="text-xs theme-text-secondary">over time</span>
            </div>
            {trendData.length === 0 ? (
              <div className="flex items-center justify-center h-48 theme-text-secondary text-sm">No data for this period</div>
            ) : (
              <ResponsiveContainer width="100%" height={380}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '11px' }} tickFormatter={(v: number) => `₱${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
                  <Line type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, fill: '#10b981' }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3, fill: '#ef4444' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* ── Section 2: Behavioral Insights ─────────────────────────────── */}
          <motion.div {...fadeUp(0.2)} className="mb-3">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#8151d9' }}>
              Behavioural Insights — When do you spend?
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.25)} className="card-glass rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-5 h-5" style={{ color: '#8151d9' }} />
              <h3 className="text-lg font-semibold theme-text">Weekly Spending Heatmap</h3>
            </div>
            <div className="grid grid-cols-7 gap-3">
              {heatmapData.map(({ day, total, intensity }) => (
                <div key={day} className="flex flex-col items-center gap-2">
                  <div
                    className="w-full aspect-square rounded-xl flex items-center justify-center transition-all"
                    style={{
                      backgroundColor: intensity === 0
                        ? 'rgba(255,255,255,0.04)'
                        : `rgba(129, 81, 217, ${0.1 + intensity * 0.75})`,
                      border: intensity > 0.7 ? '1px solid rgba(129,81,217,0.4)' : '1px solid transparent',
                    }}
                  >
                    <span className="text-xs font-bold" style={{ color: intensity > 0.5 ? '#fff' : '#6b7280' }}>
                      {intensity > 0 ? `${Math.round(intensity * 100)}%` : '–'}
                    </span>
                  </div>
                  <span className="text-xs theme-text-secondary">{day}</span>
                  <span className="text-xs font-medium theme-text">{total > 0 ? formatCurrency(total) : '–'}</span>
                </div>
              ))}
            </div>
            <p className="text-xs theme-text-secondary mt-4">
              Darker = higher spending relative to your busiest day
            </p>
          </motion.div>

          {/* ── Section 3: Financial Health Score ──────────────────────────── */}
          <motion.div {...fadeUp(0.3)} className="mb-3">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#8151d9' }}>
              Financial Health Score
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.35)} className="card-glass rounded-2xl p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Gauge */}
              <div className="flex flex-col items-center flex-shrink-0">
                <svg width="200" height="120" viewBox="0 0 200 120">
                  <path d={describeArc(100, 110, 80, 180, 360)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="16" strokeLinecap="round" />
                  <path d={describeArc(100, 110, 80, 180, 216)} fill="none" stroke="rgba(239,68,68,0.3)" strokeWidth="16" />
                  <path d={describeArc(100, 110, 80, 216, 252)} fill="none" stroke="rgba(249,115,22,0.3)" strokeWidth="16" />
                  <path d={describeArc(100, 110, 80, 252, 288)} fill="none" stroke="rgba(245,158,11,0.3)" strokeWidth="16" />
                  <path d={describeArc(100, 110, 80, 288, 324)} fill="none" stroke="rgba(129,81,217,0.3)" strokeWidth="16" />
                  <path d={describeArc(100, 110, 80, 324, 360)} fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="16" />
                  <path
                    d={describeArc(100, 110, 80, 180, 180 + (healthScore / 100) * 180)}
                    fill="none"
                    stroke={health.color}
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  <text x="100" y="98" textAnchor="middle" fill="#ffffff" fontSize="28" fontWeight="800">{healthScore}</text>
                  <text x="100" y="115" textAnchor="middle" fill={health.color} fontSize="11" fontWeight="600">{health.label}</text>
                </svg>
              </div>

              {/* Breakdown */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {[
                  {
                    label: 'Savings Rate',
                    value: `${savingsRate}%`,
                    target: '≥ 20%',
                    met: savingsRate >= 20,
                    pts: savingsRate >= 20 ? 35 : savingsRate >= 10 ? 20 : 10,
                  },
                  {
                    label: 'No-Spend Days',
                    value: `${noSpendDays} days`,
                    target: '≥ 7 days',
                    met: noSpendDays >= 7,
                    pts: 30,
                  },
                  {
                    label: 'Net Positive',
                    value: totalIncome > totalExpenses ? 'Yes ✓' : 'No ✗',
                    target: 'Income > Expenses',
                    met: totalIncome > totalExpenses,
                    pts: 35,
                  },
                ].map(item => (
                  <div
                    key={item.label}
                    className="rounded-xl p-4"
                    style={{ backgroundColor: item.met ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${item.met ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)'}` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs theme-text-secondary">{item.label}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: item.met ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.1)', color: item.met ? '#10b981' : '#ef4444' }}>
                        +{item.pts}pts
                      </span>
                    </div>
                    <p className="text-lg font-bold theme-text">{item.value}</p>
                    <p className="text-xs theme-text-secondary mt-1">Target: {item.target}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Section 4: Cumulative Cash Flow ────────────────────────────── */}
          <motion.div {...fadeUp(0.4)} className="mb-3">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#8151d9' }}>
              Cumulative Cash Flow — Your Wealth Path
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.45)} className="card-glass rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h3 className="text-lg font-semibold theme-text">Wealth Path</h3>
                <p className="text-xs theme-text-secondary mt-1">Cumulative income vs cumulative expenses over time</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }} />
                  <span className="text-xs theme-text-secondary">Total Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }} />
                  <span className="text-xs theme-text-secondary">Total Expenses</span>
                </div>
              </div>
            </div>
            {cumulativeData.length === 0 ? (
              <div className="flex items-center justify-center h-48 theme-text-secondary text-sm">No data for this period</div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={cumulativeData}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '11px' }} tickFormatter={(v: number) => `₱${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2.5} fill="url(#incomeGrad)" />
                  <Area type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" strokeWidth={2.5} fill="url(#expenseGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {cumulativeData.length > 0 && (
              <div className="flex justify-center mt-6">
                <div
                  className="flex items-center gap-6 px-8 py-4 rounded-xl"
                  style={{ backgroundColor: 'rgba(129,81,217,0.08)', border: '1px solid rgba(129,81,217,0.15)', width: 'fit-content' }}
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" style={{ color: '#8151d9' }} />
                    <span className="text-sm theme-text font-medium">Net Position</span>
                  </div>
                  <div className="w-px h-5" style={{ backgroundColor: 'rgba(129,81,217,0.2)' }} />
                  <span className="text-sm font-bold" style={{ color: totalIncome >= totalExpenses ? '#10b981' : '#ef4444' }}>
                    {totalIncome >= totalExpenses ? '+' : ''}{formatCurrency(totalIncome - totalExpenses)}
                    {' '}
                    <span className="font-normal text-xs theme-text-secondary">
                      ({totalIncome > 0 ? `${Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)}% kept` : 'N/A'})
                    </span>
                  </span>
                </div>
              </div>
            )}
          </motion.div>

        </div>
      </main>
      <MiniCalculator buttonBottom="bottom-8" panelBottom="bottom-28" />
    </div>
  );
};

export default Analytics;