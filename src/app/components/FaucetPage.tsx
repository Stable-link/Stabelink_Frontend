import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Droplet,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { motion } from 'motion/react';
import { getContract } from 'thirdweb';
import { prepareContractCall } from 'thirdweb';
import { useReadContract, useSendTransaction } from 'thirdweb/react';
import { etherlinkShadownet, thirdwebClient } from '../../client';
import { FAUCET_ADDRESS, FAUCET_ABI, ERC20_ABI } from '../../contract';

interface FaucetPageProps {
  isDark: boolean;
  walletAddress: string;
  onBack: () => void;
}

type ClaimState = 'idle' | 'confirming' | 'processing' | 'success' | 'failed';

const USDC_DECIMALS = 6;

export default function FaucetPage({ isDark, walletAddress, onBack }: FaucetPageProps) {
  const [claimState, setClaimState] = useState<ClaimState>('idle');
  const [transactionHash, setTransactionHash] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [lastClaimTime, setLastClaimTime] = useState<number | null>(null);
  const [timeUntilClaim, setTimeUntilClaim] = useState<number>(0);

  const faucetContract = FAUCET_ADDRESS
    ? getContract({
        client: thirdwebClient,
        chain: etherlinkShadownet,
        address: FAUCET_ADDRESS as `0x${string}`,
        abi: FAUCET_ABI,
      })
    : null;

  const { data: claimStatus, refetch: refetchClaimStatus } = useReadContract({
    contract: faucetContract || undefined,
    method: 'function canClaim(address user) view returns (bool canClaim, uint256 timeUntilClaim)',
    params: [walletAddress as `0x${string}`],
    queryOptions: { enabled: !!faucetContract && !!walletAddress && walletAddress.startsWith('0x') },
  });

  const { data: claimAmount } = useReadContract({
    contract: faucetContract || undefined,
    method: 'function claimAmount() view returns (uint256)',
    queryOptions: { enabled: !!faucetContract },
  });

  const { data: tokenAddress } = useReadContract({
    contract: faucetContract || undefined,
    method: 'function token() view returns (address)',
    queryOptions: { enabled: !!faucetContract },
  });

  const tokenContract = tokenAddress
    ? getContract({
        client: thirdwebClient,
        chain: etherlinkShadownet,
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
      })
    : null;

  const { data: faucetBalance } = useReadContract({
    contract: tokenContract || undefined,
    method: 'function balanceOf(address account) view returns (uint256)',
    params: [FAUCET_ADDRESS as `0x${string}`],
    queryOptions: { enabled: !!tokenContract && !!FAUCET_ADDRESS },
  });

  const { mutate: sendTransaction } = useSendTransaction();

  useEffect(() => {
    if (claimStatus) {
      const [canClaim, timeUntil] = claimStatus as [boolean, bigint];
      setTimeUntilClaim(Number(timeUntil));
      if (!canClaim) {
        setLastClaimTime(Date.now() - (86400000 - Number(timeUntil) * 1000));
      }
    }
  }, [claimStatus]);

  // Auto-refresh claim status every 10 seconds
  useEffect(() => {
    if (!claimStatus || timeUntilClaim === 0) return;
    const interval = setInterval(() => {
      refetchClaimStatus();
    }, 10000);
    return () => clearInterval(interval);
  }, [claimStatus, timeUntilClaim, refetchClaimStatus]);

  const canClaim = claimStatus ? (claimStatus as [boolean, bigint])[0] : false;
  const claimAmountFormatted = claimAmount
    ? (Number(claimAmount) / 10 ** USDC_DECIMALS).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '1,000.00'; // Default display value

  const formatTimeUntilClaim = (seconds: number): string => {
    if (seconds === 0) return 'Now';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const handleClaim = async () => {
    if (!faucetContract) {
      setError('Faucet not configured. Please set VITE_FAUCET_ADDRESS in .env');
      return;
    }

    if (!canClaim) {
      setError(`Please wait ${formatTimeUntilClaim(timeUntilClaim)} before claiming again`);
      return;
    }

    // Check if faucet has enough tokens
    if (faucetBalance !== undefined && claimAmount) {
      const balanceNum = Number(faucetBalance);
      const claimNum = Number(claimAmount);
      if (balanceNum < claimNum) {
        setError('Faucet has insufficient tokens. Please contact the administrator to refill the faucet.');
        return;
      }
    }

    setError(null);
    setClaimState('confirming');

    try {
      const transaction = prepareContractCall({
        contract: faucetContract,
        method: 'function claim()',
        params: [],
      });

      sendTransaction(transaction, {
        onSuccess: (result) => {
          setTransactionHash(result.transactionHash);
          setClaimState('processing');
          // Reset error on success
          setError(null);
        },
        onError: (err: any) => {
          console.error('Claim error:', err);
          
          // Try to extract a more helpful error message
          let errorMessage = 'Failed to claim tokens';
          
          if (err?.message) {
            errorMessage = err.message;
            
            // Check for common error patterns
            if (err.message.includes('insufficient balance') || err.message.includes('InsufficientBalance')) {
              errorMessage = 'Faucet has insufficient tokens. Please contact the administrator.';
            } else if (err.message.includes('cooldown') || err.message.includes('Cooldown')) {
              errorMessage = `Please wait ${formatTimeUntilClaim(timeUntilClaim)} before claiming again`;
            } else if (err.message.includes('0xe450d38c') || err.message.includes('Encoded error signature')) {
              errorMessage = 'Transaction failed. The faucet may be out of tokens or there may be a network issue.';
            }
          }
          
          setError(errorMessage);
          setClaimState('failed');
        },
      });
    } catch (err: any) {
      console.error('Claim error:', err);
      let errorMessage = err?.message || 'Failed to claim tokens';
      
      if (errorMessage.includes('0xe450d38c') || errorMessage.includes('Encoded error signature')) {
        errorMessage = 'Transaction failed. The faucet may be out of tokens or there may be a network issue.';
      }
      
      setError(errorMessage);
      setClaimState('failed');
    }
  };

  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const bgPrimary = isDark ? 'bg-white/5' : 'bg-white';
  const bgSecondary = isDark ? 'bg-white/10' : 'bg-gray-50';
  const borderColor = isDark ? 'border-white/10' : 'border-gray-200';

  return (
    <div className={`min-h-screen w-full ${isDark ? 'bg-[#0d0818]' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className={`p-2 rounded-xl transition-all ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className={`text-3xl font-bold ${textPrimary}`}>Test Token Faucet</h1>
            <p className={`text-sm ${textSecondary} mt-1`}>Claim test USDC tokens for ShadowNet</p>
            {!walletAddress && (
              <p className={`text-xs ${textSecondary} mt-2 text-yellow-500`}>
                Please connect your wallet to claim tokens
              </p>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Claim Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl p-8 ${bgPrimary} border ${borderColor} backdrop-blur-xl`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-2xl bg-gradient-to-br from-[#FF1CF7]/20 to-[#B967FF]/20`}>
                <Droplet className="w-6 h-6 text-[#FF1CF7]" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${textPrimary}`}>Claim Tokens</h2>
                <p className={`text-sm ${textSecondary}`}>Get test tokens for free</p>
              </div>
            </div>

            {!FAUCET_ADDRESS || FAUCET_ADDRESS === '' ? (
              <div className={`p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-500 mb-1">Faucet Not Configured</p>
                    <p className="text-xs text-yellow-500/80">
                      Please set VITE_FAUCET_ADDRESS in your .env file. The faucet contract needs to be deployed first.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className={`p-6 rounded-2xl ${bgSecondary} mb-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-sm font-semibold ${textSecondary}`}>Claim Amount</span>
                    <span className={`text-2xl font-bold ${textPrimary}`}>{claimAmountFormatted} tUSDC</span>
                  </div>
                  {faucetBalance !== undefined && (
                    <>
                      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-sm font-semibold ${textSecondary}`}>Faucet Balance</span>
                        <span className={`text-lg font-bold ${Number(faucetBalance) < Number(claimAmount || 0) ? 'text-red-400' : textPrimary}`}>
                          {(Number(faucetBalance) / 10 ** USDC_DECIMALS).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })} tUSDC
                        </span>
                      </div>
                      {Number(faucetBalance) < Number(claimAmount || 0) && (
                        <div className={`p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4`}>
                          <p className="text-xs text-red-400 text-center">
                            ⚠️ Faucet is running low on tokens
                          </p>
                        </div>
                      )}
                    </>
                  )}
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${textSecondary}`}>Status</span>
                    {canClaim ? (
                      <span className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-semibold">Ready to Claim</span>
                      </span>
                    ) : walletAddress ? (
                      <span className="flex items-center gap-2 text-yellow-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-semibold">
                          Wait {formatTimeUntilClaim(timeUntilClaim)}
                        </span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-gray-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-semibold">Connect wallet</span>
                      </span>
                    )}
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4`}
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  </motion.div>
                )}

                {claimState === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4`}
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-emerald-400 mb-1">Tokens Claimed!</p>
                        <p className="text-xs text-emerald-400/80">
                          Transaction: {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <button
                  onClick={handleClaim}
                  disabled={!walletAddress || !canClaim || claimState === 'confirming' || claimState === 'processing'}
                  className={`w-full py-4 rounded-2xl font-bold text-white transition-all ${
                    walletAddress && canClaim && claimState !== 'confirming' && claimState !== 'processing'
                      ? 'bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] hover:shadow-lg hover:shadow-[#FF1CF7]/50'
                      : 'bg-gray-500 cursor-not-allowed'
                  }`}
                >
                  {claimState === 'confirming' || claimState === 'processing' ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {claimState === 'confirming' ? 'Confirming...' : 'Processing...'}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Zap className="w-5 h-5" />
                      Claim Tokens
                    </span>
                  )}
                </button>
              </>
            )}
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-3xl p-8 ${bgPrimary} border ${borderColor} backdrop-blur-xl`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-2xl bg-gradient-to-br from-[#00F0FF]/20 to-[#0099CC]/20`}>
                <RefreshCw className="w-6 h-6 text-[#00F0FF]" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${textPrimary}`}>How It Works</h2>
                <p className={`text-sm ${textSecondary}`}>Daily token claims</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className={`p-4 rounded-2xl ${bgSecondary}`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF1CF7]/20 to-[#B967FF]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-[#FF1CF7]">1</span>
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${textPrimary} mb-1`}>Connect Your Wallet</p>
                    <p className={`text-xs ${textSecondary}`}>
                      Make sure you're connected to Etherlink ShadowNet
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-2xl ${bgSecondary}`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00F0FF]/20 to-[#0099CC]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-[#00F0FF]">2</span>
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${textPrimary} mb-1`}>Claim Daily</p>
                    <p className={`text-xs ${textSecondary}`}>
                      You can claim {claimAmountFormatted} tUSDC once every 24 hours
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-2xl ${bgSecondary}`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#B967FF]/20 to-[#FF1CF7]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-[#B967FF]">3</span>
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${textPrimary} mb-1`}>Start Testing</p>
                    <p className={`text-xs ${textSecondary}`}>
                      Use the tokens to create invoices and test the platform
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`mt-6 p-4 rounded-2xl bg-gradient-to-r from-[#FF1CF7]/10 to-[#B967FF]/10 border border-[#FF1CF7]/20`}>
              <p className={`text-xs ${textSecondary} text-center`}>
                <strong className={textPrimary}>Note:</strong> These are test tokens for ShadowNet only.
                They have no real value and cannot be used on mainnet.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
