import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft,
  FileText,
  Download,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Calendar,
  TrendingUp,
  TrendingDown,
  Eye,
  Copy,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileQuestion,
  Plus,
  DollarSign,
  Zap,
  Send,
  ArrowUpRight,
  ArrowDownRight,
  SortAsc,
  Loader2,
  Link2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import InvoiceDetailModal from './InvoiceDetailModal';
import { listInvoices, getApiKey, deleteInvoice, type ApiInvoice } from '../../api';

interface InvoicesPageProps {
  isDark: boolean;
  onBack: () => void;
  onCreate: () => void;
}

interface Invoice {
  id: string;
  invoiceId: string;
  client: string;
  clientEmail: string;
  amount: string;
  token: string;
  split: string;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Draft' | 'Deployed';
  dueDate: string;
  createdDate: string;
  created_at?: string;
  txHash?: string;
}

type StatusFilter = 'All' | 'Paid' | 'Pending' | 'Overdue' | 'Draft' | 'Deployed';

function mapApiInvoiceToInvoice(a: ApiInvoice): Invoice {
  const statusMap: Record<string, 'Paid' | 'Pending' | 'Overdue' | 'Draft' | 'Deployed'> = {
    paid: 'Paid',
    draft: 'Draft',
    deployed: 'Deployed',
    cancelled: 'Draft',
    withdrawn: 'Paid',
  };
  const status = statusMap[a.status?.toLowerCase()] ?? 'Pending';
  const created = a.created_at ? new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '';
  return {
    id: a.id,
    invoiceId: `INV-${a.onchain_invoice_id}`,
    client: a.client_name ?? '—',
    clientEmail: a.client_email ?? '',
    amount: Number(a.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    token: a.token,
    split: '—',
    status,
    dueDate: '',
    createdDate: created,
    created_at: a.created_at,
    txHash: a.tx_hash ?? undefined,
  };
}

type DateRangeFilter = 'Last 7 Days' | 'Last 30 Days' | 'Last 90 Days';

export default function InvoicesPage({ isDark, onBack, onCreate }: InvoicesPageProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRangeFilter>('Last 30 Days');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [tokenFilter, setTokenFilter] = useState('All Tokens');
  const [sortBy, setSortBy] = useState('Newest First');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(() => {
    if (!getApiKey()) {
      setError('Set your API key in Settings or .env (VITE_API_KEY) to load invoices.');
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    listInvoices()
      .then((res) => setInvoices(res.invoices.map(mapApiInvoiceToInvoice)))
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load invoices'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Styles
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-500';

  const glassCard = isDark
    ? 'bg-gradient-to-br from-[#1a1a24]/90 to-[#16161f]/90 backdrop-blur-2xl border border-white/10'
    : 'bg-white/90 backdrop-blur-2xl border border-gray-200/50';

  const paidCount = invoices.filter((i) => i.status === 'Paid').length;
  const pendingCount = invoices.filter((i) => i.status === 'Pending' || i.status === 'Overdue' || i.status === 'Deployed').length;
  const totalVolume = invoices
    .filter((i) => i.status === 'Paid')
    .reduce((sum, i) => sum + parseFloat(i.amount.replace(/,/g, '')), 0);

  const analyticsCards = [
    {
      title: 'Total Invoices',
      value: String(invoices.length),
      trend: '',
      trendLabel: '',
      isPositive: true,
      icon: FileText,
      gradient: 'from-[#FF1CF7]/20 to-transparent',
      iconBg: 'from-[#FF1CF7] to-[#B967FF]'
    },
    {
      title: 'Paid',
      value: String(paidCount),
      trend: '',
      trendLabel: '',
      isPositive: true,
      icon: CheckCircle2,
      gradient: 'from-emerald-400/20 to-transparent',
      iconBg: 'from-emerald-400 to-cyan-400'
    },
    {
      title: 'Pending',
      value: String(pendingCount),
      trend: '',
      trendLabel: '',
      isPositive: false,
      icon: Clock,
      gradient: 'from-yellow-400/20 to-transparent',
      iconBg: 'from-yellow-400 to-orange-400'
    },
    {
      title: 'Total Volume',
      value: `$${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: '',
      trendLabel: '',
      isPositive: true,
      icon: DollarSign,
      gradient: 'from-cyan-400/20 to-transparent',
      iconBg: 'from-cyan-400 to-blue-400'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return isDark 
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
          : 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'Deployed':
      case 'Pending':
        return isDark 
          ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' 
          : 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'Overdue':
        return isDark 
          ? 'bg-red-500/10 text-red-400 border-red-500/20' 
          : 'bg-red-50 text-red-600 border-red-200';
      case 'Draft':
        return isDark 
          ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' 
          : 'bg-gray-100 text-gray-600 border-gray-300';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
        return CheckCircle2;
      case 'Deployed':
      case 'Pending':
        return Clock;
      case 'Overdue':
        return AlertCircle;
      case 'Draft':
        return FileQuestion;
      default:
        return FileText;
    }
  };

  // Action handlers
  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setActiveActionMenu(null);
  };

  const handleDuplicate = (invoice: Invoice) => {
    setActiveActionMenu(null);
    navigate('/dashboard/create', { state: { duplicate: invoice } });
  };

  const handleCopyPaymentLink = (invoice: Invoice) => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/checkout?id=${invoice.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setActiveActionMenu(null);
    });
  };

  const handleSendReminder = (invoice: Invoice) => {
    console.log('Sending reminder for invoice:', invoice.invoiceId);
    // TODO: Implement send reminder logic
    setActiveActionMenu(null);
  };

  const handleEdit = (invoice: Invoice) => {
    console.log('Editing invoice:', invoice.invoiceId);
    // TODO: Implement edit logic (navigate to edit page)
    setActiveActionMenu(null);
  };

  const handleDelete = async (invoiceId: string) => {
    try {
      await deleteInvoice(invoiceId);
      setInvoices((prev) => prev.filter((i) => i.id !== invoiceId));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete invoice');
    }
    setDeleteConfirmId(null);
    setActiveActionMenu(null);
  };

  const getDateRangeMs = (range: DateRangeFilter): number => {
    const now = Date.now();
    switch (range) {
      case 'Last 7 Days': return now - 7 * 24 * 60 * 60 * 1000;
      case 'Last 30 Days': return now - 30 * 24 * 60 * 60 * 1000;
      case 'Last 90 Days': return now - 90 * 24 * 60 * 60 * 1000;
      default: return 0;
    }
  };

  const filteredBySearchStatusToken = invoices.filter(invoice => {
    const matchesSearch = invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.invoiceId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter;
    const matchesToken = tokenFilter === 'All Tokens' || invoice.token === tokenFilter;
    const createdMs = invoice.created_at ? new Date(invoice.created_at).getTime() : 0;
    const matchesDate = createdMs >= getDateRangeMs(dateRangeFilter);
    return matchesSearch && matchesStatus && matchesToken && matchesDate;
  });

  const filteredInvoices = [...filteredBySearchStatusToken].sort((a, b) => {
    const amountA = parseFloat(a.amount.replace(/,/g, '')) || 0;
    const amountB = parseFloat(b.amount.replace(/,/g, '')) || 0;
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    switch (sortBy) {
      case 'Oldest First': return dateA - dateB;
      case 'Amount (High)': return amountB - amountA;
      case 'Amount (Low)': return amountA - amountB;
      case 'Newest First':
      default: return dateB - dateA;
    }
  });

  const handleExportCsv = () => {
    const headers = ['Invoice ID', 'Client', 'Client Email', 'Amount', 'Token', 'Status', 'Due Date', 'Created'];
    const rows = filteredInvoices.map((i) => [
      i.invoiceId,
      i.client,
      i.clientEmail,
      i.amount,
      i.token,
      i.status,
      i.dueDate || '—',
      i.createdDate,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stablelink-invoices-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasInvoices = invoices.length > 0;

  // Skeleton row for loading state
  const SkeletonRow = () => (
    <tr className={`border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
      <td className="py-5 px-6"><div className={`h-4 w-24 rounded-lg animate-pulse ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} /></td>
      <td className="py-5 px-6"><div className={`h-4 w-32 rounded-lg animate-pulse ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} /></td>
      <td className="py-5 px-6"><div className={`h-4 w-16 rounded-lg animate-pulse ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} /></td>
      <td className="py-5 px-6"><div className={`h-6 w-14 rounded-lg animate-pulse ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} /></td>
      <td className="py-5 px-6"><div className={`h-4 w-12 rounded-lg animate-pulse ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} /></td>
      <td className="py-5 px-6"><div className={`h-6 w-20 rounded-lg animate-pulse ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} /></td>
      <td className="py-5 px-6"><div className={`h-4 w-20 rounded-lg animate-pulse ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} /></td>
      <td className="py-5 px-6"><div className={`h-4 w-24 rounded-lg animate-pulse ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} /></td>
      <td className="py-5 px-6"><div className={`h-8 w-8 rounded-lg animate-pulse ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} /></td>
    </tr>
  );

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
                Invoices
              </h1>
              <p className={`text-base ${textSecondary}`}>
                Manage and track all your stablecoin invoices
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportCsv}
                disabled={!hasInvoices || filteredInvoices.length === 0}
                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 border ${
                  isDark 
                    ? 'border-white/10 hover:border-white/20 text-white hover:bg-white/5 disabled:opacity-50 disabled:pointer-events-none' 
                    : 'border-gray-300 hover:border-gray-400 text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none'
                }`}
              >
                <Download className="w-4 h-4" />
                Export CSV
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCreate}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] font-bold text-white shadow-lg shadow-[#FF1CF7]/30 hover:shadow-[#FF1CF7]/50 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Invoice
              </motion.button>
            </div>
          </div>
        </div>

        {/* Analytics Cards - show skeleton when loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {analyticsCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${glassCard} rounded-2xl p-6 shadow-xl relative overflow-hidden`}
            >
              {loading ? (
                <>
                  <div className={`h-12 w-12 rounded-xl animate-pulse ${isDark ? 'bg-white/10' : 'bg-gray-200'} mb-4`} />
                  <div className={`h-3 w-20 rounded animate-pulse ${isDark ? 'bg-white/10' : 'bg-gray-200'} mb-2`} />
                  <div className={`h-8 w-16 rounded animate-pulse ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                </>
              ) : (
                <>
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} rounded-full blur-3xl`} />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.iconBg} flex items-center justify-center shadow-lg`}>
                        <card.icon className="w-6 h-6 text-white" />
                      </div>
                      {card.isPositive ? (
                        <div className="flex items-center gap-1 text-emerald-400">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm font-bold">{card.trend}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-400">
                          <TrendingDown className="w-4 h-4" />
                          <span className="text-sm font-bold">{card.trend}</span>
                        </div>
                      )}
                    </div>
                    <h3 className={`text-sm font-semibold ${textMuted} mb-2`}>
                      {card.title}
                    </h3>
                    <p className={`text-3xl font-bold ${textPrimary} mb-2`}>
                      {card.value}
                    </p>
                    <p className={`text-xs ${textMuted}`}>
                      {card.trendLabel}
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {loading ? (
          /* Skeleton: table card with skeleton rows */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${glassCard} rounded-2xl shadow-2xl overflow-hidden`}
          >
            <div className={`p-6 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className={`lg:col-span-4 h-12 rounded-xl animate-pulse ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                <div className={`lg:col-span-2 h-12 rounded-xl animate-pulse ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                <div className={`lg:col-span-2 h-12 rounded-xl animate-pulse ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                <div className={`lg:col-span-2 h-12 rounded-xl animate-pulse ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                <div className={`lg:col-span-2 h-12 rounded-xl animate-pulse ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${isDark ? 'bg-white/5' : 'bg-gray-50/80'} border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                  <tr>
                    <th className={`text-left py-5 px-6 text-xs font-bold uppercase tracking-wider ${textMuted}`}>Invoice ID</th>
                    <th className={`text-left py-5 px-6 text-xs font-bold uppercase tracking-wider ${textMuted}`}>Client</th>
                    <th className={`text-left py-5 px-6 text-xs font-bold uppercase tracking-wider ${textMuted}`}>Amount</th>
                    <th className={`text-left py-5 px-6 text-xs font-bold uppercase tracking-wider ${textMuted}`}>Token</th>
                    <th className={`text-left py-5 px-6 text-xs font-bold uppercase tracking-wider ${textMuted}`}>Split %</th>
                    <th className={`text-left py-5 px-6 text-xs font-bold uppercase tracking-wider ${textMuted}`}>Status</th>
                    <th className={`text-left py-5 px-6 text-xs font-bold uppercase tracking-wider ${textMuted}`}>Due Date</th>
                    <th className={`text-left py-5 px-6 text-xs font-bold uppercase tracking-wider ${textMuted}`}>Created</th>
                    <th className={`text-left py-5 px-6 text-xs font-bold uppercase tracking-wider ${textMuted}`}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => <SkeletonRow key={i} />)}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : error ? (
          // Error state (e.g. API key missing or request failed)
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${glassCard} rounded-2xl p-12 shadow-xl text-center`}
          >
            <AlertCircle className={`w-14 h-14 mx-auto mb-4 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
            <h2 className={`text-xl font-bold ${textPrimary} mb-2`}>Could not load invoices</h2>
            <p className={`text-sm ${textSecondary} mb-6 max-w-md mx-auto`}>{error}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fetchInvoices()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] font-bold text-white shadow-lg"
            >
              Try again
            </motion.button>
          </motion.div>
        ) : !hasInvoices ? (
          // Empty State (no invoices after load)
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className={`${glassCard} rounded-3xl p-16 shadow-2xl text-center`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }}
              className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-[#FF1CF7]/20 to-[#B967FF]/20 flex items-center justify-center border border-[#FF1CF7]/30"
            >
              <FileText className="w-16 h-16 text-[#FF1CF7]" strokeWidth={1.5} />
            </motion.div>

            <h2 className={`text-3xl font-bold ${textPrimary} mb-3`}>
              No invoices yet
            </h2>
            <p className={`text-base ${textSecondary} mb-8 max-w-md mx-auto`}>
              Create your first stablecoin invoice and start accepting payments on Etherlink
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCreate}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] font-bold text-white shadow-xl shadow-[#FF1CF7]/40 hover:shadow-[#FF1CF7]/60 transition-all flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Create Invoice
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Filters & Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`${glassCard} rounded-2xl p-6 shadow-xl mb-8 relative z-10`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Search */}
                <div className="lg:col-span-4 relative">
                  <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${textMuted} pointer-events-none`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by client name or invoice ID..."
                    className={`w-full h-[48px] pl-12 pr-4 py-3 rounded-xl text-sm font-semibold ${
                      isDark 
                        ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500' 
                        : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-[#FF1CF7]/50 transition-all`}
                  />
                </div>

                {/* Status Filter */}
                <div className="lg:col-span-2 relative">
                  <button
                    onClick={() => {
                      setShowStatusDropdown(!showStatusDropdown);
                      setShowTokenDropdown(false);
                      setShowSortDropdown(false);
                    }}
                    className={`w-full h-[48px] px-4 py-3 rounded-xl flex items-center justify-between text-sm ${
                      isDark 
                        ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10' 
                        : 'bg-gray-50 border border-gray-200 text-gray-900 hover:bg-gray-100'
                    } transition-all font-semibold`}
                  >
                    <span className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      {statusFilter}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showStatusDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`absolute z-[100] top-full mt-2 w-full rounded-xl overflow-hidden shadow-2xl ${glassCard} border ${isDark ? 'border-white/20' : 'border-gray-300'}`}
                      >
                        {(['All', 'Paid', 'Pending', 'Overdue', 'Draft', 'Deployed'] as StatusFilter[]).map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setStatusFilter(status);
                              setShowStatusDropdown(false);
                            }}
                            className={`w-full px-4 py-3 text-left text-sm font-semibold transition-colors ${
                              statusFilter === status 
                                ? isDark ? 'bg-[#FF1CF7]/20 text-[#FF1CF7]' : 'bg-pink-50 text-pink-600'
                                : isDark ? 'text-white hover:bg-white/5' : 'text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Date Range */}
                <div className="lg:col-span-2 relative">
                  <button
                    onClick={() => {
                      setShowDateDropdown(!showDateDropdown);
                      setShowStatusDropdown(false);
                      setShowTokenDropdown(false);
                      setShowSortDropdown(false);
                    }}
                    className={`w-full h-[48px] px-4 py-3 rounded-xl flex items-center justify-between text-sm ${
                      isDark 
                        ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10' 
                        : 'bg-gray-50 border border-gray-200 text-gray-900 hover:bg-gray-100'
                    } transition-all font-semibold`}
                  >
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {dateRangeFilter}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showDateDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showDateDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`absolute z-[100] top-full mt-2 w-full rounded-xl overflow-hidden shadow-2xl ${glassCard} border ${isDark ? 'border-white/20' : 'border-gray-300'}`}
                      >
                        {(['Last 7 Days', 'Last 30 Days', 'Last 90 Days'] as DateRangeFilter[]).map((range) => (
                          <button
                            key={range}
                            onClick={() => {
                              setDateRangeFilter(range);
                              setShowDateDropdown(false);
                            }}
                            className={`w-full px-4 py-3 text-left text-sm font-semibold transition-colors ${
                              dateRangeFilter === range 
                                ? isDark ? 'bg-[#FF1CF7]/20 text-[#FF1CF7]' : 'bg-pink-50 text-pink-600'
                                : isDark ? 'text-white hover:bg-white/5' : 'text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            {range}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Token Filter */}
                <div className="lg:col-span-2 relative">
                  <button
                    onClick={() => {
                      setShowTokenDropdown(!showTokenDropdown);
                      setShowStatusDropdown(false);
                      setShowSortDropdown(false);
                    }}
                    className={`w-full h-[48px] px-4 py-3 rounded-xl flex items-center justify-between text-sm ${
                      isDark 
                        ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10' 
                        : 'bg-gray-50 border border-gray-200 text-gray-900 hover:bg-gray-100'
                    } transition-all font-semibold`}
                  >
                    <span className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      {tokenFilter}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showTokenDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showTokenDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`absolute z-[100] top-full mt-2 w-full rounded-xl overflow-hidden shadow-2xl ${glassCard} border ${isDark ? 'border-white/20' : 'border-gray-300'}`}
                      >
                        {['All Tokens', 'USDC', 'USDT', 'DAI'].map((token) => (
                          <button
                            key={token}
                            onClick={() => {
                              setTokenFilter(token);
                              setShowTokenDropdown(false);
                            }}
                            className={`w-full px-4 py-3 text-left text-sm font-semibold transition-colors ${
                              tokenFilter === token 
                                ? isDark ? 'bg-[#FF1CF7]/20 text-[#FF1CF7]' : 'bg-pink-50 text-pink-600'
                                : isDark ? 'text-white hover:bg-white/5' : 'text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            {token}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sort */}
                <div className="lg:col-span-2 relative">
                  <button
                    onClick={() => {
                      setShowSortDropdown(!showSortDropdown);
                      setShowStatusDropdown(false);
                      setShowTokenDropdown(false);
                    }}
                    className={`w-full h-[48px] px-4 py-3 rounded-xl flex items-center justify-between text-sm ${
                      isDark 
                        ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10' 
                        : 'bg-gray-50 border border-gray-200 text-gray-900 hover:bg-gray-100'
                    } transition-all font-semibold`}
                  >
                    <span className="flex items-center gap-2">
                      <SortAsc className="w-4 h-4" />
                      {sortBy}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showSortDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`absolute z-[100] top-full mt-2 w-full rounded-xl overflow-hidden shadow-2xl ${glassCard} border ${isDark ? 'border-white/20' : 'border-gray-300'}`}
                      >
                        {['Newest First', 'Oldest First', 'Amount (High)', 'Amount (Low)'].map((sort) => (
                          <button
                            key={sort}
                            onClick={() => {
                              setSortBy(sort);
                              setShowSortDropdown(false);
                            }}
                            className={`w-full px-4 py-3 text-left text-sm font-semibold transition-colors ${
                              sortBy === sort 
                                ? isDark ? 'bg-[#FF1CF7]/20 text-[#FF1CF7]' : 'bg-pink-50 text-pink-600'
                                : isDark ? 'text-white hover:bg-white/5' : 'text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            {sort}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Invoice Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`${glassCard} rounded-2xl shadow-2xl overflow-hidden relative`}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${isDark ? 'bg-white/5' : 'bg-gray-50/80'} border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                    <tr>
                      <th className={`text-left py-5 px-6 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                        Invoice ID
                      </th>
                      <th className={`text-left py-5 px-6 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                        Client
                      </th>
                      <th className={`text-left py-5 px-6 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                        Amount
                      </th>
                      <th className={`text-left py-5 px-6 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                        Token
                      </th>
                      <th className={`text-left py-5 px-6 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                        Split %
                      </th>
                      <th className={`text-left py-5 px-6 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                        Status
                      </th>
                      <th className={`text-left py-5 px-6 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                        Due Date
                      </th>
                      <th className={`text-left py-5 px-6 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                        Created
                      </th>
                      <th className={`text-left py-5 px-6 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {error && (
                      <tr>
                        <td colSpan={9} className={`py-16 text-center ${textSecondary}`}>
                          <AlertCircle className="w-10 h-10 mx-auto mb-2 text-amber-500" />
                          <p className="font-semibold">{error}</p>
                        </td>
                      </tr>
                    )}
                    {!error && filteredInvoices.length === 0 && (
                      <tr>
                        <td colSpan={9} className={`py-16 text-center ${textSecondary}`}>
                          <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                          <p className="font-semibold">No invoices match your filters.</p>
                        </td>
                      </tr>
                    )}
                    {!error && filteredInvoices.map((invoice, index) => {
                      const StatusIcon = getStatusIcon(invoice.status);
                      return (
                        <motion.tr
                          key={invoice.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + index * 0.05 }}
                          className={`border-b ${isDark ? 'border-white/5' : 'border-gray-100'} hover:${isDark ? 'bg-white/5' : 'bg-gray-50'} transition-colors`}
                        >
                          <td className={`py-5 px-6`}>
                            <span className={`text-sm font-mono font-bold ${textPrimary}`}>
                              {invoice.invoiceId}
                            </span>
                          </td>
                          <td className={`py-5 px-6`}>
                            <div>
                              <p className={`text-sm font-bold ${textPrimary} mb-0.5`}>
                                {invoice.client}
                              </p>
                              <p className={`text-xs ${textMuted}`}>
                                {invoice.clientEmail}
                              </p>
                            </div>
                          </td>
                          <td className={`py-5 px-6`}>
                            <span className={`text-base font-bold ${textPrimary}`}>
                              ${invoice.amount}
                            </span>
                          </td>
                          <td className={`py-5 px-6`}>
                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                              isDark 
                                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' 
                                : 'bg-cyan-50 text-cyan-600 border-cyan-200'
                            }`}>
                              {invoice.token}
                            </span>
                          </td>
                          <td className={`py-5 px-6`}>
                            <span className={`text-sm font-bold ${textSecondary}`}>
                              {invoice.split}
                            </span>
                          </td>
                          <td className={`py-5 px-6`}>
                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border ${getStatusColor(invoice.status)}`}>
                              <StatusIcon className="w-3.5 h-3.5" />
                              {invoice.status}
                            </span>
                          </td>
                          <td className={`py-5 px-6 text-sm font-medium ${textSecondary}`}>
                            {invoice.dueDate}
                          </td>
                          <td className={`py-5 px-6 text-sm font-medium ${textSecondary}`}>
                            {invoice.createdDate}
                          </td>
                          <td className={`py-5 px-6`}>
                            <div className="relative">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setActiveActionMenu(activeActionMenu === invoice.id ? null : invoice.id)}
                                className={`p-2 rounded-lg ${
                                  isDark 
                                    ? 'hover:bg-white/10' 
                                    : 'hover:bg-gray-100'
                                } transition-colors`}
                              >
                                <MoreVertical className={`w-5 h-5 ${textSecondary}`} />
                              </motion.button>
                              
                              <AnimatePresence>
                                {activeActionMenu === invoice.id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    className={`absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden shadow-2xl ${glassCard} z-50`}
                                  >
                                    <button 
                                      onClick={() => handleViewDetails(invoice)}
                                      className={`w-full px-4 py-3 text-left text-sm font-semibold flex items-center gap-3 ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-50'} transition-colors`}
                                    >
                                      <Eye className="w-4 h-4" />
                                      View Details
                                    </button>
                                    <button 
                                      onClick={() => handleCopyPaymentLink(invoice)}
                                      className={`w-full px-4 py-3 text-left text-sm font-semibold flex items-center gap-3 ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-50'} transition-colors`}
                                    >
                                      <Link2 className="w-4 h-4" />
                                      Copy payment link
                                    </button>
                                    <button 
                                      onClick={() => handleDuplicate(invoice)}
                                      className={`w-full px-4 py-3 text-left text-sm font-semibold flex items-center gap-3 ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-50'} transition-colors`}
                                    >
                                      <Copy className="w-4 h-4" />
                                      Duplicate
                                    </button>
                                    <button 
                                      onClick={() => handleSendReminder(invoice)}
                                      className={`w-full px-4 py-3 text-left text-sm font-semibold flex items-center gap-3 ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-50'} transition-colors`}
                                    >
                                      <Send className="w-4 h-4" />
                                      Send Reminder
                                    </button>
                                    <button 
                                      onClick={() => handleEdit(invoice)}
                                      className={`w-full px-4 py-3 text-left text-sm font-semibold flex items-center gap-3 ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-50'} transition-colors`}
                                    >
                                      <Edit className="w-4 h-4" />
                                      Edit
                                    </button>
                                    <button 
                                      onClick={() => handleDelete(invoice.id)}
                                      className={`w-full px-4 py-3 text-left text-sm font-semibold flex items-center gap-3 text-red-400 hover:bg-red-500/10 transition-colors border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Footer */}
              <div className={`px-6 py-5 border-t ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50/80'} flex items-center justify-between`}>
                <p className={`text-sm ${textSecondary}`}>
                  Showing <span className="font-bold">{filteredInvoices.length}</span> of <span className="font-bold">{invoices.length}</span> invoices
                </p>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg text-sm font-bold ${
                      isDark 
                        ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10' 
                        : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200'
                    } transition-all`}
                  >
                    Previous
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] text-white shadow-lg shadow-[#FF1CF7]/30 hover:shadow-[#FF1CF7]/50 transition-all`}
                  >
                    Next
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <InvoiceDetailModal
          isDark={isDark}
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}