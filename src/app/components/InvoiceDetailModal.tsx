import { useState } from 'react';
import { X, Calendar, DollarSign, Copy, CheckCircle2, Clock, AlertCircle, ExternalLink, Download, Send, Link2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InvoiceDetailModalProps {
  isDark: boolean;
  invoice: {
    id: string;
    invoiceId?: string;
    client: string;
    clientEmail?: string;
    amount: string;
    token: string;
    split: string;
    status: string;
    date?: string;
    dueDate?: string;
    createdDate?: string;
    txHash?: string;
  } | null;
  onClose: () => void;
  onSendReminder?: (invoiceId: string) => void | Promise<void>;
}

export default function InvoiceDetailModal({ isDark, invoice, onClose, onSendReminder }: InvoiceDetailModalProps) {
  const [sendingReminder, setSendingReminder] = useState(false);
  const [reminderSent, setReminderSent] = useState(false);

  if (!invoice) return null;

  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-500';
  
  const glassCard = isDark 
    ? 'bg-gradient-to-br from-[#1a1a24]/95 to-[#16161f]/95 backdrop-blur-2xl border border-white/10' 
    : 'bg-white/95 backdrop-blur-2xl border border-gray-200/50';

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'paid':
        return isDark 
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
          : 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'deployed':
      case 'pending':
        return isDark 
          ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' 
          : 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'overdue':
        return isDark 
          ? 'bg-red-500/10 text-red-400 border-red-500/20' 
          : 'bg-red-50 text-red-600 border-red-200';
      case 'draft':
        return isDark 
          ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' 
          : 'bg-gray-100 text-gray-600 border-gray-300';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'paid':
        return CheckCircle2;
      case 'deployed':
      case 'pending':
        return Clock;
      case 'overdue':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const explorerTxUrl = invoice.txHash
    ? `https://shadownet.explorer.etherlink.com/tx/${invoice.txHash.startsWith('0x') ? invoice.txHash : '0x' + invoice.txHash}`
    : null;

  const StatusIcon = getStatusIcon(invoice.status);
  const displayInvoiceId = invoice.invoiceId || invoice.id;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className={`absolute inset-0 ${isDark ? 'bg-black/80' : 'bg-black/50'} backdrop-blur-sm`}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`relative w-full max-w-2xl ${glassCard} rounded-2xl shadow-2xl overflow-hidden`}
        >
          {/* Header */}
          <div className={`px-6 py-5 border-b ${isDark ? 'border-white/10' : 'border-gray-200'} flex items-center justify-between`}>
            <div>
              <h2 className={`text-2xl font-bold ${textPrimary}`}>Invoice Details</h2>
              <p className={`text-sm ${textSecondary} mt-1`}>Complete invoice information</p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors`}
            >
              <X className={`w-5 h-5 ${textSecondary}`} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
            {/* Invoice ID & Status */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2 min-w-0">
                <div>
                  <p className={`text-sm font-semibold ${textMuted} mb-1`}>Invoice ID</p>
                  <div className="flex items-center gap-2">
                    <p className={`text-2xl font-mono font-bold ${textPrimary}`}>{displayInvoiceId}</p>
                    <button
                      onClick={() => copyToClipboard(displayInvoiceId)}
                      className={`p-1.5 rounded-lg flex-shrink-0 ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors`}
                    >
                      <Copy className={`w-4 h-4 ${textMuted}`} />
                    </button>
                  </div>
                </div>
              </div>
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border flex-shrink-0 ${getStatusColor(invoice.status)}`}>
                <StatusIcon className="w-4 h-4" />
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </span>
            </div>

            {/* Client Info */}
            <div className={`${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-xl p-5 mb-6`}>
              <p className={`text-xs font-bold uppercase tracking-wider ${textMuted} mb-3`}>Client Information</p>
              <p className={`text-lg font-bold ${textPrimary} mb-1`}>{invoice.client}</p>
              {invoice.clientEmail && (
                <p className={`text-sm ${textSecondary}`}>{invoice.clientEmail}</p>
              )}
            </div>

            {/* Amount Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className={`${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-xl p-5`}>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className={`w-4 h-4 ${textMuted}`} />
                  <p className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Amount</p>
                </div>
                <p className={`text-2xl font-bold ${textPrimary}`}>{invoice.amount}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                    isDark 
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' 
                      : 'bg-cyan-50 text-cyan-600 border-cyan-200'
                  }`}>
                    {invoice.token}
                  </span>
                </div>
              </div>

              <div className={`${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-xl p-5`}>
                <p className={`text-xs font-bold uppercase tracking-wider ${textMuted} mb-2`}>Revenue Split</p>
                <p className={`text-2xl font-bold ${textPrimary}`}>{invoice.split}</p>
                <p className={`text-xs ${textMuted} mt-2`}>You receive after platform fee</p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {(invoice.createdDate || invoice.date) && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className={`w-4 h-4 ${textMuted}`} />
                    <p className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Created</p>
                  </div>
                  <p className={`text-sm font-semibold ${textPrimary}`}>{invoice.createdDate || invoice.date}</p>
                </div>
              )}
              {invoice.dueDate && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className={`w-4 h-4 ${textMuted}`} />
                    <p className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>Due Date</p>
                  </div>
                  <p className={`text-sm font-semibold ${textPrimary}`}>{invoice.dueDate}</p>
                </div>
              )}
            </div>

            {/* Transaction Hash */}
            {invoice.txHash && invoice.txHash !== 'Pending...' && invoice.txHash !== 'Not paid' && (
              <div className={`${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-xl p-5`}>
                <p className={`text-xs font-bold uppercase tracking-wider ${textMuted} mb-3`}>Transaction Hash</p>
                <div className="flex items-center gap-3 min-w-0">
                  <p className={`text-sm font-mono ${textPrimary} break-all flex-1 min-w-0`}>{invoice.txHash}</p>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => copyToClipboard(invoice.txHash || '')}
                      className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors`}
                      title="Copy hash"
                    >
                      <Copy className={`w-4 h-4 ${textMuted}`} />
                    </button>
                    {explorerTxUrl && (
                      <a
                        href={explorerTxUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors`}
                        title="View on explorer"
                      >
                        <ExternalLink className={`w-4 h-4 ${textMuted}`} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Payment link for payer */}
            {invoice.id && (
              <div className={`${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-xl p-5`}>
                <p className={`text-xs font-bold uppercase tracking-wider ${textMuted} mb-3`}>Payment link</p>
                <p className={`text-xs ${textSecondary} mb-3`}>Share this link with the client to pay the invoice.</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => copyToClipboard(`${typeof window !== 'undefined' ? window.location.origin : ''}/checkout?id=${invoice.id}`)}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 border ${
                      isDark ? 'border-white/20 hover:bg-white/10 text-white' : 'border-gray-300 hover:bg-gray-100 text-gray-900'
                    } transition-colors`}
                  >
                    <Copy className="w-4 h-4" />
                    Copy payment link
                  </button>
                  <a
                    href={`${typeof window !== 'undefined' ? window.location.origin : ''}/checkout?id=${invoice.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 border ${
                      isDark ? 'border-[#FF1CF7]/30 hover:bg-[#FF1CF7]/10 text-[#FF1CF7]' : 'border-pink-300 hover:bg-pink-50 text-pink-600'
                    } transition-colors`}
                  >
                    <Link2 className="w-4 h-4" />
                    Open payment page
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className={`px-6 py-4 border-t ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'} flex gap-3`}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border ${
                isDark 
                  ? 'border-white/10 hover:border-white/20 text-white hover:bg-white/5' 
                  : 'border-gray-300 hover:border-gray-400 text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Download className="w-4 h-4" />
              Download PDF
            </motion.button>
            <motion.button
              whileHover={!(sendingReminder || reminderSent) ? { scale: 1.02 } : {}}
              whileTap={!(sendingReminder || reminderSent) ? { scale: 0.98 } : {}}
              disabled={sendingReminder || reminderSent || invoice.status === 'Paid'}
              onClick={async () => {
                if (!onSendReminder || invoice.status === 'Paid') return;
                setSendingReminder(true);
                try {
                  await onSendReminder(invoice.id);
                  setReminderSent(true);
                } finally {
                  setSendingReminder(false);
                }
              }}
              className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                sendingReminder || reminderSent || invoice.status === 'Paid'
                  ? isDark ? 'bg-white/10 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] text-white shadow-lg shadow-[#FF1CF7]/30 hover:shadow-[#FF1CF7]/50'
              }`}
            >
              {sendingReminder ? <Loader2 className="w-4 h-4 animate-spin" /> : reminderSent ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              {sendingReminder ? 'Sending…' : reminderSent ? 'Reminder sent' : 'Send Reminder'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
