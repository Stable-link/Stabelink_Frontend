import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Calendar,
  DollarSign,
  Users,
  Plus,
  X,
  AlertCircle,
  Info,
  Shield,
  Zap,
  Lock,
  Eye,
  ChevronDown,
  Wallet,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getContract, prepareContractCall } from 'thirdweb';
import { useSendTransaction } from 'thirdweb/react';
import { etherlinkShadownet } from '../../client';
import { thirdwebClient } from '../../client';
import {
  INVOICE_PAYMENTS_ADDRESS,
  INVOICE_PAYMENTS_ABI,
  USDC_ADDRESS,
  PLATFORM_FEE_RECIPIENT,
} from '../../contract';
import { createInvoice as createInvoiceApi, getApiKey } from '../../api';

interface CreateInvoiceProps {
  isDark: boolean;
  walletAddress: string;
  onBack: () => void;
}

const USDC_DECIMALS = 6;
const BASIS_POINTS = 10000;

export default function CreateInvoice({ isDark, walletAddress, onBack }: CreateInvoiceProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    amount: '',
    token: 'USDC',
    dueDate: '',
    description: '',
    yourSplit: 97,
    platformFee: 3,
    recipients: [] as { address: string; percentage: number }[]
  });
  const [submitState, setSubmitState] = useState<'idle' | 'sending' | 'syncing' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdTxHash, setCreatedTxHash] = useState<string | null>(null);

  const { mutate: sendTransaction } = useSendTransaction();

  // Professional glass morphism styles
  const glassCard = isDark 
    ? 'bg-gradient-to-br from-[#1a1a24]/90 to-[#16161f]/90 backdrop-blur-2xl border border-white/10' 
    : 'bg-white/90 backdrop-blur-2xl border border-gray-200/50';

  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-500';

  const steps = [
    { number: 1, title: 'Invoice Details', description: 'Client & amount info' },
    { number: 2, title: 'Payment Distribution', description: 'Configure splits' },
    { number: 3, title: 'Review & Confirm', description: 'Deploy on-chain' }
  ];

  useEffect(() => {
    const duplicate = (location.state as { duplicate?: { client: string; clientEmail: string; amount: string; token: string } })?.duplicate;
    if (duplicate) {
      setFormData(prev => ({
        ...prev,
        clientName: duplicate.client && duplicate.client !== '—' ? duplicate.client : prev.clientName,
        clientEmail: duplicate.clientEmail || prev.clientEmail,
        amount: duplicate.amount ? String(duplicate.amount).replace(/,/g, '') : prev.amount,
        token: duplicate.token || prev.token,
      }));
    }
  }, [location.state]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateEstimatedReceive = () => {
    const amount = parseFloat(formData.amount) || 0;
    return (amount * (formData.yourSplit / 100)).toFixed(2);
  };

  const calculatePlatformFee = () => {
    const amount = parseFloat(formData.amount) || 0;
    return (amount * (formData.platformFee / 100)).toFixed(2);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!USDC_ADDRESS || !USDC_ADDRESS.startsWith('0x')) {
      setSubmitError('Set VITE_USDC_ADDRESS in .env for the payment token.');
      setSubmitState('error');
      return;
    }
    if (!PLATFORM_FEE_RECIPIENT || !PLATFORM_FEE_RECIPIENT.startsWith('0x')) {
      setSubmitError('Set VITE_PLATFORM_FEE_RECIPIENT in .env (must match contract).');
      setSubmitState('error');
      return;
    }
    if (!getApiKey()) {
      setSubmitError('Set your API key in Settings or VITE_API_KEY to sync with backend.');
      setSubmitState('error');
      return;
    }
    const amountNum = parseFloat(formData.amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setSubmitError('Enter a valid invoice amount.');
      setSubmitState('error');
      return;
    }
    const yourBps = Math.round(formData.yourSplit * 100);
    const platformBps = Math.round(formData.platformFee * 100);
    if (yourBps + platformBps !== BASIS_POINTS) {
      setSubmitError('Splits must total 100%.');
      setSubmitState('error');
      return;
    }
    const amountWei = BigInt(Math.round(amountNum * 10 ** USDC_DECIMALS));
    const splits = [
      { recipient: walletAddress as `0x${string}`, percentage: yourBps as number },
      { recipient: PLATFORM_FEE_RECIPIENT as `0x${string}`, percentage: platformBps as number },
    ];
    setSubmitError(null);
    setSubmitState('sending');
    const contract = getContract({
      client: thirdwebClient,
      chain: etherlinkShadownet,
      address: INVOICE_PAYMENTS_ADDRESS as `0x${string}`,
      abi: INVOICE_PAYMENTS_ABI,
    });
    const tx = prepareContractCall({
      contract,
      method: 'function createInvoice(uint256 amount, address token, (address recipient, uint16 percentage)[] splits) returns (uint256)',
      params: [amountWei, USDC_ADDRESS as `0x${string}`, splits],
    });
    sendTransaction(tx, {
      onSuccess: async (result) => {
        setCreatedTxHash(result.transactionHash ?? null);
        let onchainInvoiceId: number | undefined;
        const receipt = result.receipt as { logs?: Array<{ address?: string; topics?: string[] }> } | undefined;
        const logs = receipt?.logs ?? (receipt as { logEntries?: Array<{ address?: string; topics?: string[] }> })?.logEntries;
        if (Array.isArray(logs) && logs.length > 0) {
          const contractAddr = INVOICE_PAYMENTS_ADDRESS.toLowerCase();
          for (const log of logs) {
            const addr = (log as { address?: string }).address?.toLowerCase();
            if (addr !== contractAddr) continue;
            const topics = (log as { topics?: string[] }).topics;
            if (topics && topics.length >= 2) {
              try {
                const id = Number(BigInt(topics[1]));
                if (Number.isInteger(id) && id >= 0) {
                  onchainInvoiceId = id;
                  break;
                }
              } catch {
                // ignore parse errors
              }
            }
          }
        }
        setSubmitState('syncing');
        try {
          await createInvoiceApi({
            amount: amountNum,
            token: formData.token,
            client_name: formData.clientName || undefined,
            client_email: formData.clientEmail || undefined,
            splits: [
              { wallet: walletAddress, percentage: formData.yourSplit },
              { wallet: PLATFORM_FEE_RECIPIENT, percentage: formData.platformFee },
            ],
            onchain_invoice_id: onchainInvoiceId,
            creator_wallet: walletAddress,
            tx_hash: result.transactionHash ?? undefined,
          });
        } catch (e) {
          setSubmitError(e instanceof Error ? e.message : 'Failed to sync invoice to backend.');
          setSubmitState('error');
          return;
        }
        setSubmitState('success');
        navigate('/dashboard/invoices');
      },
      onError: (err) => {
        setSubmitError(err?.message ?? 'Transaction failed.');
        setSubmitState('error');
      },
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 xl:p-12">
          {/* Header with Back Button */}
          <div className="mb-6 md:mb-8">
            <motion.button
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className={`flex items-center gap-2 ${textSecondary} hover:${textPrimary} transition-colors mb-3 md:mb-4 font-semibold text-sm md:text-base`}
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              Back to Dashboard
            </motion.button>
            
            <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold ${textPrimary} mb-2 tracking-tight`}>
              Create New Invoice
            </h1>
            <p className={`text-sm md:text-base ${textSecondary}`}>
              Deploy a programmable payment request on Etherlink
            </p>
          </div>

          {/* Step Progress Indicator */}
          <div className={`${glassCard} rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 mb-6 md:mb-8 shadow-xl`}>
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 flex-1">
                    {/* Step Circle */}
                    <motion.div
                      initial={false}
                      animate={{
                        scale: currentStep === step.number ? 1.1 : 1,
                      }}
                      className={`relative w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-xl md:rounded-2xl flex items-center justify-center font-bold text-sm md:text-base lg:text-lg transition-all shadow-lg ${
                        currentStep > step.number
                          ? 'bg-gradient-to-br from-[#FF1CF7] to-[#B967FF] text-white shadow-[#FF1CF7]/30'
                          : currentStep === step.number
                          ? 'bg-gradient-to-br from-[#FF1CF7] to-[#B967FF] text-white shadow-[#FF1CF7]/50'
                          : isDark
                          ? 'bg-white/5 text-gray-500'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {currentStep > step.number ? (
                        <Check className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                      ) : (
                        step.number
                      )}
                    </motion.div>

                    {/* Step Info */}
                    <div className="flex-1 text-center md:text-left">
                      <h3 className={`font-bold text-xs md:text-sm lg:text-base ${
                        currentStep >= step.number ? textPrimary : textMuted
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`text-[10px] md:text-xs lg:text-sm ${textMuted} hidden sm:block`}>{step.description}</p>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-2 md:mx-4 rounded-full transition-all ${
                      currentStep > step.number
                        ? 'bg-gradient-to-r from-[#FF1CF7] to-[#B967FF]'
                        : isDark
                        ? 'bg-white/10'
                        : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {/* STEP 1: Invoice Details */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={`${glassCard} rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 shadow-2xl`}
              >
                <div className="mb-6 md:mb-8">
                  <h2 className={`text-xl md:text-2xl font-bold ${textPrimary} mb-2`}>Invoice Details</h2>
                  <p className={`text-xs md:text-sm ${textSecondary}`}>Enter client information and payment details</p>
                </div>

                <div className="space-y-5 md:space-y-6">
                  {/* Client Name - Optional */}
                  <div>
                    <label className={`block text-xs md:text-sm font-semibold ${textPrimary} mb-2 md:mb-3`}>
                      Client Name <span className={`text-xs ${textMuted} font-normal`}>(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      placeholder="e.g., Acme Corporation"
                      className={`w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl text-sm md:text-base ${
                        isDark 
                          ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500' 
                          : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                      } focus:outline-none focus:ring-2 focus:ring-[#FF1CF7]/50 transition-all font-medium`}
                    />
                  </div>

                  {/* Client Email - Optional */}
                  <div>
                    <label className={`block text-xs md:text-sm font-semibold ${textPrimary} mb-2 md:mb-3`}>
                      Client Email <span className={`text-xs ${textMuted} font-normal`}>(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                      placeholder="client@acme.com"
                      className={`w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl text-sm md:text-base ${
                        isDark 
                          ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500' 
                          : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                      } focus:outline-none focus:ring-2 focus:ring-[#FF1CF7]/50 transition-all font-medium`}
                    />
                  </div>

                  {/* Amount - Large Input */}
                  <div>
                    <label className={`block text-sm font-semibold ${textPrimary} mb-3`}>
                      Invoice Amount <span className="text-[#FF1CF7]">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className={`absolute left-5 top-1/2 -translate-y-1/2 w-8 h-8 ${textMuted}`} />
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        placeholder="0.00"
                        className={`w-full pl-16 pr-5 py-6 rounded-2xl text-3xl font-bold ${
                          isDark 
                            ? 'bg-white/5 border border-white/10 text-white placeholder-gray-600' 
                            : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                        } focus:outline-none focus:ring-2 focus:ring-[#FF1CF7]/50 transition-all`}
                      />
                    </div>
                  </div>

                  {/* Token Selection */}
                  <div>
                    <label className={`block text-sm font-semibold ${textPrimary} mb-3`}>
                      Payment Token
                    </label>
                    <div className="relative">
                      <select
                        value={formData.token}
                        onChange={(e) => handleInputChange('token', e.target.value)}
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
                    <div className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF1CF7]/10 to-[#B967FF]/10 border border-[#FF1CF7]/20 w-fit">
                      <Zap className="w-4 h-4 text-[#FF1CF7]" />
                      <span className={`text-xs font-bold text-[#FF1CF7]`}>Built for Etherlink</span>
                    </div>
                  </div>

                  {/* Due Date - Optional */}
                  <div>
                    <label className={`block text-sm font-semibold ${textPrimary} mb-3`}>
                      Due Date <span className={`text-xs ${textMuted} font-normal`}>(Optional)</span>
                    </label>
                    <div className="relative">
                      <Calendar className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 ${textMuted}`} />
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                        className={`w-full pl-14 pr-5 py-4 rounded-2xl ${
                          isDark 
                            ? 'bg-white/5 border border-white/10 text-white' 
                            : 'bg-gray-50 border border-gray-200 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-[#FF1CF7]/50 transition-all font-medium`}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className={`block text-sm font-semibold ${textPrimary} mb-3`}>
                      Description <span className={`text-xs ${textMuted} font-normal`}>(Optional)</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="e.g., Web design services for Q1 2026"
                      rows={4}
                      className={`w-full px-5 py-4 rounded-2xl ${
                        isDark 
                          ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500' 
                          : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                      } focus:outline-none focus:ring-2 focus:ring-[#FF1CF7]/50 transition-all font-medium resize-none`}
                    />
                  </div>
                </div>

                {/* Next Button */}
                <div className="flex justify-end mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={nextStep}
                    disabled={!formData.amount}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${
                      formData.amount
                        ? 'bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] shadow-[#FF1CF7]/30 hover:shadow-[#FF1CF7]/50'
                        : 'bg-gray-400 cursor-not-allowed opacity-50'
                    }`}
                  >
                    Continue to Distribution
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Payment Distribution */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={`${glassCard} rounded-3xl p-8 shadow-2xl`}
              >
                <div className="mb-8">
                  <h2 className={`text-2xl font-bold ${textPrimary} mb-2`}>Configure Payment Distribution</h2>
                  <p className={`text-sm ${textSecondary}`}>Define how funds will be split upon payment</p>
                </div>

                {/* Split Table */}
                <div className="space-y-4 mb-8">
                  {/* Your Wallet */}
                  <div className={`p-6 rounded-2xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF1CF7] to-[#B967FF] flex items-center justify-center shadow-lg shadow-[#FF1CF7]/30">
                          <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className={`font-bold ${textPrimary}`}>Your Wallet</h3>
                          <p className={`text-xs ${textMuted}`}>Primary recipient</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <input
                          type="number"
                          value={formData.yourSplit}
                          onChange={(e) => handleInputChange('yourSplit', Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                          className={`w-24 px-4 py-2 rounded-xl text-right font-bold text-lg ${
                            isDark 
                              ? 'bg-white/5 border border-white/10 text-white' 
                              : 'bg-white border border-gray-200 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-[#FF1CF7]/50 transition-all`}
                        />
                        <span className={`font-bold text-lg ${textPrimary}`}>%</span>
                      </div>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="relative h-3 bg-gradient-to-r from-gray-700/30 to-gray-700/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${formData.yourSplit}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] shadow-lg"
                      />
                    </div>
                  </div>

                  {/* Platform Fee - Locked */}
                  <div className={`p-6 rounded-2xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'} relative`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-400/30">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className={`font-bold ${textPrimary}`}>Platform Fee</h3>
                            <Lock className={`w-4 h-4 ${textMuted}`} />
                          </div>
                          <p className={`text-xs ${textMuted}`}>Non-editable</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-lg ${textPrimary}`}>{formData.platformFee}%</span>
                      </div>
                    </div>
                    <div className="relative h-3 bg-gradient-to-r from-gray-700/30 to-gray-700/30 rounded-full overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-lg"
                        style={{ width: `${formData.platformFee}%` }}
                      />
                    </div>
                  </div>

                  {/* Info Banner */}
                  <div className={`flex items-start gap-3 p-5 rounded-2xl ${isDark ? 'bg-[#FF1CF7]/10 border border-[#FF1CF7]/20' : 'bg-pink-50 border border-pink-200'}`}>
                    <Info className="w-5 h-5 text-[#FF1CF7] flex-shrink-0 mt-0.5" />
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className="font-bold">Platform fee supports infrastructure and ecosystem growth.</span> This fee enables instant settlements, gas optimization, and enterprise-grade security.
                    </p>
                  </div>

                  {/* Add Recipient (Future Feature) */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled
                    className={`w-full p-6 rounded-2xl border-2 border-dashed ${
                      isDark ? 'border-white/10 hover:border-white/20' : 'border-gray-300 hover:border-gray-400'
                    } transition-colors flex items-center justify-center gap-3 ${textMuted} opacity-50 cursor-not-allowed`}
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-semibold">Add Additional Recipient</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] text-white font-bold">Soon</span>
                  </motion.button>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={prevStep}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold ${
                      isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
                    } ${textPrimary} transition-all shadow-lg`}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={nextStep}
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] font-bold text-white shadow-lg shadow-[#FF1CF7]/30 hover:shadow-[#FF1CF7]/50 transition-all"
                  >
                    Continue to Review
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Review & Confirm */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={`${glassCard} rounded-3xl p-8 shadow-2xl`}
              >
                <div className="mb-8">
                  <h2 className={`text-2xl font-bold ${textPrimary} mb-2`}>Review & Confirm</h2>
                  <p className={`text-sm ${textSecondary}`}>Verify all details before deploying on-chain</p>
                </div>

                {/* Invoice Summary Card */}
                <div className={`p-8 rounded-3xl ${isDark ? 'bg-gradient-to-br from-white/10 to-white/5 border border-white/20' : 'bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200'} shadow-xl mb-8`}>
                  <h3 className={`text-lg font-bold ${textPrimary} mb-6 flex items-center gap-2`}>
                    <CheckCircle2 className="w-5 h-5 text-[#FF1CF7]" />
                    Invoice Summary
                  </h3>

                  <div className="space-y-5">
                    {/* Client */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <span className={`text-sm font-semibold ${textMuted}`}>Client</span>
                      <span className={`text-base font-bold ${textPrimary}`}>
                        {formData.clientName || 'No client name'}
                      </span>
                    </div>

                    {/* Amount */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <span className={`text-sm font-semibold ${textMuted}`}>Invoice Amount</span>
                      <span className={`text-2xl font-bold ${textPrimary}`}>
                        ${formData.amount || '0.00'}
                      </span>
                    </div>

                    {/* Token */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <span className={`text-sm font-semibold ${textMuted}`}>Payment Token</span>
                      <span className={`px-4 py-2 rounded-xl font-bold text-sm ${
                        isDark ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-cyan-50 text-cyan-600 border border-cyan-200'
                      }`}>
                        {formData.token}
                      </span>
                    </div>

                    {/* Distribution Breakdown */}
                    <div className="pb-4 border-b border-white/10">
                      <span className={`text-sm font-semibold ${textMuted} mb-3 block`}>Payment Distribution</span>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${textSecondary}`}>Your Wallet ({formData.yourSplit}%)</span>
                          <span className={`font-bold ${textPrimary}`}>
                            ${calculateEstimatedReceive()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${textSecondary}`}>Platform Fee ({formData.platformFee}%)</span>
                          <span className={`font-bold ${textSecondary}`}>
                            ${calculatePlatformFee()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Due Date */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <span className={`text-sm font-semibold ${textMuted}`}>Due Date</span>
                      <span className={`text-base font-bold ${textPrimary}`}>
                        {formData.dueDate || 'No due date set'}
                      </span>
                    </div>

                    {/* Network Fee Estimate */}
                    <div className={`p-5 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-white'} border ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className={`text-sm font-semibold ${textMuted}`}>Estimated Gas Fee</span>
                        </div>
                        <span className={`font-bold ${textPrimary}`}>~$0.12</span>
                      </div>
                      <p className={`text-xs ${textMuted} mt-2`}>Optimized for Etherlink</p>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className={`flex items-start gap-4 p-6 rounded-2xl mb-8 ${isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}>
                  <Shield className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className={`font-bold text-sm ${textPrimary} mb-1`}>Secure On-Chain Deployment</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Your invoice will be deployed as a smart contract on Etherlink. Once deployed, payment splits are immutable and automatically enforced.
                    </p>
                  </div>
                </div>

                {submitState === 'error' && submitError && (
                  <div className={`mb-6 p-4 rounded-2xl flex items-start gap-3 ${isDark ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className={`text-sm font-semibold ${isDark ? 'text-red-400' : 'text-red-700'}`}>{submitError}</p>
                  </div>
                )}
                {submitState === 'success' && (
                  <div className={`mb-6 p-4 rounded-2xl flex items-start gap-3 ${isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className={`text-sm font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>Invoice deployed and synced to backend.</p>
                      {createdTxHash && (
                        <a href={`https://shadownet.explorer.etherlink.com/tx/${createdTxHash.startsWith('0x') ? createdTxHash : '0x' + createdTxHash}`} target="_blank" rel="noreferrer" className={`text-xs mt-1 underline ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>
                          View transaction
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: submitState === 'idle' ? 1.02 : 1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={prevStep}
                    disabled={submitState === 'sending' || submitState === 'syncing'}
                    className={`flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-bold ${
                      isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
                    } ${textPrimary} transition-all shadow-lg disabled:opacity-50 disabled:pointer-events-none`}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Distribution
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: submitState === 'idle' ? 1.02 : 1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={submitState === 'sending' || submitState === 'syncing' || submitState === 'success'}
                    className="flex-[2] flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] font-bold text-white shadow-xl shadow-[#FF1CF7]/40 hover:shadow-[#FF1CF7]/60 transition-all text-lg disabled:opacity-70 disabled:pointer-events-none"
                  >
                    {(submitState === 'sending' || submitState === 'syncing') && <Loader2 className="w-6 h-6 animate-spin" />}
                    {submitState === 'sending' && 'Confirm in wallet…'}
                    {submitState === 'syncing' && 'Syncing to backend…'}
                    {submitState === 'idle' && (
                      <>
                        <Zap className="w-6 h-6" />
                        Deploy Invoice On-Chain
                      </>
                    )}
                    {submitState === 'success' && 'Deployed'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Side Sticky Preview Panel - Hidden on Mobile */}
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className={`hidden xl:block w-[420px] sticky top-0 h-screen border-l ${isDark ? 'border-white/10' : 'border-gray-200'} ${isDark ? 'bg-[#0a0a0f]/80' : 'bg-white/80'} backdrop-blur-2xl p-8 overflow-auto`}
      >
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Eye className={`w-5 h-5 ${textMuted}`} />
            <h3 className={`text-lg font-bold ${textPrimary}`}>Invoice Preview</h3>
          </div>
          <p className={`text-sm ${textMuted}`}>Live preview of your invoice</p>
        </div>

        {/* Preview Card */}
        <div className={`${glassCard} rounded-3xl p-6 shadow-2xl mb-6`}>
          {/* Amount Display */}
          <div className="text-center mb-6 pb-6 border-b border-white/10">
            <p className={`text-xs font-bold uppercase tracking-widest ${textMuted} mb-2`}>Invoice Amount</p>
            <p className={`text-4xl font-bold ${textPrimary} mb-1`}>
              ${formData.amount || '0.00'}
            </p>
            <p className={`text-sm ${textSecondary}`}>{formData.token}</p>
          </div>

          {/* Details */}
          <div className="space-y-4 mb-6">
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider ${textMuted} mb-1`}>Client</p>
              <p className={`text-sm font-semibold ${textPrimary}`}>
                {formData.clientName || '—'}
              </p>
            </div>

            <div>
              <p className={`text-xs font-bold uppercase tracking-wider ${textMuted} mb-1`}>Due Date</p>
              <p className={`text-sm font-semibold ${textPrimary}`}>
                {formData.dueDate || '—'}
              </p>
            </div>

            <div>
              <p className={`text-xs font-bold uppercase tracking-wider ${textMuted} mb-2`}>Distribution</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className={textSecondary}>You receive</span>
                  <span className={`font-bold ${textPrimary}`}>${calculateEstimatedReceive()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={textSecondary}>Platform fee</span>
                  <span className={`font-semibold ${textMuted}`}>${calculatePlatformFee()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Split Bar */}
          <div className="mb-6">
            <p className={`text-xs font-bold uppercase tracking-wider ${textMuted} mb-3`}>Split Visualization</p>
            <div className="relative h-4 bg-gray-700/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${formData.yourSplit}%` }}
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#FF1CF7] to-[#B967FF]"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${formData.platformFee}%` }}
                className="absolute right-0 top-0 h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs font-semibold">
              <span className="text-[#FF1CF7]">{formData.yourSplit}%</span>
              <span className="text-emerald-400">{formData.platformFee}%</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border ${
            submitState === 'success'
              ? 'bg-gradient-to-r from-emerald-400/10 to-emerald-400/5 border border-emerald-400/20'
              : 'bg-gradient-to-r from-yellow-400/10 to-yellow-400/5 border border-yellow-400/20'
          }`}>
            {submitState === 'success' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400">DEPLOYED</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-xs font-bold text-yellow-400">DRAFT</span>
              </>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className={`p-5 rounded-2xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
          <div className="flex items-start gap-3">
            <Info className={`w-5 h-5 ${textMuted} flex-shrink-0 mt-0.5`} />
            <div>
              <p className={`text-xs font-semibold ${textPrimary} mb-1`}>Smart Contract Invoice</p>
              <p className={`text-xs ${textMuted} leading-relaxed`}>
                Once deployed, this invoice becomes an immutable smart contract. Payment splits are automatically enforced on-chain.
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </div>
  );
}