import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  TrendingUp,
  DollarSign,
  Users,
  FileText,
  Clock,
  ArrowRight,
  ArrowLeft,
  Download,
  Calendar,
  Loader2,
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { listInvoices } from '../../api';
import type { ApiInvoice } from '../../api';

interface AnalyticsPageProps {
  isDark: boolean;
  onBack: () => void;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const TOKEN_COLORS: Record<string, string> = { USDC: '#06b6d4', USDT: '#10b981', DAI: '#8b5cf6' };
const DEFAULT_TOKEN_COLOR = '#f59e0b';

function getMonthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export default function AnalyticsPage({ isDark, onBack }: AnalyticsPageProps) {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<ApiInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listInvoices()
      .then((r) => setInvoices(r.invoices))
      .catch(() => setInvoices([]))
      .finally(() => setLoading(false));
  }, []);

  const glassCard = isDark
    ? 'bg-gradient-to-br from-[#1a1a24]/90 to-[#16161f]/90 backdrop-blur-2xl border border-white/10'
    : 'bg-white/90 backdrop-blur-2xl border border-gray-200/50';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-700';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-400';

  const paidInvoices = invoices.filter((i) => i.status === 'paid');
  const totalRevenue = paidInvoices.reduce((sum, i) => sum + Number(i.amount), 0);
  const uniqueClients = new Set(invoices.map((i) => String(i.client_name || i.client_email || '—').trim())).size;
  const paidCount = paidInvoices.length;
  const pendingCount = invoices.filter((i) => i.status === 'draft' || i.status === 'deployed').length;

  const avgPaymentTimeDays = (() => {
    const withDates = paidInvoices.filter((i) => i.paid_at && i.created_at);
    if (withDates.length === 0) return null;
    const totalDays = withDates.reduce((sum, i) => {
      const paid = new Date(i.paid_at!).getTime();
      const created = new Date(i.created_at!).getTime();
      return sum + (paid - created) / (24 * 60 * 60 * 1000);
    }, 0);
    return totalDays / withDates.length;
  })();

  const last6Months = (() => {
    const now = new Date();
    const keys: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      keys.push(getMonthKey(d));
    }
    return keys;
  })();

  const revenueData = last6Months.map((key) => {
    const [y, m] = key.split('-').map(Number);
    const monthLabel = MONTHS[m - 1];
    const revenue = paidInvoices
      .filter((i) => {
        if (!i.paid_at) return false;
        const d = new Date(i.paid_at);
        return d.getFullYear() === y && d.getMonth() + 1 === m;
      })
      .reduce((sum, i) => sum + Number(i.amount), 0);
    const invoicesCount = invoices.filter((i) => {
      const d = i.created_at ? new Date(i.created_at) : new Date();
      return d.getFullYear() === y && d.getMonth() + 1 === m;
    }).length;
    return { month: monthLabel, revenue: Math.round(revenue * 100) / 100, invoices: invoicesCount, key };
  });

  const invoiceStatusData = [
    ...(paidCount > 0 ? [{ name: 'Paid', value: paidCount, color: '#10b981' }] : []),
    ...(pendingCount > 0 ? [{ name: 'Pending', value: pendingCount, color: '#06b6d4' }] : []),
  ];
  if (invoiceStatusData.length === 0) invoiceStatusData.push({ name: 'No data', value: 1, color: '#6b7280' });

  const topClientsMap = new Map<string, { revenue: number; invoices: number }>();
  paidInvoices.forEach((i) => {
    const name = i.client_name || i.client_email || 'Unknown';
    const rev = Number(i.amount);
    const cur = topClientsMap.get(name) || { revenue: 0, invoices: 0 };
    topClientsMap.set(name, { revenue: cur.revenue + rev, invoices: cur.invoices + 1 });
  });
  const topClients = Array.from(topClientsMap.entries())
    .map(([name, data]) => ({
      name,
      revenue: `$${data.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      invoices: data.invoices,
    }))
    .sort((a, b) => {
      const aVal = parseFloat(a.revenue.replace(/[$,]/g, ''));
      const bVal = parseFloat(b.revenue.replace(/[$,]/g, ''));
      return bVal - aVal;
    })
    .slice(0, 10);

  const tokenTotals = new Map<string, number>();
  invoices.forEach((i) => {
    const t = i.token || 'USDC';
    tokenTotals.set(t, (tokenTotals.get(t) || 0) + Number(i.amount));
  });
  const totalByToken = Array.from(tokenTotals.entries()).map(([name, amount]) => ({
    name,
    amount,
    color: TOKEN_COLORS[name] || DEFAULT_TOKEN_COLOR,
  }));
  const sumAll = totalByToken.reduce((s, x) => s + x.amount, 0);
  const paymentMethodsData = totalByToken.map((x) => ({
    name: x.name,
    value: sumAll > 0 ? Math.round((x.amount / sumAll) * 100) : 0,
    amount: `$${x.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    color: x.color,
  }));
  if (paymentMethodsData.length === 0) paymentMethodsData.push({ name: 'USDC', value: 100, amount: '$0.00', color: '#06b6d4' });

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '—',
      changeValue: 'From paid invoices',
      period: 'all time',
      isPositive: true,
      icon: DollarSign,
      gradient: 'from-[#FF1CF7]/20 to-transparent',
      iconBg: 'from-[#FF1CF7] to-[#B967FF]',
    },
    {
      title: 'Total Invoices',
      value: String(invoices.length),
      change: '—',
      changeValue: `${paidCount} paid`,
      period: 'all time',
      isPositive: true,
      icon: FileText,
      gradient: 'from-cyan-400/20 to-transparent',
      iconBg: 'from-cyan-400 to-blue-400',
    },
    {
      title: 'Active Clients',
      value: String(uniqueClients),
      change: '—',
      changeValue: 'Unique clients',
      period: 'all time',
      isPositive: true,
      icon: Users,
      gradient: 'from-purple-400/20 to-transparent',
      iconBg: 'from-purple-400 to-pink-400',
    },
    {
      title: 'Avg. Payment Time',
      value: avgPaymentTimeDays != null ? `${avgPaymentTimeDays.toFixed(1)} days` : '—',
      change: '—',
      changeValue: 'Paid invoices',
      period: 'created to paid',
      isPositive: true,
      icon: Clock,
      gradient: 'from-emerald-400/20 to-transparent',
      iconBg: 'from-emerald-400 to-cyan-400',
    },
  ];

  const handleExport = () => {
    const headers = ['Month', 'Revenue', 'Invoices'];
    const rows = revenueData.map((r) => [r.month, r.revenue.toFixed(2), r.invoices]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stablelink-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[50vh]">
        <motion.button whileHover={{ x: -4 }} whileTap={{ scale: 0.95 }} onClick={onBack} className={`flex items-center gap-2 ${textSecondary} hover:opacity-80 font-semibold mb-8`}>
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </motion.button>
        <Loader2 className={`w-10 h-10 animate-spin ${isDark ? 'text-[#FF1CF7]' : 'text-[#B967FF]'}`} />
        <p className={`mt-4 text-sm ${textSecondary}`}>Loading analytics…</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
      {/* Back Button */}
      <motion.button
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className={`flex items-center gap-2 ${textSecondary} hover:text-white transition-colors font-semibold`}
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </motion.button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold ${textPrimary} mb-2 tracking-tight`}>
            Analytics & Reports
          </h2>
          <p className={`text-sm md:text-base ${textSecondary}`}>
            Comprehensive insights into your business performance
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-all shadow-lg font-semibold flex-1 sm:flex-initial justify-center`}
          >
            <Calendar className={`w-4 h-4 ${textSecondary}`} />
            <span className={`text-sm ${textPrimary}`}>Last 6 months</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] shadow-lg shadow-[#FF1CF7]/30 hover:shadow-[#FF1CF7]/50 transition-all font-bold text-white justify-center"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Export</span>
          </motion.button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {kpiCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${glassCard} rounded-2xl p-4 md:p-6 shadow-xl relative overflow-hidden`}
          >
            {/* Gradient Background Blur Effect */}
            <div className={`absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br ${card.gradient} rounded-full blur-3xl`} />
            
            <div className="relative">
              {/* Icon and Trend */}
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${card.iconBg} flex items-center justify-center shadow-lg`}>
                  <card.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                {card.change !== '—' ? (
                  <div className="flex items-center gap-1 text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span className="text-xs md:text-sm font-bold">{card.change}</span>
                  </div>
                ) : (
                  <span className="text-xs md:text-sm font-semibold text-gray-500">—</span>
                )}
              </div>
              
              {/* Title */}
              <h3 className={`text-xs md:text-sm font-semibold ${textMuted} mb-2`}>
                {card.title}
              </h3>
              
              {/* Value - Large */}
              <p className={`text-2xl md:text-3xl font-bold ${textPrimary} mb-2`}>
                {card.value}
              </p>
              
              {/* Trend Label */}
              <p className={`text-[10px] md:text-xs ${textMuted}`}>
                {card.changeValue} • {card.period}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {/* Revenue Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`${glassCard} rounded-2xl p-5 md:p-8 shadow-2xl`}
        >
          <div className="mb-5 md:mb-6">
            <h3 className={`${textPrimary} font-bold text-xl md:text-2xl mb-2`}>Revenue Trend</h3>
            <p className={`${textSecondary} text-xs md:text-sm`}>Monthly revenue growth over time</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF1CF7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF1CF7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} />
                <XAxis 
                  dataKey="month" 
                  stroke={isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'}
                  style={{ fontSize: '12px', fontWeight: 600 }}
                />
                <YAxis 
                  stroke={isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'}
                  style={{ fontSize: '12px', fontWeight: 600 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDark ? 'rgba(26, 26, 36, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)',
                    color: isDark ? '#fff' : '#000',
                    fontWeight: 600
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#FF1CF7" 
                  strokeWidth={3}
                  fill="url(#colorRevenue)"
                  activeDot={{ r: 6, fill: '#FF1CF7', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Invoice Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`${glassCard} rounded-2xl p-5 md:p-8 shadow-2xl`}
        >
          <div className="mb-5 md:mb-6">
            <h3 className={`${textPrimary} font-bold text-xl md:text-2xl mb-2`}>Invoice Status</h3>
            <p className={`${textSecondary} text-xs md:text-sm`}>Distribution of invoice statuses</p>
          </div>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={invoiceStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {invoiceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? 'rgba(26, 26, 36, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)',
                    color: isDark ? '#fff' : '#000',
                    fontWeight: 600
                  }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Payment Methods & Invoice Counts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`${glassCard} rounded-2xl p-5 md:p-8 shadow-2xl`}
        >
          <div className="mb-5 md:mb-6">
            <h3 className={`${textPrimary} font-bold text-xl md:text-2xl mb-2`}>Payment Methods</h3>
            <p className={`${textSecondary} text-xs md:text-sm`}>Distribution by stablecoin</p>
          </div>
          <div className="space-y-4">
            {paymentMethodsData.map((method, index) => (
              <motion.div
                key={method.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: method.color }}
                    />
                    <span className={`text-sm font-bold ${textPrimary}`}>{method.name}</span>
                  </div>
                  <span className={`text-sm font-bold ${textPrimary}`}>{method.amount}</span>
                </div>
                <div className="relative h-2 rounded-full overflow-hidden bg-gray-200/20">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${method.value}%` }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: method.color }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`text-xs ${textMuted}`}>{method.value}% of total</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Invoice Count by Month */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={`${glassCard} rounded-2xl p-5 md:p-8 shadow-2xl`}
        >
          <div className="mb-5 md:mb-6">
            <h3 className={`${textPrimary} font-bold text-xl md:text-2xl mb-2`}>Invoice Volume</h3>
            <p className={`${textSecondary} text-xs md:text-sm`}>Monthly invoice creation trend</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} />
                <XAxis 
                  dataKey="month" 
                  stroke={isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'}
                  style={{ fontSize: '12px', fontWeight: 600 }}
                />
                <YAxis 
                  stroke={isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'}
                  style={{ fontSize: '12px', fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? 'rgba(26, 26, 36, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)',
                    color: isDark ? '#fff' : '#000',
                    fontWeight: 600
                  }}
                />
                <Bar dataKey="invoices" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Top Clients Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className={`${glassCard} rounded-2xl p-5 md:p-8 shadow-2xl`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 md:mb-6 gap-4">
          <div>
            <h3 className={`${textPrimary} font-bold text-xl md:text-2xl mb-2`}>Top Clients</h3>
            <p className={`${textSecondary} text-xs md:text-sm`}>Your most valuable business relationships</p>
          </div>
          <motion.button
            type="button"
            onClick={() => navigate('/dashboard/invoices')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] shadow-lg shadow-[#FF1CF7]/30 hover:shadow-[#FF1CF7]/50 transition-all font-bold text-white text-sm"
          >
            View Invoices
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="overflow-x-auto -mx-5 md:mx-0">
          {topClients.length === 0 ? (
            <div className={`py-12 text-center rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
              <Users className={`w-12 h-12 mx-auto mb-3 ${textMuted}`} />
              <p className={`text-sm font-semibold ${textPrimary}`}>No client data yet</p>
              <p className={`text-xs ${textSecondary} mt-1`}>Paid invoices will appear here</p>
            </div>
          ) : (
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className={`border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                  <th className={`text-left py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold uppercase tracking-widest ${textMuted}`}>Rank</th>
                  <th className={`text-left py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold uppercase tracking-widest ${textMuted}`}>Client</th>
                  <th className={`text-left py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold uppercase tracking-widest ${textMuted}`}>Revenue</th>
                  <th className={`text-left py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold uppercase tracking-widest ${textMuted}`}>Invoices</th>
                </tr>
              </thead>
              <tbody>
                {topClients.map((client, index) => (
                  <motion.tr
                    key={`${client.name}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.05 }}
                    className={`border-b ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'} transition-colors`}
                  >
                    <td className="py-4 md:py-5 px-4 md:px-6">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-400' :
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                        index === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-400' :
                        isDark ? 'bg-white/10' : 'bg-gray-200'
                      }`}>
                        <span className={`text-xs font-bold ${index < 3 ? 'text-white' : textPrimary}`}>#{index + 1}</span>
                      </div>
                    </td>
                    <td className={`py-4 md:py-5 px-4 md:px-6 text-xs md:text-sm font-bold ${textPrimary}`}>{client.name}</td>
                    <td className={`py-4 md:py-5 px-4 md:px-6 text-xs md:text-sm font-bold ${textPrimary}`}>{client.revenue}</td>
                    <td className={`py-4 md:py-5 px-4 md:px-6 text-xs md:text-sm font-semibold ${textSecondary}`}>{client.invoices}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
}