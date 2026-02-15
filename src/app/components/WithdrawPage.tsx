import { useState } from 'react';
import {
  ArrowLeft,
  Wallet,
  DollarSign,
  Clock,
  Zap,
  Shield,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  TrendingUp,
  Lock,
  ChevronDown,
  ArrowRight,
  XCircle,
  Info,
  Search,
  Download,
  Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getContract } from 'thirdweb';
import { prepareContractCall } from 'thirdweb';
import { useReadContract, useSendTransaction } from 'thirdweb/react';
import { etherlinkShadownet, thirdwebClient } from '../../client';
import { INVOICE_PAYMENTS_ADDRESS, INVOICE_PAYMENTS_ABI, USDC_ADDRESS } from '../../contract';

interface WithdrawPageProps {
  isDark: boolean;
  walletAddress: string;
  onBack: () => void;
}

type TransactionState = 'idle' | 'confirming' | 'processing' | 'success' | 'failed';

interface WithdrawalHistory {
  id: string;
  date: string;
  amount: string;
  token: string;
  destination: string;
  txHash: string;
  status: 'Confirmed' | 'Pending' | 'Failed';
}

const USDC_DECIMALS = 6;

export default function WithdrawPage({ isDark, walletAddress, onBack }: WithdrawPageProps) {
  const [transactionState, setTransactionState] = useState<TransactionState>('idle');
  const [selectedToken, setSelectedToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [destinationAddress, setDestinationAddress] = useState(walletAddress);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [copiedTxHash, setCopiedTxHash] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  const contract = getContract({
    client: thirdwebClient,
    chain: etherlinkShadownet,
    address: INVOICE_PAYMENTS_ADDRESS as `0x${string}`,
    abi: INVOICE_PAYMENTS_ABI,
  });

  const { data: balanceWei } = useReadContract({
    contract,
    method: 'function balances(address, address) view returns (uint256)',
    params: [walletAddress as `0x${string}`, (USDC_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`],
  });
  const balanceFormatted =
    balanceWei !== undefined && balanceWei !== null
      ? (Number(balanceWei) / 10 ** USDC_DECIMALS).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : null;
  const availableBalance = balanceFormatted ?? '—';
  const pendingSettlement = '—';
  const platformFees = '—';
  const networkFee = '~0.12';
  const { mutate: sendTransaction } = useSendTransaction();

  const withdrawalHistory: WithdrawalHistory[] = [
    {
      id: '1',
      date: 'Feb 12, 2026 14:32',
      amount: '5,000.00',
      token: 'USDC',
      destination: '0x742d35...f0Aa4f',
      txHash: '0x7a8f9c2d...4b3e1a5f',
      status: 'Confirmed'
    },
    {
      id: '2',
      date: 'Feb 10, 2026 09:15',
      amount: '3,250.50',
      token: 'USDC',
      destination: '0x8e3b42...a2Bb5e',
      txHash: '0x2b7c4e1a...8f6d9c3b',
      status: 'Confirmed'
    },
    {
      id: '3',
      date: 'Feb 08, 2026 16:48',
      amount: '1,850.00',
      token: 'USDT',
      destination: '0x742d35...f0Aa4f',
      txHash: '0x9d3f5a8b...7c2e4f1a',
      status: 'Confirmed'
    },
    {
      id: '4',
      date: 'Feb 05, 2026 11:22',
      amount: '7,500.00',
      token: 'USDC',
      destination: '0x5f9a21...d8Cc3a',
      txHash: '0x4e8b2f5c...3a9d1e7f',
      status: 'Pending'
    },
  ];

  // Styles
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-500';
  
  const glassCard = isDark 
    ? 'bg-gradient-to-br from-[#1a1a24]/90 to-[#16161f]/90 backdrop-blur-2xl border border-white/10' 
    : 'bg-white/90 backdrop-blur-2xl border border-gray-200/50';

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const handleMaxClick = () => {
    if (balanceFormatted) setAmount(balanceFormatted.replace(/,/g, ''));
  };

  const handleWithdraw = () => {
    if (!USDC_ADDRESS || !USDC_ADDRESS.startsWith('0x')) {
      setWithdrawError('Set VITE_USDC_ADDRESS in .env.');
      return;
    }
    const amountNum = parseFloat(amount.replace(/,/g, ''));
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setWithdrawError('Enter a valid amount.');
      return;
    }
    const balanceNum = balanceWei != null ? Number(balanceWei) / 10 ** USDC_DECIMALS : 0;
    if (amountNum > balanceNum) {
      setWithdrawError('Insufficient balance.');
      return;
    }
    setWithdrawError(null);
    setTransactionState('confirming');
    const amountWei = BigInt(Math.round(amountNum * 10 ** USDC_DECIMALS));
    const tx = prepareContractCall({
      contract,
      method: 'function withdraw(address token, uint256 amount)',
      params: [USDC_ADDRESS as `0x${string}`, amountWei],
    });
    sendTransaction(tx, {
      onSuccess: (result) => {
        setTransactionHash(result.transactionHash ?? '');
        setTransactionState('success');
      },
      onError: (err) => {
        setWithdrawError(err?.message ?? 'Withdrawal failed.');
        setTransactionState('failed');
      },
    });
  };

  const handleRetry = () => {
    setTransactionState('idle');
    setTransactionHash('');
    setWithdrawError(null);
  };

  const copyTxHash = async (hash: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(hash);
        setCopiedTxHash(hash);
        setTimeout(() => setCopiedTxHash(''), 2000);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = hash;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          setCopiedTxHash(hash);
          setTimeout(() => setCopiedTxHash(''), 2000);
        } catch (err) {
          console.error('Copy failed:', err);
        }
        document.body.removeChild(textarea);
      }
    } catch (err) {
      console.error('Clipboard API failed:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'Pending':
        return isDark ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'Failed':
        return isDark ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-200';
      default:
        return '';
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0d0818]' : 'bg-gray-50'}`}>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 xl:p-12">
        {/* Header with Back Button */}
        <div className="mb-6 md:mb-8">
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className={`flex items-center gap-2 ${textSecondary} hover:${textPrimary} transition-colors mb-4 md:mb-6 font-semibold text-sm md:text-base`}
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            Back to Dashboard
          </motion.button>
          
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold ${textPrimary} mb-2 tracking-tight`}>
                Withdraw Funds
              </h1>
              <p className={`text-sm md:text-base ${textSecondary} mb-4`}>
                Transfer your available stablecoin balance to your wallet
              </p>
              
              {/* Etherlink Network Badge */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF1CF7]/10 to-[#B967FF]/10 border border-[#FF1CF7]/20 w-fit">
                <Zap className="w-4 h-4 text-[#FF1CF7]" />
                <span className="text-sm font-bold text-[#FF1CF7]">Etherlink Network</span>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`px-5 py-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-100'} border ${isDark ? 'border-white/10' : 'border-gray-200'}`}
            >
              <p className={`text-xs ${textMuted} mb-1`}>Connected Wallet</p>
              <p className={`text-sm font-mono font-bold ${textPrimary}`}>
                {truncateAddress(walletAddress)}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Available Balance Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Available to Withdraw */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${glassCard} rounded-3xl p-6 shadow-xl relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF1CF7]/20 to-transparent rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF1CF7] to-[#B967FF] flex items-center justify-center shadow-lg shadow-[#FF1CF7]/30">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div className={`px-3 py-1 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-100'} text-xs font-bold ${textMuted}`}>
                  USDC
                </div>
              </div>
              <h3 className={`text-sm font-semibold ${textMuted} mb-2`}>
                Available to Withdraw
              </h3>
              <p className={`text-3xl font-bold ${textPrimary} mb-3`}>
                ${availableBalance}
              </p>
              <p className={`text-xs ${textMuted}`}>
                Last updated: Just now
              </p>
            </div>
          </motion.div>

          {/* Pending Settlement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${glassCard} rounded-3xl p-6 shadow-xl relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg shadow-yellow-400/30">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className={`px-3 py-1 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-100'} text-xs font-bold ${textMuted}`}>
                  USDC
                </div>
              </div>
              <h3 className={`text-sm font-semibold ${textMuted} mb-2`}>
                Pending Settlement
              </h3>
              <p className={`text-3xl font-bold ${textPrimary} mb-3`}>
                ${pendingSettlement}
              </p>
              <p className={`text-xs ${textMuted}`}>
                Last updated: 5 mins ago
              </p>
            </div>
          </motion.div>

          {/* Platform Fees Accrued */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${glassCard} rounded-3xl p-6 shadow-xl relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center shadow-lg shadow-cyan-400/30">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className={`px-3 py-1 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-100'} text-xs font-bold ${textMuted}`}>
                  USDC
                </div>
              </div>
              <h3 className={`text-sm font-semibold ${textMuted} mb-2`}>
                Platform Fees Accrued
              </h3>
              <p className={`text-3xl font-bold ${textPrimary} mb-3`}>
                ${platformFees}
              </p>
              <p className={`text-xs ${textMuted}`}>
                Last updated: 1 hour ago
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Withdraw Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <AnimatePresence mode="wait">
              {transactionState === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`${glassCard} rounded-3xl p-12 shadow-2xl text-center`}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shadow-2xl shadow-emerald-400/50"
                  >
                    <Check className="w-12 h-12 text-white" strokeWidth={3} />
                  </motion.div>

                  <h2 className={`text-3xl font-bold ${textPrimary} mb-3`}>
                    Withdrawal Successful
                  </h2>
                  <p className={`text-base ${textSecondary} mb-8`}>
                    Your funds have been transferred successfully
                  </p>

                  <div className={`p-6 rounded-2xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'} mb-8`}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${textMuted}`}>Transaction Hash</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-mono font-semibold ${textPrimary}`}>
                            {transactionHash}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => copyTxHash(transactionHash)}
                            className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'} transition-colors`}
                          >
                            {copiedTxHash === transactionHash ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className={`w-4 h-4 ${textSecondary}`} />
                            )}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'} transition-colors`}
                          >
                            <ExternalLink className={`w-4 h-4 ${textSecondary}`} />
                          </motion.button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${textMuted}`}>Amount Withdrawn</span>
                        <span className={`text-lg font-bold ${textPrimary}`}>
                          ${amount} {selectedToken}
                        </span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setTransactionState('idle'); setWithdrawError(null); setAmount(''); }}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] font-bold text-white shadow-lg shadow-[#FF1CF7]/30 hover:shadow-[#FF1CF7]/50 transition-all"
                  >
                    Make Another Withdrawal
                  </motion.button>
                </motion.div>
              ) : transactionState === 'failed' ? (
                <motion.div
                  key="failed"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`${glassCard} rounded-3xl p-12 shadow-2xl text-center`}
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-400 to-pink-400 flex items-center justify-center shadow-2xl shadow-red-400/50">
                    <XCircle className="w-12 h-12 text-white" strokeWidth={3} />
                  </div>

                  <h2 className={`text-3xl font-bold ${textPrimary} mb-3`}>
                    Withdrawal Failed
                  </h2>
                  <p className={`text-base ${textSecondary} mb-8`}>
                    {withdrawError || 'The transaction was rejected or failed.'}
                  </p>

                  <div className="flex gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleRetry}
                      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] font-bold text-white shadow-lg shadow-[#FF1CF7]/30 hover:shadow-[#FF1CF7]/50 transition-all"
                    >
                      Try Again
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`${glassCard} rounded-3xl p-8 shadow-2xl`}
                >
                  <h2 className={`text-2xl font-bold ${textPrimary} mb-6`}>
                    Withdrawal Details
                  </h2>
                  {withdrawError && (
                    <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${isDark ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <p className={`text-sm font-semibold ${isDark ? 'text-red-400' : 'text-red-700'}`}>{withdrawError}</p>
                    </div>
                  )}
                  <div className="space-y-6">
                    {/* Token Selection */}
                    <div>
                      <label className={`block text-sm font-semibold ${textPrimary} mb-3`}>
                        Select Token
                      </label>
                      <div className="relative">
                        <select
                          value={selectedToken}
                          onChange={(e) => setSelectedToken(e.target.value)}
                          className={`w-full px-5 py-4 rounded-2xl appearance-none ${
                            isDark 
                              ? 'bg-white/5 border border-white/10 text-white' 
                              : 'bg-gray-50 border border-gray-200 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-[#FF1CF7]/50 transition-all font-semibold cursor-pointer`}
                        >
                          <option value="USDC">USDC - USD Coin</option>
                          <option value="USDT">USDT - Tether</option>
                          <option value="DAI">DAI - Dai Stablecoin</option>
                        </select>
                        <ChevronDown className={`absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 ${textMuted} pointer-events-none`} />
                      </div>
                    </div>

                    {/* Amount Input */}
                    <div>
                      <label className={`block text-sm font-semibold ${textPrimary} mb-3`}>
                        Withdrawal Amount
                      </label>
                      <div className="relative">
                        <DollarSign className={`absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 ${textMuted}`} />
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          disabled={transactionState !== 'idle'}
                          className={`w-full pl-14 pr-24 py-6 rounded-2xl text-2xl font-bold ${
                            isDark 
                              ? 'bg-white/5 border border-white/10 text-white placeholder-gray-600' 
                              : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                          } focus:outline-none focus:ring-2 focus:ring-[#FF1CF7]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleMaxClick}
                          disabled={transactionState !== 'idle'}
                          className={`absolute right-5 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                            isDark 
                              ? 'bg-[#FF1CF7]/20 text-[#FF1CF7] hover:bg-[#FF1CF7]/30 border border-[#FF1CF7]/30' 
                              : 'bg-pink-50 text-pink-600 hover:bg-pink-100 border border-pink-200'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          MAX
                        </motion.button>
                      </div>
                      <div className="flex items-center justify-between mt-3 px-1">
                        <p className={`text-sm ${textMuted}`}>
                          Available: <span className={`font-bold ${textPrimary}`}>${availableBalance}</span>
                        </p>
                        <p className={`text-sm ${textMuted}`}>
                          Network Fee: <span className={`font-semibold ${textSecondary}`}>~${networkFee}</span>
                        </p>
                      </div>
                    </div>

                    {/* Destination Address */}
                    <div>
                      <label className={`block text-sm font-semibold ${textPrimary} mb-3`}>
                        Destination Address
                      </label>
                      {isEditingAddress ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={destinationAddress}
                            onChange={(e) => setDestinationAddress(e.target.value)}
                            placeholder="0x..."
                            className={`w-full px-5 py-4 rounded-2xl font-mono ${
                              isDark 
                                ? 'bg-white/5 border border-white/10 text-white placeholder-gray-600' 
                                : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                            } focus:outline-none focus:ring-2 focus:ring-[#FF1CF7]/50 transition-all`}
                          />
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsEditingAddress(false)}
                            className={`text-sm font-semibold ${textSecondary} hover:${textPrimary} transition-colors`}
                          >
                            Use my connected wallet
                          </motion.button>
                        </div>
                      ) : (
                        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-4 sm:p-5 rounded-2xl ${
                          isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'
                        }`}>
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <Wallet className={`w-4 h-4 sm:w-5 sm:h-5 ${textMuted} flex-shrink-0`} />
                            <span className={`font-mono font-semibold ${textPrimary} text-xs sm:text-sm truncate`}>
                              {truncateAddress(destinationAddress)}
                            </span>
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold flex-shrink-0 ${
                              isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                            }`}>
                              Your Wallet
                            </span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsEditingAddress(true)}
                            className={`text-sm font-semibold ${textSecondary} hover:${textPrimary} transition-colors flex-shrink-0`}
                          >
                            Edit
                          </motion.button>
                        </div>
                      )}
                    </div>

                    {/* Transaction Summary */}
                    {amount && parseFloat(amount) > 0 && transactionState === 'idle' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-6 rounded-2xl ${
                          isDark ? 'bg-gradient-to-br from-[#FF1CF7]/10 to-[#B967FF]/10 border border-[#FF1CF7]/20' : 'bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200'
                        }`}
                      >
                        <h3 className={`text-sm font-bold ${textPrimary} mb-4 flex items-center gap-2`}>
                          <CheckCircle2 className="w-4 h-4 text-[#FF1CF7]" />
                          Withdrawal Summary
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${textSecondary}`}>Amount</span>
                            <span className={`text-base font-bold ${textPrimary}`}>
                              ${amount} {selectedToken}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${textSecondary}`}>Network Fee</span>
                            <span className={`text-sm font-semibold ${textSecondary}`}>
                              ~${networkFee}
                            </span>
                          </div>
                          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                            <span className={`text-base font-bold ${textPrimary}`}>You'll Receive</span>
                            <span className={`text-xl font-bold ${textPrimary}`}>
                              ${(parseFloat(amount) - parseFloat(networkFee)).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Transaction States */}
                    {transactionState === 'confirming' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-6 rounded-2xl ${isDark ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-yellow-50 border border-yellow-200'} flex items-center gap-4`}
                      >
                        <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
                        <div>
                          <p className={`font-bold ${textPrimary} mb-1`}>
                            Waiting for wallet confirmation
                          </p>
                          <p className={`text-sm ${textMuted}`}>
                            Please approve the transaction in your wallet
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {transactionState === 'processing' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-6 rounded-2xl ${isDark ? 'bg-[#FF1CF7]/10 border border-[#FF1CF7]/20' : 'bg-pink-50 border border-pink-200'} flex items-center gap-4`}
                      >
                        <Loader2 className="w-6 h-6 text-[#FF1CF7] animate-spin" />
                        <div>
                          <p className={`font-bold ${textPrimary} mb-1`}>
                            Processing withdrawal
                          </p>
                          <p className={`text-sm ${textMuted}`}>
                            Transaction submitted. Waiting for confirmation...
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Confirm Withdrawal Button */}
                    {transactionState === 'idle' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleWithdraw}
                        disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(availableBalance.replace(',', ''))}
                        className={`w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-bold text-white shadow-xl transition-all text-base ${
                          amount && parseFloat(amount) > 0 && parseFloat(amount) <= parseFloat(availableBalance.replace(',', ''))
                            ? 'bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] shadow-[#FF1CF7]/40 hover:shadow-[#FF1CF7]/60'
                            : 'bg-gray-400 cursor-not-allowed opacity-50'
                        }`}
                      >
                        <Shield className="w-5 h-5" />
                        Confirm Withdrawal
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Security Section */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* Security & Transparency */}
            <div className={`${glassCard} rounded-2xl p-6 shadow-xl`}>
              <h3 className={`text-lg font-bold ${textPrimary} mb-4 flex items-center gap-2`}>
                <Shield className="w-5 h-5 text-[#FF1CF7]" />
                Security & Transparency
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-100'} flex items-center justify-center flex-shrink-0`}>
                    <Lock className={`w-5 h-5 ${textSecondary}`} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${textPrimary} mb-1`}>Non-Custodial</h4>
                    <p className={`text-xs ${textMuted} leading-relaxed`}>
                      Your funds go directly to your wallet. StableLink never holds your assets.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-100'} flex items-center justify-center flex-shrink-0`}>
                    <Zap className={`w-5 h-5 ${textSecondary}`} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${textPrimary} mb-1`}>Etherlink Recording</h4>
                    <p className={`text-xs ${textMuted} leading-relaxed`}>
                      All withdrawals are recorded on Etherlink blockchain for full transparency.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-100'} flex items-center justify-center flex-shrink-0`}>
                    <CheckCircle2 className={`w-5 h-5 ${textSecondary}`} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${textPrimary} mb-1`}>Instant Settlement</h4>
                    <p className={`text-xs ${textMuted} leading-relaxed`}>
                      Withdrawals are processed instantly with low network fees on Etherlink.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className={`${glassCard} rounded-2xl p-6 shadow-xl`}>
              <h3 className={`text-sm font-bold ${textPrimary} mb-4`}>Quick Stats</h3>
              
              <div className="space-y-4">
                <div>
                  <p className={`text-xs ${textMuted} mb-1`}>Total Withdrawn (30d)</p>
                  <p className={`text-xl font-bold ${textPrimary}`}>$47,250.50</p>
                </div>
                
                <div>
                  <p className={`text-xs ${textMuted} mb-1`}>Avg. Withdrawal Time</p>
                  <p className={`text-xl font-bold ${textPrimary}`}>~15 seconds</p>
                </div>
                
                <div>
                  <p className={`text-xs ${textMuted} mb-1`}>Total Network Fees Paid</p>
                  <p className={`text-xl font-bold ${textPrimary}`}>$2.48</p>
                </div>
              </div>
            </div>

            {/* Info Banner */}
            <div className={`p-5 rounded-2xl ${isDark ? 'bg-[#FF1CF7]/10 border border-[#FF1CF7]/20' : 'bg-pink-50 border border-pink-200'}`}>
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[#FF1CF7] flex-shrink-0 mt-0.5" />
                <div>
                  <p className={`text-xs font-semibold ${textPrimary} mb-1`}>Low Fees on Etherlink</p>
                  <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    Etherlink's infrastructure enables ultra-low withdrawal fees, typically under $0.15.
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Withdrawal History Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`${glassCard} rounded-3xl p-8 shadow-2xl mt-8`}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0 mb-6">
            <div>
              <h2 className={`text-xl sm:text-2xl font-bold ${textPrimary} mb-1`}>
                Withdrawal History
              </h2>
              <p className={`text-xs sm:text-sm ${textSecondary}`}>
                All your past withdrawals and their status
              </p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-initial">
                <Search className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${textMuted}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className={`w-full lg:w-auto pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 rounded-xl text-sm ${
                    isDark 
                      ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500' 
                      : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-[#FF1CF7]/50 transition-all`}
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2.5 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-colors flex-shrink-0`}
              >
                <Filter className={`w-4 h-4 ${textSecondary}`} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2.5 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-colors flex-shrink-0`}
              >
                <Download className={`w-4 h-4 ${textSecondary}`} />
              </motion.button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                  <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                    Date
                  </th>
                  <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                    Amount
                  </th>
                  <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                    Token
                  </th>
                  <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                    Destination
                  </th>
                  <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                    Tx Hash
                  </th>
                  <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${textMuted}`}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {withdrawalHistory.map((withdrawal, index) => (
                  <motion.tr
                    key={withdrawal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className={`border-b ${isDark ? 'border-white/5' : 'border-gray-100'} hover:${isDark ? 'bg-white/5' : 'bg-gray-50'} transition-colors`}
                  >
                    <td className={`py-4 px-4 text-sm font-medium ${textSecondary}`}>
                      {withdrawal.date}
                    </td>
                    <td className={`py-4 px-4 text-sm font-bold ${textPrimary}`}>
                      ${withdrawal.amount}
                    </td>
                    <td className={`py-4 px-4`}>
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        isDark ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-cyan-50 text-cyan-600 border border-cyan-200'
                      }`}>
                        {withdrawal.token}
                      </span>
                    </td>
                    <td className={`py-4 px-4 text-sm font-mono font-semibold ${textSecondary}`}>
                      {withdrawal.destination}
                    </td>
                    <td className={`py-4 px-4`}>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-mono font-semibold ${textSecondary}`}>
                          {withdrawal.txHash}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => copyTxHash(withdrawal.txHash)}
                          className={`p-1 rounded ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'} transition-colors`}
                        >
                          {copiedTxHash === withdrawal.txHash ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className={`w-3.5 h-3.5 ${textMuted}`} />
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`p-1 rounded ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'} transition-colors`}
                        >
                          <ExternalLink className={`w-3.5 h-3.5 ${textMuted}`} />
                        </motion.button>
                      </div>
                    </td>
                    <td className={`py-4 px-4`}>
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${getStatusColor(withdrawal.status)}`}>
                        {withdrawal.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}