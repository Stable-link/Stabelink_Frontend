import { motion } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  FileText,
  Clock,
  ArrowRight,
  ArrowLeft,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AnalyticsPageProps {
  isDark: boolean;
  onBack: () => void;
}

export default function AnalyticsPage({ isDark, onBack }: AnalyticsPageProps) {
  // Professional glass morphism styles
  const glassCard = isDark 
    ? 'bg-gradient-to-br from-[#1a1a24]/90 to-[#16161f]/90 backdrop-blur-2xl border border-white/10' 
    : 'bg-white/90 backdrop-blur-2xl border border-gray-200/50';

  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-700';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-400';

  // Revenue data by month
  const revenueData = [
    { month: 'Jan', revenue: 24500, invoices: 45, clients: 32 },
    { month: 'Feb', revenue: 28900, invoices: 52, clients: 38 },
    { month: 'Mar', revenue: 31200, invoices: 58, clients: 41 },
    { month: 'Apr', revenue: 35800, invoices: 64, clients: 47 },
    { month: 'May', revenue: 42300, invoices: 71, clients: 53 },
    { month: 'Jun', revenue: 48920, invoices: 89, clients: 62 }
  ];

  // Invoice status distribution
  const invoiceStatusData = [
    { name: 'Paid', value: 68, color: '#10b981' },
    { name: 'Pending', value: 23, color: '#06b6d4' },
    { name: 'Overdue', value: 9, color: '#ef4444' }
  ];

  // Top clients data
  const topClients = [
    { name: 'Acme Corporation', revenue: '$12,500', invoices: 24, growth: '+18%' },
    { name: 'TechStart Inc', revenue: '$9,800', invoices: 18, growth: '+22%' },
    { name: 'Design Studio Pro', revenue: '$8,400', invoices: 15, growth: '+15%' },
    { name: 'Marketing Agency', revenue: '$7,200', invoices: 13, growth: '+12%' },
    { name: 'Global Solutions', revenue: '$6,100', invoices: 11, growth: '+25%' }
  ];

  // Payment methods distribution
  const paymentMethodsData = [
    { name: 'USDC', value: 45, amount: '$125,800', color: '#06b6d4' },
    { name: 'USDT', value: 30, amount: '$84,200', color: '#10b981' },
    { name: 'DAI', value: 15, amount: '$42,100', color: '#8b5cf6' },
    { name: 'Other', value: 10, amount: '$28,100', color: '#f59e0b' }
  ];

  // KPI Cards
  const kpiCards = [
    {
      title: 'Total Revenue',
      value: '$280,920',
      change: '+24.5%',
      changeValue: '+$55,200',
      period: 'vs last period',
      isPositive: true,
      icon: DollarSign,
      gradient: 'from-[#FF1CF7]/20 to-transparent',
      iconBg: 'from-[#FF1CF7] to-[#B967FF]'
    },
    {
      title: 'Total Invoices',
      value: '379',
      change: '+12.3%',
      changeValue: '+42 invoices',
      period: 'vs last period',
      isPositive: true,
      icon: FileText,
      gradient: 'from-cyan-400/20 to-transparent',
      iconBg: 'from-cyan-400 to-blue-400'
    },
    {
      title: 'Active Clients',
      value: '273',
      change: '+8.7%',
      changeValue: '+22 clients',
      period: 'vs last period',
      isPositive: true,
      icon: Users,
      gradient: 'from-purple-400/20 to-transparent',
      iconBg: 'from-purple-400 to-pink-400'
    },
    {
      title: 'Avg. Payment Time',
      value: '4.2 days',
      change: '-15.4%',
      changeValue: '0.8 days faster',
      period: 'vs last period',
      isPositive: true,
      icon: Clock,
      gradient: 'from-emerald-400/20 to-transparent',
      iconBg: 'from-emerald-400 to-cyan-400'
    }
  ];

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
                <div className="flex items-center gap-1 text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="text-xs md:text-sm font-bold">{card.change}</span>
                </div>
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] shadow-lg shadow-[#FF1CF7]/30 hover:shadow-[#FF1CF7]/50 transition-all font-bold text-white text-sm"
          >
            View All Clients
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="overflow-x-auto -mx-5 md:mx-0">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className={`border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                <th className={`text-left py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold uppercase tracking-widest ${textMuted}`}>Rank</th>
                <th className={`text-left py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold uppercase tracking-widest ${textMuted}`}>Client</th>
                <th className={`text-left py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold uppercase tracking-widest ${textMuted}`}>Revenue</th>
                <th className={`text-left py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold uppercase tracking-widest ${textMuted}`}>Invoices</th>
                <th className={`text-left py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold uppercase tracking-widest ${textMuted}`}>Growth</th>
              </tr>
            </thead>
            <tbody>
              {topClients.map((client, index) => (
                <motion.tr
                  key={client.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                  className={`border-b ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'} transition-colors`}
                >
                  <td className={`py-4 md:py-5 px-4 md:px-6`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-400' :
                      index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                      index === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-400' :
                      isDark ? 'bg-white/10' : 'bg-gray-200'
                    }`}>
                      <span className={`text-xs font-bold ${index < 3 ? 'text-white' : textPrimary}`}>
                        #{index + 1}
                      </span>
                    </div>
                  </td>
                  <td className={`py-4 md:py-5 px-4 md:px-6 text-xs md:text-sm font-bold ${textPrimary}`}>
                    {client.name}
                  </td>
                  <td className={`py-4 md:py-5 px-4 md:px-6 text-xs md:text-sm font-bold ${textPrimary}`}>
                    {client.revenue}
                  </td>
                  <td className={`py-4 md:py-5 px-4 md:px-6 text-xs md:text-sm font-semibold ${textSecondary}`}>
                    {client.invoices}
                  </td>
                  <td className={`py-4 md:py-5 px-4 md:px-6`}>
                    <div className="flex items-center gap-1 text-emerald-400">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs md:text-sm font-bold">{client.growth}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}