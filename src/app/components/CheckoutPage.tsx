import { useState } from 'react';
import { useModeAnimation } from 'react-theme-switch-animation';
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
  Info,
  ChevronRight,
  Sun,
  Moon,
  ArrowRight,
  Lock,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import svgPaths from '../../imports/svg-1rf4lkm0ba';

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
  const [paymentState, setPaymentState] = useState<PaymentState>('disconnected');
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [walletBalance, setWalletBalance] = useState('1,234.56');
  const [transactionHash, setTransactionHash] = useState('');
  
  // Use the theme animation hook
  const { ref: themeButtonRef, toggleSwitchTheme } = useModeAnimation({
    duration: 600,
    animationType: 'circle' as any,
    isDarkMode: isDark,
    onDarkModeChange: () => {
      toggleTheme();
    }
  });

  // Mock invoice data
  const invoiceData = {
    merchantName: 'Acme Corporation',
    invoiceId: 'INV-2026-001',
    description: 'Web design services for Q1 2026',
    dueDate: 'February 28, 2026',
    amount: '2,500.00',
    token: 'USDC',
    networkFee: '0.12',
    merchantAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0Aa4f',
    merchantVerified: true
  };

  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-500';

  const glassCard = isDark 
    ? 'bg-gradient-to-br from-[#1a1a24]/95 to-[#16161f]/95 backdrop-blur-2xl border border-white/10' 
    : 'bg-white/95 backdrop-blur-2xl border border-gray-200/50';

  const handleConnectWallet = () => {
    setPaymentState('loading');
    setTimeout(() => {
      setPaymentState('connected');
    }, 1500);
  };

  const handlePay = () => {
    setPaymentState('processing');
    setTimeout(() => {
      setTransactionHash('0x7a8f9c2d...4b3e1a5f');
      setPaymentState('success');
    }, 3000);
  };

  const handleRetry = () => {
    setPaymentState('connected');
  };

  const handleSwitchNetwork = () => {
    setTimeout(() => {
      setIsCorrectNetwork(true);
    }, 1500);
  };

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
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF1CF7] to-[#B967FF] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF1CF7]/30">
              <span className="text-white font-bold text-lg">S</span>
            </div>
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
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left/Center - Payment Card */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`${glassCard} rounded-3xl shadow-2xl overflow-hidden`}
            >
              {/* Success State */}
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
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${textMuted}`}>Transaction Hash</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-mono font-semibold ${textPrimary}`}>
                              {transactionHash}
                            </span>
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
                          <span className={`text-sm ${textMuted}`}>Amount Paid</span>
                          <span className={`text-lg font-bold ${textPrimary}`}>
                            ${invoiceData.amount} {invoiceData.token}
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
                      The transaction was rejected or failed
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
                              ~${invoiceData.networkFee}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className={`text-base font-bold ${textPrimary}`}>Total</span>
                            <span className={`text-xl font-bold ${textPrimary}`}>
                              ${(parseFloat(invoiceData.amount) + parseFloat(invoiceData.networkFee)).toFixed(2)}
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
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSwitchNetwork}
                            className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 font-bold text-white shadow-xl shadow-yellow-400/40 hover:shadow-yellow-400/60 transition-all text-base"
                          >
                            <Globe className="w-5 h-5" />
                            Switch to Etherlink
                          </motion.button>
                        )}

                        {paymentState === 'connected' && isCorrectNetwork && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handlePay}
                            className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] font-bold text-white shadow-xl shadow-[#FF1CF7]/40 hover:shadow-[#FF1CF7]/60 transition-all text-base"
                          >
                            Pay ${invoiceData.amount} {invoiceData.token}
                            <ArrowRight className="w-5 h-5" />
                          </motion.button>
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
            </motion.div>
          </div>

          {/* Right Panel - Merchant & Platform Info */}
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
        </div>
      </main>
    </div>
  );
}