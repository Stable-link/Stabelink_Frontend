import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  XCircle,
  TrendingUp,
  Send,
  Download,
  FileText,
  DollarSign,
  Clock,
  Search,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { listInvoices, listWithdrawals } from '../../api';

interface ActivityPageProps {
  isDark: boolean;
  walletAddress: string;
  onBack: () => void;
}

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  amount: string;
  time: string;
  date: string;
  status: 'success' | 'pending' | 'failed' | 'info';
  icon: any;
  color: string;
  bgColor: string;
  txHash?: string;
  invoiceId?: string;
}

type FilterType = 'All' | 'Payments' | 'Withdrawals' | 'Invoices';

function formatTimeAgo(date: Date): string {
  const sec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (sec < 60) return 'Just now';
  if (sec < 3600) return `${Math.floor(sec / 60)} min ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)} hours ago`;
  if (sec < 604800) return `${Math.floor(sec / 86400)} days ago`;
  return date.toLocaleDateString();
}

export default function ActivityPage({ isDark, walletAddress, onBack }: ActivityPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-500';
  const glassCard = isDark
    ? 'bg-gradient-to-br from-[#1a1a24]/90 to-[#16161f]/90 backdrop-blur-2xl border border-white/10'
    : 'bg-white/90 backdrop-blur-2xl border border-gray-200/50';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      listInvoices().then((r) => r.invoices),
      walletAddress?.trim() ? listWithdrawals(walletAddress).then((r) => r.withdrawals) : Promise.resolve([]),
    ])
      .then(([invoices, withdrawals]) => {
        if (cancelled) return;
        const list: Activity[] = [];
        invoices
          .filter((i) => i.status === 'paid')
          .forEach((i) => {
            const paidAt = i.paid_at ? new Date(i.paid_at) : new Date(i.created_at);
            list.push({
              id: `pay-${i.id}`,
              type: 'payment',
              title: 'Payment Received',
              description: `Invoice paid by ${i.client_name ?? 'client'}`,
              amount: `+$${Number(i.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              time: formatTimeAgo(paidAt),
              date: paidAt.toLocaleDateString('en-US'),
              status: 'success',
              icon: CheckCircle2,
              color: 'text-emerald-400',
              bgColor: 'bg-emerald-400/10',
              txHash: i.tx_hash ?? undefined,
              invoiceId: i.id,
            });
          });
        withdrawals.forEach((w) => {
          const created = new Date(w.created_at);
          const amt = (Number(w.amount_raw) / 1e6).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          list.push({
            id: w.id,
            type: 'withdrawal',
            title: 'Withdrawal Completed',
            description: `$${amt} transferred`,
            amount: `-$${amt}`,
            time: formatTimeAgo(created),
            date: created.toLocaleDateString('en-US'),
            status: 'success',
            icon: ArrowUpRight,
            color: 'text-blue-400',
            bgColor: 'bg-blue-400/10',
            txHash: w.tx_hash,
          });
        });
        invoices.forEach((i) => {
          if (i.status === 'paid') return;
          const created = i.created_at ? new Date(i.created_at) : new Date();
          list.push({
            id: `inv-${i.id}`,
            type: 'invoice',
            title: 'Invoice Created',
            description: `${i.client_name ?? 'Invoice'} • $${Number(i.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            amount: `$${Number(i.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            time: formatTimeAgo(created),
            date: created.toLocaleDateString('en-US'),
            status: i.status === 'deployed' ? 'pending' : 'info',
            icon: FileText,
            color: 'text-purple-400',
            bgColor: 'bg-purple-400/10',
            invoiceId: i.id,
          });
        });
        list.sort((a, b) => {
          const getOrder = (x: Activity) => (x.time.includes('min') ? 0 : x.time.includes('hour') ? 1 : 2);
          return getOrder(a) - getOrder(b);
        });
        setActivities(list);
      })
      .catch(() => setActivities([]))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [walletAddress]);

  const filters: FilterType[] = ['All', 'Payments', 'Withdrawals', 'Invoices'];

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'All') return matchesSearch;
    if (activeFilter === 'Payments') return matchesSearch && activity.type === 'payment';
    if (activeFilter === 'Withdrawals') return matchesSearch && activity.type === 'withdrawal';
    if (activeFilter === 'Invoices') return matchesSearch && activity.type === 'invoice';
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const config = {
      success: { label: 'Success', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
      pending: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
      failed: { label: 'Failed', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
      info: { label: 'Info', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' }
    };
    
    const style = config[status as keyof typeof config] || config.info;
    
    return (
      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${style.color} ${style.bg} border ${style.border}`}>
        {style.label}
      </span>
    );
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0d0818]' : 'bg-gray-50'}`}>
      <div className="max-w-[1600px] mx-auto p-8 lg:p-12">
        {/* Header */}
        <div className="mb-8">
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className={`flex items-center gap-2 ${textSecondary} hover:${textPrimary} transition-colors mb-6 font-semibold`}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </motion.button>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-2 tracking-tight`}>
                Activity History
              </h1>
              <p className={`text-base ${textSecondary}`}>
                Complete timeline of all your transactions and events
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDatePicker(!showDatePicker)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-all shadow-lg font-semibold ${textPrimary}`}
              >
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Last 30 days</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] shadow-lg shadow-[#FF1CF7]/30 hover:shadow-[#FF1CF7]/50 transition-all font-bold text-white"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">Export CSV</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className={`${glassCard} rounded-2xl p-6 mb-6 shadow-xl`}>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${textMuted}`} />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'} border focus:outline-none focus:ring-2 focus:ring-[#FF1CF7]/50 transition-all font-semibold text-sm`}
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              {filters.map((filter) => (
                <motion.button
                  key={filter}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    activeFilter === filter
                      ? 'bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] text-white shadow-lg shadow-[#FF1CF7]/30'
                      : isDark 
                        ? 'bg-white/5 hover:bg-white/10 text-gray-400' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  {filter}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className={`${glassCard} rounded-2xl shadow-2xl overflow-hidden`}>
          {loading ? (
            <div className="p-12 text-center">
              <p className={`${textSecondary} font-semibold`}>Loading activity...</p>
            </div>
          ) : filteredActivities.length > 0 ? (
            <div className="divide-y divide-white/5">
              {filteredActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-6 ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-all cursor-pointer group`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${activity.bgColor} shadow-lg group-hover:scale-110 transition-transform`}>
                      <activity.icon className={`w-6 h-6 ${activity.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className={`font-bold ${textPrimary} text-base`}>
                              {activity.title}
                            </h3>
                            {getStatusBadge(activity.status)}
                          </div>
                          <p className={`${textSecondary} text-sm mb-2`}>
                            {activity.description}
                          </p>
                          <div className="flex items-center gap-4 flex-wrap">
                            <span className={`text-xs ${textMuted} flex items-center gap-1`}>
                              <Clock className="w-3 h-3" />
                              {activity.time}
                            </span>
                            <span className={`text-xs ${textMuted}`}>
                              {activity.date}
                            </span>
                            {activity.txHash && (
                              <a
                                href={`https://shadownet.explorer.etherlink.com/tx/${activity.txHash.startsWith('0x') ? activity.txHash : `0x${activity.txHash}`}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 text-xs text-[#FF1CF7] hover:underline font-semibold"
                              >
                                <ExternalLink className="w-3 h-3" />
                                View TX
                              </a>
                            )}
                            {activity.invoiceId && (
                              <a
                                href={`${typeof window !== 'undefined' ? window.location.origin : ''}/checkout?id=${activity.invoiceId}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 text-xs text-[#FF1CF7] hover:underline font-semibold"
                              >
                                <Eye className="w-3 h-3" />
                                View Invoice
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Amount */}
                        {activity.amount && (
                          <div className="text-right">
                            <p className={`text-lg font-bold ${
                              activity.amount.startsWith('+') 
                                ? 'text-emerald-400' 
                                : activity.amount.startsWith('-') 
                                  ? 'text-blue-400' 
                                  : textPrimary
                            }`}>
                              {activity.amount}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className={`w-16 h-16 rounded-full ${isDark ? 'bg-white/5' : 'bg-gray-100'} flex items-center justify-center mx-auto mb-4`}>
                <AlertCircle className={`w-8 h-8 ${textMuted}`} />
              </div>
              <h3 className={`${textPrimary} font-bold text-lg mb-2`}>No activities found</h3>
              <p className={`${textSecondary} text-sm`}>Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredActivities.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <p className={`text-sm ${textSecondary}`}>
              Showing <span className="font-bold">{filteredActivities.length}</span> of <span className="font-bold">{activities.length}</span> activities
            </p>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold ${isDark ? 'bg-white/5 hover:bg-white/10 text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} transition-all`}
              >
                Previous
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold ${isDark ? 'bg-white/5 hover:bg-white/10 text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} transition-all`}
              >
                Next
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
