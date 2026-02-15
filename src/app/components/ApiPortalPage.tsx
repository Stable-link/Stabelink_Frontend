import { useState, useEffect } from 'react';
import {
  Code,
  Key,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Check,
  Terminal,
  Zap,
  Shield,
  Webhook,
  FileCode,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Globe,
  Lock,
  Send,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getApiKey, setApiKey } from '../../api';

interface ApiPortalPageProps {
  isDark: boolean;
}

export default function ApiPortalPage({ isDark }: ApiPortalPageProps) {
  const [apiKeyValue, setApiKeyValue] = useState('');
  const [keyVisible, setKeyVisible] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'javascript' | 'curl'>('javascript');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEvents, setWebhookEvents] = useState({
    'invoice.created': true,
    'invoice.paid': true,
    'withdrawal.completed': false,
  });
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [keySaved, setKeySaved] = useState(false);

  const currentApiKey = getApiKey();
  useEffect(() => {
    if (currentApiKey) setApiKeyValue(currentApiKey);
  }, [currentApiKey]);

  // Styling
  const glassCard = isDark
    ? 'bg-[#0a0a0f]/60 backdrop-blur-2xl border border-white/10'
    : 'bg-white/80 backdrop-blur-2xl border border-gray-200/50';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-white/60' : 'text-gray-600';
  const inputBg = isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200';

  const handleSaveKey = () => {
    const trimmed = apiKeyValue.trim();
    if (trimmed) {
      setApiKey(trimmed);
      setKeySaved(true);
      setTimeout(() => setKeySaved(false), 2000);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(type);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const maskApiKey = (key: string) => {
    return key.substring(0, 12) + '•'.repeat(40) + key.substring(key.length - 4);
  };

  const endpoints = [
    {
      id: 'create-invoice',
      method: 'POST',
      path: '/api/invoices',
      description: 'Create a new invoice for your customer',
      request: `{
  "recipient": "customer@example.com",
  "amount": 100.00,
  "currency": "USDT",
  "description": "Web Design Services",
  "dueDate": "2026-03-15"
}`
    },
    {
      id: 'get-invoice',
      method: 'GET',
      path: '/api/invoices/{id}',
      description: 'Retrieve invoice details by ID',
      request: null
    },
    {
      id: 'list-invoices',
      method: 'GET',
      path: '/api/invoices',
      description: 'List all invoices with pagination',
      request: null
    },
    {
      id: 'create-webhook',
      method: 'POST',
      path: '/api/webhooks',
      description: 'Register a webhook endpoint',
      request: `{
  "url": "https://your-domain.com/webhook",
  "events": ["invoice.paid", "invoice.created"]
}`
    }
  ];

  const codeExamples = {
    javascript: `// Install the StableLink SDK
npm install @stablelink/sdk

// Initialize the client
import StableLink from '@stablelink/sdk';

const stablelink = new StableLink({
  apiKey: 'sk_live_...',
  network: 'etherlink-mainnet'
});

// Create an invoice
const invoice = await stablelink.invoices.create({
  recipient: 'customer@example.com',
  amount: 100.00,
  currency: 'USDT',
  description: 'Web Design Services',
  dueDate: '2026-03-15'
});

console.log('Invoice created:', invoice.id);`,
    curl: `# Create an invoice
curl -X POST https://api.stablelink.xyz/v1/invoices \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "recipient": "customer@example.com",
    "amount": 100.00,
    "currency": "USDT",
    "description": "Web Design Services",
    "dueDate": "2026-03-15"
  }'

# Response
{
  "id": "inv_1234567890",
  "status": "pending",
  "amount": 100.00,
  "currency": "USDT",
  "paymentUrl": "https://pay.stablelink.xyz/inv_1234567890"
}`
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className={`text-4xl lg:text-5xl font-bold ${textPrimary} mb-3 tracking-tight`}>
            Developer API
          </h1>
          <p className={`text-lg ${textSecondary} max-w-3xl`}>
            Integrate StableLink stablecoin payments into your applications with our powerful REST API and real-time webhooks.
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-3">
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF1CF7]/20 to-[#B967FF]/20 border border-[#FF1CF7]/30 text-[#FF1CF7] text-sm font-semibold flex items-center gap-2"
          >
            <Terminal className="w-4 h-4" />
            REST API
          </motion.span>
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-semibold flex items-center gap-2"
          >
            <Webhook className="w-4 h-4" />
            Webhooks
          </motion.span>
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-purple-400 text-sm font-semibold flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Etherlink-native
          </motion.span>
        </div>
      </div>

      {/* API Keys Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${glassCard} rounded-2xl p-8 shadow-xl`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF1CF7] to-[#B967FF] flex items-center justify-center">
            <Key className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${textPrimary}`}>API Keys</h2>
            <p className={`text-sm ${textSecondary}`}>Manage your authentication credentials</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Current API Key */}
          <div className={`p-4 sm:p-5 rounded-xl ${inputBg} border`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-semibold ${textPrimary}`}>Current API Key</span>
              {currentApiKey ? (
                <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold">SET</span>
              ) : (
                <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-bold">NOT SET</span>
              )}
            </div>
            {currentApiKey ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <code className={`flex-1 font-mono text-xs sm:text-sm ${textPrimary} p-3 rounded-lg ${isDark ? 'bg-black/30' : 'bg-white/50'} break-all`}>
                  {keyVisible ? currentApiKey : maskApiKey(currentApiKey)}
                </code>
                <div className="flex items-center gap-2 sm:gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setKeyVisible(!keyVisible)}
                    className={`p-2.5 sm:p-3 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                  >
                    {keyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCopy(currentApiKey, 'key')}
                    className={`p-2.5 sm:p-3 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                  >
                    {copiedKey === 'key' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </motion.button>
                </div>
              </div>
            ) : (
              <p className={`text-sm ${textSecondary}`}>Set your key below or add VITE_API_KEY in .env.</p>
            )}
          </div>

          {/* Set / Update API Key */}
          <div className={`p-4 sm:p-5 rounded-xl ${inputBg} border`}>
            <span className={`text-sm font-semibold ${textPrimary} block mb-3`}>Set API Key</span>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type={keyVisible ? 'text' : 'password'}
                value={apiKeyValue}
                onChange={(e) => setApiKeyValue(e.target.value)}
                placeholder="Paste API key (e.g. sk_test_...)"
                className={`flex-1 font-mono text-sm px-4 py-3 rounded-xl border ${inputBg} ${textPrimary} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF1CF7]/50`}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveKey}
                disabled={!apiKeyValue.trim()}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] font-bold text-white disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {keySaved ? <Check className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                {keySaved ? 'Saved' : 'Save to browser'}
              </motion.button>
            </div>
            <p className={`text-xs ${textSecondary} mt-2`}>Stored in localStorage. Used for Invoices and API requests.</p>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
            <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className={`text-sm font-semibold text-orange-400 mb-1`}>
                Important Security Notice
              </p>
              <p className={`text-sm ${textSecondary}`}>
                Regenerating an API key will immediately invalidate the previous key. All applications using the old key will stop working.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* REST API Endpoints */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`${glassCard} rounded-2xl p-8 shadow-xl`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
            <FileCode className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${textPrimary}`}>REST API Endpoints</h2>
            <p className={`text-sm ${textSecondary}`}>Available API methods and resources</p>
          </div>
        </div>

        <div className="space-y-3">
          {endpoints.map((endpoint) => (
            <div key={endpoint.id} className={`rounded-xl ${inputBg} border overflow-hidden`}>
              <button
                onClick={() => setExpandedEndpoint(expandedEndpoint === endpoint.id ? null : endpoint.id)}
                className="w-full p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0 ${
                    endpoint.method === 'POST' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className={`font-mono text-xs sm:text-sm font-semibold ${textPrimary} break-all`}>
                    {endpoint.path}
                  </code>
                  <span className={`text-xs sm:text-sm ${textSecondary}`}>
                    {endpoint.description}
                  </span>
                </div>
                <div className="flex-shrink-0 self-end sm:self-auto">
                  {expandedEndpoint === endpoint.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {expandedEndpoint === endpoint.id && endpoint.request && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/10"
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-sm font-semibold ${textSecondary}`}>Request Example</span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCopy(endpoint.request!, `endpoint-${endpoint.id}`)}
                          className={`p-2 rounded-lg ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                        >
                          {copiedKey === `endpoint-${endpoint.id}` ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </motion.button>
                      </div>
                      <pre className={`p-4 rounded-xl ${isDark ? 'bg-black/40' : 'bg-gray-900'} overflow-x-auto`}>
                        <code className="text-sm text-cyan-400 font-mono">
                          {endpoint.request}
                        </code>
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Webhooks Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`${glassCard} rounded-2xl p-8 shadow-xl`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
            <Webhook className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${textPrimary}`}>Webhooks</h2>
            <p className={`text-sm ${textSecondary}`}>Receive real-time event notifications</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Webhook URL */}
          <div>
            <label className={`block text-sm font-semibold ${textPrimary} mb-2`}>
              Webhook Endpoint URL
            </label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-domain.com/webhook"
                className={`flex-1 px-4 py-3 rounded-xl ${inputBg} border ${textPrimary} placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FF1CF7]/50 text-sm`}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] text-white font-semibold hover:shadow-xl hover:shadow-[#FF1CF7]/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Test Webhook</span>
                <span className="sm:hidden">Test</span>
              </motion.button>
            </div>
          </div>

          {/* Event Toggles */}
          <div>
            <label className={`block text-sm font-semibold ${textPrimary} mb-3`}>
              Subscribe to Events
            </label>
            <div className="space-y-2">
              {Object.entries(webhookEvents).map(([event, enabled]) => (
                <div
                  key={event}
                  className={`flex items-center justify-between p-4 rounded-xl ${inputBg} border`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={`w-5 h-5 ${enabled ? 'text-green-500' : 'text-gray-500'}`} />
                    <div>
                      <code className={`text-sm font-semibold ${textPrimary}`}>{event}</code>
                      <p className={`text-xs ${textSecondary}`}>
                        {event === 'invoice.created' && 'Triggered when a new invoice is created'}
                        {event === 'invoice.paid' && 'Triggered when an invoice is successfully paid'}
                        {event === 'withdrawal.completed' && 'Triggered when a withdrawal is completed'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setWebhookEvents({ ...webhookEvents, [event]: !enabled })}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      enabled ? 'bg-[#FF1CF7]' : isDark ? 'bg-white/10' : 'bg-gray-300'
                    }`}
                  >
                    <motion.div
                      animate={{ x: enabled ? 28 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Code Examples */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`${glassCard} rounded-2xl p-8 shadow-xl`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Code className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${textPrimary}`}>Code Examples</h2>
            <p className={`text-sm ${textSecondary}`}>Quick start integration examples</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveCodeTab('javascript')}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeCodeTab === 'javascript'
                ? 'bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] text-white shadow-lg'
                : isDark ? 'bg-white/5 text-white/60 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            JavaScript
          </button>
          <button
            onClick={() => setActiveCodeTab('curl')}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeCodeTab === 'curl'
                ? 'bg-gradient-to-r from-[#FF1CF7] to-[#B967FF] text-white shadow-lg'
                : isDark ? 'bg-white/5 text-white/60 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            cURL
          </button>
        </div>

        {/* Code Block */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCopy(codeExamples[activeCodeTab], 'code-example')}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            {copiedKey === 'code-example' ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-white" />
            )}
          </motion.button>
          
          <pre className={`p-6 rounded-xl ${isDark ? 'bg-black/40' : 'bg-gray-900'} overflow-x-auto`}>
            <code className="text-sm font-mono text-cyan-400 leading-relaxed">
              {codeExamples[activeCodeTab]}
            </code>
          </pre>
        </div>
      </motion.div>

      {/* Rate Limits & Security */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`${glassCard} rounded-2xl p-8 shadow-xl`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${textPrimary}`}>Rate Limits & Security</h2>
            <p className={`text-sm ${textSecondary}`}>API usage limits and security features</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className={`p-5 rounded-xl ${inputBg} border`}>
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h3 className={`font-semibold ${textPrimary}`}>Rate Limits</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${textSecondary}`}>Requests per minute</span>
                <span className={`text-sm font-bold ${textPrimary}`}>100</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${textSecondary}`}>Requests per hour</span>
                <span className={`text-sm font-bold ${textPrimary}`}>5,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${textSecondary}`}>Burst limit</span>
                <span className={`text-sm font-bold ${textPrimary}`}>200</span>
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-xl ${inputBg} border`}>
            <div className="flex items-center gap-3 mb-3">
              <Lock className="w-5 h-5 text-[#FF1CF7]" />
              <h3 className={`font-semibold ${textPrimary}`}>HMAC Verification</h3>
            </div>
            <p className={`text-sm ${textSecondary} mb-3`}>
              All webhook payloads are signed with HMAC-SHA256 for authenticity verification.
            </p>
            <code className={`text-xs ${textPrimary} p-2 rounded-lg ${isDark ? 'bg-black/30' : 'bg-white/50'} block font-mono`}>
              X-StableLink-Signature
            </code>
          </div>

          <div className={`p-5 rounded-xl ${inputBg} border relative overflow-hidden`}>
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-5 h-5 text-blue-400" />
              <h3 className={`font-semibold ${textPrimary}`}>IP Allowlist</h3>
              <span className="px-2 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold">
                Coming Soon
              </span>
            </div>
            <p className={`text-sm ${textSecondary}`}>
              Restrict API access to specific IP addresses for enhanced security.
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50" />
          </div>

          <div className={`p-5 rounded-xl ${inputBg} border`}>
            <div className="flex items-center gap-3 mb-3">
              <Terminal className="w-5 h-5 text-purple-400" />
              <h3 className={`font-semibold ${textPrimary}`}>API Version</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${textSecondary}`}>Current version</span>
                <span className={`text-sm font-bold text-[#FF1CF7]`}>v1.0.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${textSecondary}`}>Base URL</span>
                <code className={`text-xs ${textPrimary} font-mono`}>api.stablelink.xyz</code>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}