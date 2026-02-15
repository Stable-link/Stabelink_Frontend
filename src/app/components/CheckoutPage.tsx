import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useModeAnimation } from 'react-theme-switch-animation';
import { useActiveAccount, useConnectModal, useSendTransaction, useSwitchActiveWalletChain } from 'thirdweb/react';
import { getContract, prepareContractCall, waitForReceipt } from 'thirdweb';
import { etherlinkShadownet } from '../../client';
import { thirdwebClient } from '../../client';
import { getPublicInvoice, type PublicInvoice } from '../../api';
import {
  INVOICE_PAYMENTS_ADDRESS,
  INVOICE_PAYMENTS_ABI,
  USDC_ADDRESS,
  ERC20_ABI,
} from '../../contract';
import {
  Check,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Shield,
  Zap,
  Loader2,
  Wallet,
  ExternalLink,
  Copy,
  Sun,
  Moon,
  ArrowRight,
  ArrowLeft,
  Lock,
  Globe,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import svgPaths from '../../imports/svg-1rf4lkm0ba';

const USDC_DECIMALS = 6;
const EXPLORER_TX_URL = 'https://shadownet.explorer.etherlink.com/tx';

function friendlyPayError(raw: string): string {
  if (!raw || typeof raw !== 'string') return 'Payment failed. Try approving USDC spend first, then Pay again.';
  const s = raw.toLowerCase();
  if (s.includes('alreadypaid')) return 'This invoice has already been paid.';
  if (s.includes('cancelled')) return 'This invoice was cancelled.';
  if (s.includes('invoicenotfound')) return 'Invoice not found on chain.';
  // ABI decode errors, unknown selectors, allowance/balance failures
  if (
    s.includes('encoded error') ||
    s.includes('not found on abi') ||
    s.includes('signature') && s.includes('0x') ||
    s.includes('insufficient') ||
    s.includes('allowance') ||
    s.includes('decodeerrorresult') ||
    s.includes('viem')
  ) {
    return 'Payment failed. First approve USDC spend (wallet will ask once), then click Pay again. Ensure you have enough USDC.';
  }
  return raw;
}

interface CheckoutPageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

type PaymentState = 'disconnected' | 'connected' | 'loading' | 'processing' | 'success' | 'failed';

// Looper Background - more subtle for checkout
function LooperBg({ isDark }: { isDark: boolean }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isDark ? 0.08 : 0.15, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[2295.766px] h-[2037.845px] pointer-events-none scale-50 lg:scale-75 transition-all duration-1000 blur-3xl ${isDark ? 'opacity-[0.08]' : 'opacity-[0.15]'}`}
    >
      <svg 
        className="block size-full" 
        fill="none" 
        preserveAspectRatio="none" 
        viewBox="0 0 2295.77 2037.85"
      >
        <g>
          <path d={svgPaths.p161a3400} opacity="0" stroke="url(#checkpaint0)" strokeWidth="4" />
          <path d={svgPaths.p18534700} opacity="0.0144928" stroke="url(#checkpaint1)" strokeWidth="4" />
          <path d={svgPaths.pd4fde80} opacity="0.0289855" stroke="url(#checkpaint2)" strokeWidth="4" />
          <path d={svgPaths.p19160880} opacity="0.0434783" stroke="url(#checkpaint3)" strokeWidth="4" />
          <path d={svgPaths.p240c4c00} opacity="0.057971" stroke="url(#checkpaint4)" strokeWidth="4" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="checkpaint0" x1="1965.81" x2="1039.89" y1="1728.06" y2="463.22">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="checkpaint1" x1="1914.98" x2="1062.42" y1="1748.96" y2="416.152">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="checkpaint2" x1="1863.98" x2="1093.65" y1="1767.47" y2="370.68">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="checkpaint3" x1="1812.93" x2="1133.64" y1="1783.61" y2="328.475">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="checkpaint4" x1="1761.9" x2="1182.1" y1="1797.39" y2="291.319">
            <stop stopColor="#FF1CF7" />
            <stop offset="1" stopColor="#00F0FF" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

export default function CheckoutPage({ isDark, toggleTheme }: CheckoutPageProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const invoiceIdFromUrl = searchParams.get('id');

  const [invoice, setInvoice] = useState<PublicInvoice | null>(null);
  const [invoiceError, setInvoiceError] = useState<string | null>(null);
  const [invoiceLoading, setInvoiceLoading] = useState(true);
  const [paymentState, setPaymentState] = useState<PaymentState>('disconnected');
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [walletBalance, setWalletBalance] = useState<string>('');
  const [transactionHash, setTransactionHash] = useState('');
  const [payError, setPayError] = useState<string | null>(null);
  const [switchError, setSwitchError] = useState<string | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);

  const account = useActiveAccount();
  const { connect: openConnectModal } = useConnectModal();
  const { mutate: sendTransaction, isPending: isTxPending } = useSendTransaction();
  const switchChain = useSwitchActiveWalletChain();

  const chainId = account?.chain?.id;
  const isEtherlink = Number(chainId) === 127823;

  useEffect(() => {
    if (!invoiceIdFromUrl) {
      setInvoiceError('No invoice specified. Use a payment link from the merchant.');
      setInvoiceLoading(false);
      return;
    }
    setInvoiceLoading(true);
    setInvoiceError(null);
    getPublicInvoice(invoiceIdFromUrl)
      .then((data) => {
        setInvoice(data);
        setInvoiceError(null);
      })
      .catch((e) => {
        setInvoice(null);
        setInvoiceError(e instanceof Error ? e.message : 'Invoice not found');
      })
      .finally(() => setInvoiceLoading(false));
  }, [invoiceIdFromUrl]);

  useEffect(() => {
    if (account) {
      setPaymentState('connected');
      setIsCorrectNetwork(Number(account.chain?.id) === 127823);
    } else {
      setPaymentState('disconnected');
    }
  }, [account]);

  const { ref: themeButtonRef, toggleSwitchTheme } = useModeAnimation({
    duration: 600,
    animationType: 'circle' as any,
    isDarkMode: isDark,
    onDarkModeChange: () => toggleTheme(),
  });

  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-500';

  const glassCard = isDark
    ? 'bg-gradient-to-br from-[#1a1a24]/95 to-[#16161f]/95 backdrop-blur-2xl border border-white/10'
    : 'bg-white/95 backdrop-blur-2xl border border-gray-200/50';

  const formatDueDate = (iso: string | null | undefined) => {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-US', { dateStyle: 'medium' });
    } catch {
      return '—';
    }
  };

  const invoiceData = invoice
    ? {
        merchantName: invoice.client_name || 'Merchant',
        invoiceId: `INV-${invoice.onchain_invoice_id}`,
        description: invoice.description?.trim() || 'Stablecoin invoice payment',
        dueDate: formatDueDate(invoice.due_date),
        amount: Number(invoice.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        amountNum: Number(invoice.amount),
        token: invoice.token,
        networkFee: '~0.01',
        networkFeeNum: 0.01,
        merchantAddress: invoice.creator_wallet,
        merchantVerified: true,
      }
    : null;

  const handleConnectWallet = () => {
    openConnectModal({ client: thirdwebClient, chain: etherlinkShadownet });
  };

  const handlePay = () => {
    if (!invoice || !account || !USDC_ADDRESS?.startsWith('0x')) {
      setPayError('Missing invoice, wallet, or USDC address.');
      return;
    }
    if (invoice.onchain_invoice_id < 0) {
      setPayError('This invoice cannot be paid. The merchant needs to re-create it (invalid on-chain id).');
      setPaymentState('failed');
      return;
    }
    setPayError(null);
    setPaymentState('processing');
    const amountRaw = BigInt(Math.round(Number(invoice.amount) * 10 ** USDC_DECIMALS));
    const tokenContract = getContract({
      client: thirdwebClient,
      chain: etherlinkShadownet,
      address: USDC_ADDRESS as `0x${string}`,
      abi: ERC20_ABI,
    });
    const paymentsContract = getContract({
      client: thirdwebClient,
      chain: etherlinkShadownet,
      address: INVOICE_PAYMENTS_ADDRESS as `0x${string}`,
      abi: INVOICE_PAYMENTS_ABI,
    });
    const approveCall = prepareContractCall({
      contract: tokenContract,
      method: 'function approve(address spender, uint256 amount) returns (bool)',
      params: [INVOICE_PAYMENTS_ADDRESS as `0x${string}`, amountRaw],
    });
    sendTransaction(approveCall, {
      onSuccess: async (result) => {
        const hash = result.transactionHash;
        if (!hash) {
          setPayError('Approval succeeded but no transaction hash. Click Pay again.');
          setPaymentState('failed');
          return;
        }
        try {
          await waitForReceipt({
            client: thirdwebClient,
            chain: etherlinkShadownet,
            transactionHash: hash,
          });
        } catch {
          setPayError('Approval is taking longer than expected. Please wait a moment and click Pay again.');
          setPaymentState('failed');
          return;
        }
        const payCall = prepareContractCall({
          contract: paymentsContract,
          method: 'function payInvoice(uint256 invoiceId)',
          params: [BigInt(invoice.onchain_invoice_id)],
        });
        sendTransaction(payCall, {
          onSuccess: (payResult) => {
            const payHash = payResult.transactionHash ?? (payResult as { receipt?: { transactionHash?: string } }).receipt?.transactionHash ?? '';
            setTransactionHash(payHash.startsWith('0x') ? payHash : `0x${payHash}`);
            setPaymentState('success');
          },
          onError: (err) => {
            const msg = err?.message ?? 'Payment failed';
            setPayError(friendlyPayError(msg));
            setPaymentState('failed');
          },
        });
      },
      onError: (err) => {
        const msg = err?.message ?? 'Approval failed';
        setPayError(friendlyPayError(msg));
        setPaymentState('failed');
      },
    });
  };

  const handleRetry = () => {
    setPayError(null);
    setPaymentState('connected');
  };

  const handleSwitchNetwork = async () => {
    setSwitchError(null);
    setIsSwitching(true);
    try {
      await switchChain(etherlinkShadownet);
      setIsCorrectNetwork(true);
    } catch (e) {
      setSwitchError(e instanceof Error ? e.message : 'Failed to switch network');
    } finally {
      setIsSwitching(false);
    }
  };

  const explorerTxUrl = transactionHash
    ? `${EXPLORER_TX_URL}/${transactionHash.startsWith('0x') ? transactionHash : '0x' + transactionHash}`
    : '';

  const copyAddress = async (address: string) => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(address);
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
      } else {
        // Fallback for when clipboard API is not available
        // Create a temporary textarea element
        const textarea = document.createElement('textarea');
        textarea.value = address;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          setCopiedAddress(true);
          setTimeout(() => setCopiedAddress(false), 2000);
        } catch (err) {
          console.error('Copy failed:', err);
        }
        document.body.removeChild(textarea);
      }
    } catch (err) {
      // Fallback method if clipboard API fails
      console.error('Clipboard API failed:', err);
      const textarea = document.createElement('textarea');
      textarea.value = address;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textarea);
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className={`min-h-screen relative ${isDark ? 'bg-[#0d0818]' : 'bg-gray-50'}`}>
      <LooperBg isDark={isDark} />

      {/* Minimal Top Bar */}
      <header className={`sticky top-0 z-50 border-b ${isDark ? 'bg-[#0a0a0f]/80 border-white/5' : 'bg-white/80 border-gray-200'} backdrop-blur-2xl`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <img src="/stable_link_logo.svg" alt="StableLink" className="w-10 h-10 rounded-xl object-contain flex-shrink-0" />
            <div>
              <h1 className={`font-bold text-base ${textPrimary}`}>StableLink</h1>
              <p className={`text-[10px] ${textMuted}`}>Payment Platform</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Powered by Etherlink Badge */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-100'} border ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
              <Zap className="w-4 h-4 text-[#FF1CF7]" />
              <span className={`text-xs font-semibold ${textSecondary}`}>Powered by Etherlink</span>
            </div>

            {/* Theme Toggle */}
            <motion.button
              ref={themeButtonRef as any}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSwitchTheme}
              className={`p-2.5 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-all`}
            >
              {isDark ? (
                <Sun className={`w-5 h-5 ${textSecondary}`} />
              ) : (
                <Moon className={`w-5 h-5 ${textSecondary}`} />
              )}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-6 pb-12 lg:pt-8 lg:pb-20">
        <motion.button
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/dashboard')}
          className={`flex items-center gap-2 mb-6 font-semibold text-sm transition-colors ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeft className="w-4 h-4 flex-shrink-0" />
          <span>Back to Dashboard</span>
        </motion.button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left/Center - Payment Card */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`${glassCard} rounded-3xl shadow-2xl overflow-hidden`}
            >
              {invoiceLoading ? (
                <div className="p-12 flex flex-col items-center justify-center gap-4">
                  <Loader2 className={`w-12 h-12 animate-spin ${isDark ? 'text-[#FF1CF7]' : 'text-[#B967FF]'}`} />
                  <p className={textSecondary}>Loading invoice…</p>
                </div>
              ) : invoiceError || !invoice ? (
                <div className="p-12 text-center">
                  <AlertCircle className={`w-14 h-14 mx-auto mb-4 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
                  <h2 className={`text-xl font-bold ${textPrimary} mb-2`}>Cannot load invoice</h2>
                  <p className={`text-sm ${textSecondary}`}>{invoiceError || 'No invoice specified.'}</p>
                  <p className={`text-xs ${textMuted} mt-4`}>Use the payment link shared by the merchant (e.g. /checkout?id=...).</p>
                </div>
              ) : invoice.status === 'paid' ? (
                <div className="p-12 text-center">
                  <CheckCircle2 className="w-14 h-14 mx-auto mb-4 text-emerald-400" />
                  <h2 className={`text-xl font-bold ${textPrimary} mb-2`}>Already paid</h2>
                  <p className={`text-sm ${textSecondary}`}>This invoice has already been paid.</p>
                </div>
              ) : (
              <AnimatePresence mode="wait">
                {paymentState === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-12 text-center"
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
                      Payment Successful
                    </h2>
                    <p className={`text-base ${textSecondary} mb-8`}>
                      Your payment has been confirmed on Etherlink
                    </p>

                    <div className={`p-6 rounded-2xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'} mb-8`}>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className={`text-sm ${textMuted}`}>Transaction</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-mono font-semibold ${textPrimary} truncate max-w-[180px]`}>
                              {transactionHash ? `${transactionHash.slice(0, 10)}...${transactionHash.slice(-8)}` : ''}
                            </span>
                            {explorerTxUrl && (
                              <a href={explorerTxUrl} target="_blank" rel="noreferrer" className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'} transition-colors`} title="View on explorer">
                                <ExternalLink className={`w-4 h-4 ${textSecondary}`} />
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${textMuted}`}>Amount Paid</span>
                          <span className={`text-lg font-bold ${textPrimary}`}>
                            ${invoiceData?.amount} {invoiceData?.token}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className={`text-sm ${textMuted}`}>
                      You can safely close this page
                    </p>
                  </motion.div>
                ) : paymentState === 'failed' ? (
                  <motion.div
                    key="failed"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-12 text-center"
                  >
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-400 to-pink-400 flex items-center justify-center shadow-2xl shadow-red-400/50">
                      <XCircle className="w-12 h-12 text-white" strokeWidth={3} />
                    </div>

                    <h2 className={`text-3xl font-bold ${textPrimary} mb-3`}>
                      Payment Failed
                    </h2>
                    <p className={`text-base ${textSecondary} mb-8`}>
                      {payError || 'The transaction was rejected or failed.'}
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleRetry}
                      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] font-bold text-white shadow-lg shadow-[#FF1CF7]/30 hover:shadow-[#FF1CF7]/50 transition-all"
                    >
                      Try Again
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="payment-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Header */}
                    <div className="p-8 pb-6 border-b border-white/10">
                      <h2 className={`text-2xl font-bold ${textPrimary} mb-2`}>
                        Invoice Payment
                      </h2>
                      <p className={`text-sm ${textSecondary}`}>
                        Secure stablecoin payment powered by Etherlink
                      </p>
                    </div>

                    <div className="p-8 space-y-8">
                      {/* Invoice Details */}
                      <div>
                        <h3 className={`text-xs font-bold uppercase tracking-widest ${textMuted} mb-4`}>
                          Invoice Details
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${textSecondary}`}>Merchant</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${textPrimary}`}>
                                {invoiceData.merchantName}
                              </span>
                              {invoiceData.merchantVerified && (
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#FF1CF7] to-[#B967FF] flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${textSecondary}`}>Invoice ID</span>
                            <span className={`text-sm font-mono font-semibold ${textPrimary}`}>
                              {invoiceData.invoiceId}
                            </span>
                          </div>

                          <div className="flex items-start justify-between gap-4">
                            <span className={`text-sm ${textSecondary}`}>Description</span>
                            <span className={`text-sm text-right ${textPrimary} max-w-xs`}>
                              {invoiceData.description}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${textSecondary}`}>Due Date</span>
                            <span className={`text-sm font-semibold ${textPrimary}`}>
                              {invoiceData.dueDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Amount Section */}
                      <div className={`p-6 rounded-2xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-semibold ${textMuted}`}>Amount Due</span>
                          <span className={`px-3 py-1 rounded-xl text-xs font-bold ${isDark ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-cyan-50 text-cyan-600 border border-cyan-200'}`}>
                            {invoiceData.token}
                          </span>
                        </div>
                        <div className={`text-4xl font-bold ${textPrimary}`}>
                          ${invoiceData.amount}
                        </div>
                      </div>

                      {/* Payment Breakdown */}
                      <div>
                        <h3 className={`text-xs font-bold uppercase tracking-widest ${textMuted} mb-4`}>
                          Payment Breakdown
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${textSecondary}`}>Invoice Amount</span>
                            <span className={`text-base font-bold ${textPrimary}`}>
                              ${invoiceData.amount}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${textSecondary}`}>Network Fee</span>
                              <Zap className="w-3 h-3 text-yellow-400" />
                            </div>
                            <span className={`text-sm font-semibold ${textSecondary}`}>
                              ~${invoiceData.networkFeeNum.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className={`text-base font-bold ${textPrimary}`}>Total</span>
                            <span className={`text-xl font-bold ${textPrimary}`}>
                              ${(invoiceData.amountNum + invoiceData.networkFeeNum).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className={`flex items-start gap-3 mt-6 p-4 rounded-xl ${isDark ? 'bg-[#FF1CF7]/10 border border-[#FF1CF7]/20' : 'bg-pink-50 border border-pink-200'}`}>
                          <Lock className="w-4 h-4 text-[#FF1CF7] flex-shrink-0 mt-0.5" />
                          <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                            StableLink does not custody funds. Payments are executed directly on Etherlink.
                          </p>
                        </div>
                      </div>

                      {/* Wallet Info (if connected) */}
                      {(paymentState === 'connected' || paymentState === 'loading' || paymentState === 'processing') && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-5 rounded-2xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${textSecondary}`}>Wallet Balance</span>
                              <span className={`text-sm font-bold ${textPrimary}`}>
                                {walletBalance} USDC
                              </span>
                            </div>
                            {!isCorrectNetwork && (
                              <div className={`flex items-center gap-2 p-3 rounded-xl ${isDark ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-yellow-50 border border-yellow-200'}`}>
                                <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                                <span className={`text-xs font-semibold ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
                                  Wrong network detected
                                </span>
                              </div>
                            )}
                            {isCorrectNetwork && (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                <span className={`text-xs font-semibold ${textSecondary}`}>
                                  Connected to Etherlink
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* Payment Actions */}
                      <div className="space-y-3">
                        {paymentState === 'disconnected' && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleConnectWallet}
                            className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] font-bold text-white shadow-xl shadow-[#FF1CF7]/40 hover:shadow-[#FF1CF7]/60 transition-all text-base"
                          >
                            <Wallet className="w-5 h-5" />
                            Connect Wallet to Pay
                          </motion.button>
                        )}

                        {paymentState === 'loading' && (
                          <div className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] font-bold text-white shadow-xl opacity-80 text-base">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Connecting Wallet...
                          </div>
                        )}

                        {paymentState === 'connected' && !isCorrectNetwork && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleSwitchNetwork}
                              disabled={isSwitching}
                              className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 font-bold text-white shadow-xl shadow-yellow-400/40 hover:shadow-yellow-400/60 transition-all text-base disabled:opacity-70 disabled:pointer-events-none"
                            >
                              {isSwitching ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <>
                                  <Globe className="w-5 h-5" />
                                  Switch to Etherlink ShadowNet
                                </>
                              )}
                            </motion.button>
                            {switchError && (
                              <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>{switchError}</p>
                            )}
                            <p className={`text-xs ${textMuted}`}>
                              If MetaMask is already on Etherlink ShadowNet, try refreshing this page.
                            </p>
                          </>
                        )}

                        {paymentState === 'connected' && isCorrectNetwork && (
                          <>
                            {invoice.onchain_invoice_id < 0 ? (
                              <div className={`p-4 rounded-2xl ${isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
                                <p className={`text-sm font-semibold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                                  This invoice cannot be paid yet.
                                </p>
                                <p className={`text-xs ${textSecondary} mt-1`}>
                                  The merchant needs to re-create this invoice. Please contact them for a new payment link.
                                </p>
                              </div>
                            ) : (
                              <>
                                <p className={`text-xs ${textMuted} mb-2`}>
                                  You may see two wallet prompts: first Approve USDC, then Pay.
                                </p>
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={handlePay}
                                  disabled={isTxPending}
                                  className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] font-bold text-white shadow-xl shadow-[#FF1CF7]/40 hover:shadow-[#FF1CF7]/60 transition-all text-base disabled:opacity-70 disabled:pointer-events-none"
                                >
                                  {isTxPending ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                  ) : (
                                    <>
                                      Pay ${invoiceData?.amount} {invoiceData?.token}
                                      <ArrowRight className="w-5 h-5" />
                                    </>
                                  )}
                                </motion.button>
                              </>
                            )}
                            {payError && (
                              <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>{payError}</p>
                            )}
                          </>
                        )}

                        {paymentState === 'processing' && (
                          <div className="space-y-4">
                            <div className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] font-bold text-white shadow-xl opacity-80 text-base">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Processing Payment...
                            </div>
                            <div className={`text-center text-sm ${textMuted}`}>
                              Transaction submitted. Waiting for confirmation...
                            </div>
                          </div>
                        )}

                        <div className={`text-center text-xs ${textMuted} pt-2`}>
                          By proceeding, you agree to StableLink's Terms of Service
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              )}
            </motion.div>
          </div>

          {/* Right Panel - Merchant & Platform Info (only when invoice loaded) */}
          {invoiceData && (
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Merchant Info Card */}
            <div className={`${glassCard} rounded-2xl p-6 shadow-xl`}>
              <h3 className={`text-sm font-bold ${textPrimary} mb-4`}>Merchant Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF1CF7] to-[#B967FF] flex items-center justify-center shadow-lg shadow-[#FF1CF7]/30">
                    <span className="text-white font-bold text-lg">A</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${textPrimary}`}>
                        {invoiceData.merchantName}
                      </span>
                      {invoiceData.merchantVerified && (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <p className={`text-xs ${textMuted}`}>Verified merchant</p>
                  </div>
                </div>

                <div>
                  <label className={`text-xs font-semibold ${textMuted} mb-2 block`}>
                    Wallet Address
                  </label>
                  <div className={`flex items-center justify-between gap-2 p-3 rounded-xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                    <span className={`text-xs font-mono font-semibold ${textPrimary}`}>
                      {truncateAddress(invoiceData.merchantAddress)}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copyAddress(invoiceData.merchantAddress)}
                      className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'} transition-colors`}
                    >
                      {copiedAddress ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className={`w-4 h-4 ${textSecondary}`} />
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* About StableLink Card */}
            <div className={`${glassCard} rounded-2xl p-6 shadow-xl`}>
              <h3 className={`text-sm font-bold ${textPrimary} mb-4 flex items-center gap-2`}>
                <Shield className="w-4 h-4 text-[#FF1CF7]" />
                About StableLink
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-100'} flex items-center justify-center flex-shrink-0`}>
                    <Lock className={`w-5 h-5 ${textSecondary}`} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${textPrimary} mb-1`}>Non-Custodial</h4>
                    <p className={`text-xs ${textMuted} leading-relaxed`}>
                      Your funds go directly to the merchant. StableLink never holds your assets.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-100'} flex items-center justify-center flex-shrink-0`}>
                    <Zap className={`w-5 h-5 ${textSecondary}`} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${textPrimary} mb-1`}>Etherlink-Native</h4>
                    <p className={`text-xs ${textMuted} leading-relaxed`}>
                      Built for Etherlink's fast, low-cost infrastructure for optimal performance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-100'} flex items-center justify-center flex-shrink-0`}>
                    <Shield className={`w-5 h-5 ${textSecondary}`} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${textPrimary} mb-1`}>Secure & Transparent</h4>
                    <p className={`text-xs ${textMuted} leading-relaxed`}>
                      All transactions are verifiable on-chain with enterprise-grade security.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className={`p-5 rounded-2xl ${isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}>
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className={`text-sm font-bold ${textPrimary}`}>Secure Payment</span>
              </div>
              <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                This payment is secured by Etherlink blockchain technology
              </p>
            </div>
          </motion.aside>
          )}
        </div>
      </main>
    </div>
  );
}